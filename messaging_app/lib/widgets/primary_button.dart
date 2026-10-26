import 'package:flutter/material.dart';

import '../app_theme.dart';

/// Navy full-width action button — the app's single action voice: primary
/// fill, light label, 14px radius, a soft navy elevation rather than a grey
/// one, and the 0.5 opacity disabled state ported from the web apps.
class PrimaryButton extends StatelessWidget {
  const PrimaryButton({
    super.key,
    required this.label,
    this.icon,
    required this.enabled,
    required this.onPressed,
  });

  final String label;
  final IconData? icon;
  final bool enabled;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Opacity(
      // Fading the whole block also fades the shadow away, so the disabled
      // state reads flat rather than merely washed out.
      opacity: enabled ? 1 : 0.45,
      child: Material(
        color: enabled ? AppColors.primary400 : AppColors.primary500,
        borderRadius: BorderRadius.circular(14),
        shadowColor: AppColors.primaryShadow,
        elevation: enabled ? 3 : 0,
        child: InkWell(
          borderRadius: BorderRadius.circular(14),
          onTap: enabled ? onPressed : null,
          child: SizedBox(
            height: 54,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (icon != null) ...[
                  Icon(icon, size: 18, color: AppColors.ink950),
                  const SizedBox(width: 9),
                ],
                Text(
                  label,
                  style: const TextStyle(
                    fontSize: 15.5,
                    fontWeight: FontWeight.w600,
                    color: AppColors.ink950,
                    letterSpacing: -0.1,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
