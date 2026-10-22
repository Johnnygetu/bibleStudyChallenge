import 'package:flutter/material.dart';

import '../app_theme.dart';
import '../widgets/primary_button.dart';
import 'send_to_screen.dart';

/// The messaging app's main screen: a large compose box where the message
/// is written, and a send button below it. UI only — no server wiring yet.
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
    // message is confirmed sent there, so backing out keeps the draft.
    final sent = await Navigator.of(context).push<bool>(
      MaterialPageRoute(
        builder: (_) => SendToScreen(message: _messageController.text.trim()),
      ),
    );
    if (sent == true) _messageController.clear();
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
                  const SizedBox(height: 24),
                  // Large message box takes the rest of the screen.
                  Expanded(
                    child: _MessageInput(controller: _messageController),
                  ),
                  const SizedBox(height: 16),
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

/// Large multi-line input — white card, hairline border, navy focus ring.
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
        fontSize: 15,
        height: 1.5,
        color: AppColors.ink100,
      ),
      decoration: InputDecoration(
        filled: true,
        fillColor: AppColors.ink850,
        hintText: 'Write your message…',
        hintStyle: const TextStyle(
          fontSize: 15,
          height: 1.5,
          color: AppColors.ink500,
        ),
        contentPadding: const EdgeInsets.all(16),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.ink750),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(
            color: Color(0x80022942), // rgba(2, 41, 66, 0.5)
            width: 2,
          ),
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.ink750),
        ),
      ),
    );
  }
}

/// Brand header — the Ayat Mekane Eyesus cross logo tinted navy the same way
/// the web apps render it (white logo alpha-shaped over the page background).
class _BrandHeader extends StatelessWidget {
  const _BrandHeader();

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Image.asset(
          'assets/ayat-logo.png',
          width: 48,
          height: 48,
          fit: BoxFit.contain,
          color: AppColors.primary400,
          colorBlendMode: BlendMode.srcIn,
        ),
        const SizedBox(width: 16),
        const Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'AYAT MEKANE EYESUS',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 18,
                  height: 1.25,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary400,
                  letterSpacing: 0.9,
                ),
              ),
              Text(
                'MESSAGING',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 12,
                  height: 1.25,
                  fontWeight: FontWeight.w600,
                  color: AppColors.ink400,
                  letterSpacing: 1.8,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
