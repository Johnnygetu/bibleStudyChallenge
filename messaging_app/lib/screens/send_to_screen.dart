import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../app_theme.dart';
import '../constants.dart';
import '../sms_sender.dart';
import '../widgets/primary_button.dart';

/// One reader the messaging API returned, ready for SMS dispatch.
/// The record keeps only the columns the sender needs.
typedef ReaderRecipient = ({int id, String name, String phone});

/// What the progress modal shows: the fetching phase while the server
/// answers, then per-reader counters once the SMS loop runs.
typedef SendModalProgress = ({
  bool fetching,
  int sending,
  int total,
  String name,
  String phone,
});

/// Recipient chooser opened from the main screen's Send button.
/// Once an audience option is picked, the Send button asks the server for
/// that audience and then dispatches the draft to every returned reader
/// over SMS, silently in the background.
class SendToScreen extends StatefulWidget {
  const SendToScreen({super.key, required this.message});

  /// The drafted message being sent.
  final String message;

  @override
  State<SendToScreen> createState() => _SendToScreenState();
}

class _SendToScreenState extends State<SendToScreen> {
  /// `value` is the audience name the backend messaging route expects.
  static const _audiences = <({IconData icon, String label, String value})>[
    (icon: Icons.groups, label: 'All Readers', value: 'all'),
    (icon: Icons.trending_down, label: 'Lagging Readers', value: 'lagging'),
    (icon: Icons.star_outline, label: 'Group Leaders', value: 'leaders'),
  ];

  /// What the progress modal shows before anything is fetched.
  static const _progressAtRest = (
    fetching: true,
    sending: 0,
    total: 0,
    name: '',
    phone: '',
  );

  /// Index of the chosen option, or null until one is selected.
  int? _selected;

  /// True while the reader list is being fetched and SMS dispatched, so
  /// the send button cannot be pressed twice mid-loop.
  bool _sending = false;

  /// Live counters the progress modal listens to during the dispatch.
  late final ValueNotifier<SendModalProgress> _progress = ValueNotifier(
    _progressAtRest,
  );

  /// Whether the modal route is currently on the navigation stack, so the
  /// screen itself is never popped by mistake when closing it.
  bool _progressModalOpen = false;

  @override
  void dispose() {
    _progress.dispose();
    super.dispose();
  }

  Future<void> _send() async {
    final option = _audiences[_selected!];
    setState(() => _sending = true);

    try {
      _progress.value = _progressAtRest;
      _openProgressModal();

      final readers = await _fetchRecipients(option);
      if (readers == null) {
        // Popping with null keeps the draft on the main screen.
        _closeProgressModal();
        if (mounted) Navigator.of(context).pop();
        return;
      }

      final report = await SmsSender().sendToAll(
        recipients: readers,
        message: widget.message,
        onProgress: _updateSendProgress,
      );

      _closeProgressModal();
      debugPrint(report.summary);
      if (report.details.isNotEmpty) debugPrint(report.details);

      // Popping with the report tells the main screen the message went
      // out and gives it the numbers for a summary snackbar.
      if (mounted) Navigator.of(context).pop(report);
    } catch (error) {
      // Unexpected failure — never leave the modal stuck on screen. The
      // draft is kept and the main screen shows nothing sent.
      _closeProgressModal();
      debugPrint('Sending failed unexpectedly: $error');
      if (mounted) Navigator.of(context).pop();
    } finally {
      if (mounted) setState(() => _sending = false);
      _progressModalOpen = false;
    }
  }

  /// Feed the sender's per-reader ticks to the modal.
  void _updateSendProgress(SmsProgress sms) {
    _progress.value = (
      fetching: false,
      sending: sms.sending,
      total: sms.total,
      name: sms.name,
      phone: sms.phone,
    );
  }

  /// The follow-along modal: it cannot be dismissed — not by the barrier,
  /// not by the back button — while the loop is in flight.
  void _openProgressModal() {
    _progressModalOpen = true;
    showDialog(
      context: context,
      barrierDismissible: false,
      barrierColor: Colors.black54,
      builder: (_) => _SendProgressDialog(progress: _progress),
    );
  }

  /// Remove the modal from on top of the stack (the topmost route while it
  /// is open is the dialog itself).
  void _closeProgressModal() {
    if (!_progressModalOpen || !mounted) return;
    _progressModalOpen = false;
    Navigator.of(context).pop();
  }

  /// Ask the server for the chosen audience. Returns null when the API is
  /// unreachable so the caller knows nothing was dispatched.
  Future<List<ReaderRecipient>?> _fetchRecipients(
    ({IconData icon, String label, String value}) option,
  ) async {
    try {
      final response = await http
          .get(
            Uri.parse(
              '$apiUrl/messaging/readers',
            ).replace(queryParameters: {'audience': option.value}),
            headers: {'Accept': 'application/json'},
          )
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final readers = jsonDecode(response.body) as List;
        debugPrint('Got ${readers.length} readers for ${option.label}.');
        return readers
            .whereType<Map<String, dynamic>>()
            .map(
              (reader) => (
                id: (reader['id'] as num).toInt(),
                name: reader['name'] as String? ?? '',
                phone: reader['phone_number'] as String? ?? '',
              ),
            )
            .toList();
      }

      debugPrint(
        'Messaging API answered HTTP ${response.statusCode} for ${option.label}.',
      );
    } catch (error) {
      debugPrint('Could not reach the messaging API: $error');
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    // Phone-like shell, same as the main screen and the web apps.
    return Scaffold(
      // Send button pinned to the bottom of the scaffold — it only appears
      // once an audience option has been selected.
      bottomNavigationBar: _selected != null
          ? SafeArea(
              top: false,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
                child: PrimaryButton(
                  label: _sending ? 'Sending…' : 'Send',
                  icon: Icons.send,
                  enabled: !_sending,
                  onPressed: _send,
                ),
              ),
            )
          : null,
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 448),
            child: ScrollConfiguration(
              behavior: const ScrollBehavior().copyWith(scrollbars: false),
              child: ListView(
                padding: const EdgeInsets.fromLTRB(20, 24, 20, 24),
                children: [
                  _buildHeader(),
                  const SizedBox(height: 24),
                  for (final (index, audience) in _audiences.indexed) ...[
                    _AudienceOption(
                      icon: audience.icon,
                      label: audience.label,
                      selected: _selected == index,
                      onTap: () => setState(() => _selected = index),
                    ),
                    if (index != _audiences.length - 1)
                      const SizedBox(height: 10),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  /// "Send To" title centered between a ghost back button and its spacer.
  Widget _buildHeader() {
    return Row(
      children: [
        IconButton(
          tooltip: 'Back',
          onPressed: () => Navigator.of(context).maybePop(),
          icon: const Icon(
            Icons.chevron_left,
            size: 24,
            color: AppColors.ink400,
          ),
        ),
        const Expanded(
          child: Center(
            child: Text(
              'Send To',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: AppColors.ink100,
              ),
            ),
          ),
        ),
        const SizedBox(width: 48),
      ],
    );
  }
}

/// Selectable audience card — navy fill when active, mirroring the web
/// apps' `.toggle-btn.active` state.
class _AudienceOption extends StatelessWidget {
  const _AudienceOption({
    required this.icon,
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: selected ? AppColors.primary400 : AppColors.ink850,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: selected
            ? const BorderSide(color: AppColors.primary400, width: 1.5)
            : const BorderSide(
                color: Color(0x80E5E5E5),
              ), // rgba(229,229,229,.5)
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
          child: Row(
            children: [
              // Leading icon circle — light tint flips when selected.
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: selected
                      ? const Color(0x1AFFFFFF) // rgba(255,255,255,.1)
                      : const Color(0x1A022942), // rgba(2,41,66,.1)
                  shape: BoxShape.circle,
                ),
                alignment: Alignment.center,
                child: Icon(
                  icon,
                  size: 20,
                  color: selected ? AppColors.ink950 : AppColors.primary400,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: selected ? AppColors.ink950 : AppColors.ink100,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              // Radio indicator: filled circle when chosen.
              Container(
                width: 20,
                height: 20,
                decoration: BoxDecoration(
                  color: selected ? AppColors.ink950 : null,
                  shape: BoxShape.circle,
                  border: selected
                      ? null
                      : Border.all(color: AppColors.ink600, width: 2),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Modal that follows the dispatch: a spinner while the reader list is on
/// its way from the server, then the count-up — which reader the loop is
/// on and how many are still left. Cannot be dismissed mid-dispatch.
class _SendProgressDialog extends StatelessWidget {
  const _SendProgressDialog({required this.progress});

  final ValueNotifier<SendModalProgress> progress;

  @override
  Widget build(BuildContext context) {
    return PopScope(
      // The loop cannot be interrupted from here: no back-button escape.
      canPop: false,
      child: Dialog(
        backgroundColor: AppColors.ink850,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: ValueListenableBuilder<SendModalProgress>(
            valueListenable: progress,
            builder: (context, state, _) {
              if (state.fetching) {
                return const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(
                        strokeWidth: 3,
                        color: AppColors.primary400,
                      ),
                    ),
                    SizedBox(width: 16),
                    Text(
                      'Fetching readers…',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: AppColors.ink100,
                      ),
                    ),
                  ],
                );
              }
              return _SendingCounters(state: state);
            },
          ),
        ),
      ),
    );
  }
}

/// The sending phase's live numbers, rebuilt on every progress tick.
class _SendingCounters extends StatelessWidget {
  const _SendingCounters({required this.state});

  final SendModalProgress state;

  @override
  Widget build(BuildContext context) {
    final left = state.total - state.sending;
    // The reader being worked is number `sending`; below it, how finished
    // the pass is for the bar.
    final finished = state.sending - 1;

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Text(
          'Sending SMS',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: AppColors.ink400,
            letterSpacing: 1.8,
          ),
        ),
        const SizedBox(height: 10),
        Text(
          '${state.sending} of ${state.total}',
          style: const TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.w700,
            color: AppColors.ink100,
          ),
        ),
        const SizedBox(height: 12),
        LinearProgressIndicator(
          value: state.total == 0 ? null : finished / state.total,
          minHeight: 6,
          borderRadius: BorderRadius.circular(3),
          color: AppColors.primary400,
          backgroundColor: AppColors.ink750,
        ),
        const SizedBox(height: 8),
        Text(
          left == 1 ? '1 reader left' : '$left readers left',
          style: const TextStyle(fontSize: 13, color: AppColors.ink500),
        ),
        const SizedBox(height: 12),
        // Who the loop is working on right now.
        Text(
          state.name.trim().isEmpty ? state.phone : state.name,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w600,
            color: AppColors.ink100,
          ),
        ),
        if (state.phone.isNotEmpty)
          Text(
            state.phone,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 13, color: AppColors.ink400),
          ),
      ],
    );
  }
}
