import 'package:flutter/material.dart';

import '../app_theme.dart';
import '../sms_sender.dart';
import '../widgets/primary_button.dart';
import 'send_to_screen.dart';

/// The messaging app's main screen: a large compose box where the message
/// is written, and a send button below it.
class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  final _messageController = TextEditingController();

  bool get _canSend => _messageController.text.trim().isNotEmpty;

  @override
  void initState() {
    super.initState();
    // Rebuild on every keystroke so the send button enables/disables live.
    _messageController.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  Future<void> _send() async {
    if (!_canSend) return;
    // Hand the draft to the recipient picker; the box clears only if the
    // message went out, so backing out keeps the draft.
    final report = await Navigator.of(context).push<SmsDispatchReport>(
      MaterialPageRoute(
        builder: (_) => SendToScreen(message: _messageController.text.trim()),
      ),
    );
    if (report == null || !mounted) return;
    _messageController.clear();

    // Colour the outcome: green when every reader got the message, amber
    // with partial failures, red when the permission was refused.
    final (color, textColor) = switch (report) {
      _ when !report.permissionGranted => (
        AppColors.danger600,
        AppColors.ink950,
      ),
      _ when report.failed > 0 => (AppColors.amber500, AppColors.ink100),
      _ => (AppColors.success600, AppColors.ink950),
    };

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        behavior: SnackBarBehavior.floating,
        backgroundColor: color,
        duration: report.failed > 0
            ? const Duration(seconds: 6)
            : const Duration(seconds: 4),
        content: Text(
          report.summary,
          style: TextStyle(color: textColor, fontWeight: FontWeight.w600),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // Phone-like shell, same as the admin/reader web apps.
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 448),
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 24, 20, 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const _BrandHeader(),
                  const SizedBox(height: 20),
                  // Large message box takes the rest of the screen.
                  Expanded(
                    child: _MessageInput(controller: _messageController),
                  ),
                  const SizedBox(height: 14),
                  PrimaryButton(
                    label: 'Send',
                    icon: Icons.send,
                    enabled: _canSend,
                    onPressed: () => _send(),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Large multi-line input — a white card that rises off the canvas, quiet
/// hairline until focus, then a navy ring. Writing happens top-left.
class _MessageInput extends StatelessWidget {
  const _MessageInput({required this.controller});

  final TextEditingController controller;

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      expands: true,
      maxLines: null,
      keyboardType: TextInputType.multiline,
      textAlignVertical: TextAlignVertical.top,
      cursorColor: AppColors.primary400,
      cursorWidth: 2,
      style: const TextStyle(
        fontSize: 16,
        height: 1.45,
        color: AppColors.ink100,
      ),
      decoration: InputDecoration(
        filled: true,
        fillColor: AppColors.surface,
        hintText: 'Write your message…',
        hintStyle: const TextStyle(
          fontSize: 16,
          height: 1.45,
          color: AppColors.ink600,
        ),
        contentPadding: const EdgeInsets.fromLTRB(18, 18, 18, 16),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.hairline),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(
            color: Color(0x66022942), // rgba(2, 41, 66, 0.4)
            width: 1.5,
          ),
        ),
      ),
    );
  }
}

/// Brand header — a navy squircle badge carrying the white cross logo, next
/// to the two-line wordmark. The one element meant to be remembered.
class _BrandHeader extends StatelessWidget {
  const _BrandHeader();

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 48,
          height: 48,
          decoration: const BoxDecoration(
            color: AppColors.primary400,
            borderRadius: BorderRadius.all(Radius.circular(14)),
          ),
          // The logo PNG is white-on-transparent, so on the navy badge it is
          // used as-is — no srcIn tint needed.
          alignment: Alignment.center,
          child: Image.asset(
            'assets/ayat-logo.png',
            height: 34,
            fit: BoxFit.contain,
          ),
        ),
        const SizedBox(width: 14),
        const Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'AYAT MEKANE EYESUS',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 19,
                  height: 1.2,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary400,
                  letterSpacing: 0.2,
                ),
              ),
              Text(
                'MESSAGING',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 12,
                  height: 1.4,
                  fontWeight: FontWeight.w500,
                  color: AppColors.ink400,
                  letterSpacing: 1.1,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
