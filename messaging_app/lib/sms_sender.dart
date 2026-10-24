import 'package:flutter/foundation.dart';
import 'package:telephony_sms/telephony_sms.dart';

/// One recipient the dispatch could not reach.
class SmsFailure {
  const SmsFailure({required this.recipient, required this.reason});

  /// Human-readable identifier — name and phone number.
  final String recipient;

  /// What went wrong, e.g. `limitExceeded: Sending rate limit reached`.
  final String reason;
}

/// Progress tick fired once per returned reader: how far into the loop the
/// dispatch is right now and who is being worked on.
typedef SmsProgress = ({int sending, int total, String name, String phone});
typedef SmsProgressCallback = void Function(SmsProgress progress);

/// What a [SmsSender.sendToAll] pass did, so the UI can state the result.
class SmsDispatchReport {
  const SmsDispatchReport({
    required this.permissionGranted,
    required this.attempted,
    required this.sent,
    required this.failed,
    required this.failures,
  });

  /// Whether the SEND_SMS runtime permission was granted. When false no
  /// message was attempted at all.
  final bool permissionGranted;

  /// How many recipients had a usable phone number and were tried.
  final int attempted;

  /// How many messages the radio confirmed as sent.
  final int sent;

  /// Recipients that still failed after every retry.
  final int failed;
  final List<SmsFailure> failures;

  /// One-line outcome for the sending screen to display.
  String get summary {
    if (!permissionGranted) {
      return 'SMS permission was denied, so no message was sent.';
    }
    if (failed == 0) {
      return 'Message sent to $sent reader${sent == 1 ? '' : 's'}.';
    }
    return 'Message sent to $sent of ${sent + failed} readers ($failed failed).';
  }

  /// Detailed, multi-line outcome for logs and the operator to review.
  String get details => [
    for (final failure in failures) '✗ ${failure.recipient}: ${failure.reason}',
  ].join('\n');
}

/// Sends one message to a list of readers over SMS, silently, in the
/// background.
///
/// Android only: the underlying telephony_sms plugin wraps Android's
/// `SmsManager`, which has no iOS equivalent. Requires SEND_SMS to be
/// declared in the main AndroidManifest.
class SmsSender {
  SmsSender({TelephonySMS? telephony})
    : _telephony = telephony ?? TelephonySMS();

  final TelephonySMS _telephony;

  /// Breathing room between sends: Android rate-limits background SMS, and
  /// a tight loop trips the cap (`limitExceeded`) after the first few
  /// messages.
  static const _pauseBetweenSends = Duration(seconds: 1);

  /// How long to wait out a rate-limit hit before retrying, and how many
  /// such retries one recipient gets.
  static const _rateLimitCooldown = Duration(seconds: 30);
  static const _maxRateLimitRetries = 2;

  /// Send [message] to every recipient, one by one.
  ///
  /// Permission is requested first — the dialog shows on the first run and
  /// resolves immediately afterwards. Recipients without a phone number are
  /// counted as failures rather than silently dropped, and every send is
  /// reported per the plugin: a send "sends" only once the radio confirms,
  /// so the numbers in the report are honest.
  ///
  /// [onProgress] fires once per returned reader, right before that reader
  /// is tried, so a progress modal can show the position in the loop.
  Future<SmsDispatchReport> sendToAll({
    required List<({int id, String name, String phone})> recipients,
    required String message,
    SmsProgressCallback? onProgress,
  }) async {
    var granted = false;
    try {
      granted = await _telephony.requestPermission();
    } on TelephonySmsException catch (error) {
      // Usually permissionNotDeclared (manifest) or unsupportedPlatform.
      debugPrint(
        'Could not request the SMS permission: '
        '${error.code.name} — ${error.message}',
      );
    }

    if (!granted) {
      debugPrint('SEND_SMS not granted — dispatching nothing.');
      return SmsDispatchReport(
        permissionGranted: false,
        attempted: 0,
        sent: 0,
        failed: 0,
        failures: const [],
      );
    }

    var sent = 0;
    final failures = <SmsFailure>[];

    for (final (index, recipient) in recipients.indexed) {
      // Announce the position before working on this reader, including the
      // ones with no phone number — every returned reader counts.
      onProgress?.call((
        sending: index + 1,
        total: recipients.length,
        name: recipient.name,
        phone: recipient.phone,
      ));

      // Fail the recipient when the record has no usable number.
      if (recipient.phone.trim().isEmpty) {
        failures.add(
          SmsFailure(
            recipient: _labelFor(recipient),
            reason: 'No phone number on file.',
          ),
        );
        debugPrint('${recipient.name}: no phone number, skipping.');
        continue;
      }

      final attempt = await _sendWithRetries(
        phone: recipient.phone,
        message: message,
      );

      if (attempt == null) {
        sent++;
        debugPrint('SMS sent to ${recipient.name} <${recipient.phone}>.');
      } else {
        failures.add(
          SmsFailure(recipient: _labelFor(recipient), reason: attempt),
        );
        debugPrint(
          'SMS to ${recipient.name} <${recipient.phone}> failed: $attempt',
        );
      }

      // Pause before the next send so the device's SMS rate limit is not
      // hit by this very loop — the last recipient needs no pause.
      final lastIndex = recipients.length - 1;
      if (index != lastIndex) {
        await Future<void>.delayed(_pauseBetweenSends);
      }
    }

    return SmsDispatchReport(
      permissionGranted: true,
      attempted: recipients.length,
      sent: sent,
      failed: failures.length,
      failures: failures,
    );
  }

  /// Send with a backoff for the one failure a bulk loop can cause itself:
  /// Android's SMS rate cap. `limitExceeded` clears after a wait, so the
  /// recipient is retried; everything else fails the recipient immediately.
  Future<String?> _sendWithRetries({
    required String phone,
    required String message,
  }) async {
    for (var retry = 0; ; retry++) {
      try {
        await _telephony.sendSMS(phone: phone, message: message);
        return null;
      } on TelephonySmsException catch (error) {
        final rateLimited = error.code.name == 'limitExceeded';
        if (rateLimited && retry < _maxRateLimitRetries) {
          debugPrint(
            'Send rate-limited — waiting '
            '${_rateLimitCooldown.inSeconds}s before retry $retry of 2.',
          );
          await Future<void>.delayed(_rateLimitCooldown);
          continue;
        }
        return '${error.code.name} — ${error.message}';
      }
    }
  }

  String _labelFor(({int id, String name, String phone}) recipient) {
    return recipient.name.trim().isEmpty ? recipient.phone : recipient.name;
  }
}
