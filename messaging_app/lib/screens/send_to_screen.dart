import 'package:flutter/material.dart';

import '../app_theme.dart';
import '../widgets/primary_button.dart';

/// Recipient chooser opened from the main screen's Send button.
/// Shows audiences like All Readers and Lagging Readers; once one is picked
/// a Send button appears below the options. UI only — nothing is dispatched.
class SendToScreen extends StatefulWidget {
  const SendToScreen({super.key, required this.message});

  /// The drafted message being sent — wired to the server later.
  final String message;

  @override
  State<SendToScreen> createState() => _SendToScreenState();
}

class _SendToScreenState extends State<SendToScreen> {
  static const _audiences = <({IconData icon, String label})>[
    (icon: Icons.groups, label: 'All Readers'),
    (icon: Icons.trending_down, label: 'Lagging Readers'),
    (icon: Icons.star_outline, label: 'Group Leaders'),
  ];

  /// Index of the chosen option, or null until one is selected.
  int? _selected;

  void _send() {
    // UI only — the actual dispatch goes through the server later.
    // Popping with true tells the main screen the message went out.
    Navigator.of(context).pop(true);
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
                  label: 'Send',
                  icon: Icons.send,
                  enabled: true,
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
          icon: const Icon(Icons.chevron_left, size: 24, color: AppColors.ink400),
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
            : const BorderSide(color: Color(0x80E5E5E5)), // rgba(229,229,229,.5)
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
