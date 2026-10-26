import 'package:flutter/material.dart';

/// Colors ported from the admin and reader web apps (`src/index.css`).
/// The messaging app keeps the palette and now carries a single premium
/// type voice: Bricolage Grotesque across the whole interface.
class AppColors {
  AppColors._();

  // canvas & surfaces — the depth hierarchy is canvas < white card.
  static const canvas = Color(0xFFEEF1F4);
  static const surface = Color(0xFFFFFFFF);
  static const hairline = Color(0xFFDFE4E9);

  // ink (surfaces & text)
  static const ink950 = Color(0xFFF5F5F5);
  static const ink900 = Color(0xFFECECEC);
  static const ink850 = Color(0xFFFFFFFF);
  static const ink800 = Color(0xFFF0F0F0);
  static const ink750 = Color(0xFFEAEAEA);
  static const ink700 = Color(0xFFE5E5E5);
  static const ink600 = Color(0xFFA3A3A3);
  static const ink500 = Color(0xFF737373);
  static const ink400 = Color(0xFF525252);
  static const ink300 = Color(0xFF404040);
  static const ink200 = Color(0xFF262626);
  static const ink100 = Color(0xFF171717);
  static const ink50 = Color(0xFF0A0A0A);

  // primary (deep navy)
  static const primary50 = Color(0xFFCBE4F7);
  static const primary100 = Color(0xFFA3CFF1);
  static const primary200 = Color(0xFF54A8E5);
  static const primary300 = Color(0xFF033B5C);
  static const primary400 = Color(0xFF022942);
  static const primary500 = Color(0xFF011E30);
  static const primary600 = Color(0xFF01121D);
  static const primary700 = Color(0xFF000B12);

  // accents
  static const ember500 = Color(0xFFE8590C);
  static const ember600 = Color(0xFFD04A06);
  static const success500 = Color(0xFF2F9E44);
  static const success600 = Color(0xFF237B32);
  static const danger500 = Color(0xFFE03131);
  static const danger600 = Color(0xFFC92A2A);
  static const amber500 = Color(0xFFF59E0B);

  /// Soft navy elevation used by the primary button and the bottom dock —
  /// shadows stay navy-tinted rather than black so surfaces sit *in* the
  /// palette.
  static const primaryShadow = Color(0x2E011E30); // rgba(1,30,48,.18)

  // shared shadows (from .app-nav / .menu)
  static const navShadow = <BoxShadow>[
    BoxShadow(
      offset: Offset(0, -10),
      blurRadius: 20,
      spreadRadius: -10,
      color: Color(0x0D000000),
    ),
  ];

  /// Hairline rule for the docked send tray on the Send To screen.
  static const dockLine = Color(0xFFDDE2E8);
}

/// Shared theme — one type family at four weights, quiet hairlines, navy
/// answers every heading, selection, and action; greys carry reading.
class AppTheme {
  AppTheme._();

  /// The registered family in pubspec.yaml; referenced by name so widgets
  /// with their own explicit TextStyles still inherit the voice.
  static const fontFamily = 'Bricolage Grotesque';

  static ThemeData light() {
    final scheme = ColorScheme.light(
      primary: AppColors.primary400,
      onPrimary: AppColors.ink950,
      secondary: AppColors.ember500,
      onSecondary: AppColors.ink950,
      error: AppColors.danger500,
      surface: AppColors.surface,
      onSurface: AppColors.ink100,
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      fontFamily: fontFamily,
      scaffoldBackgroundColor: AppColors.canvas,
      splashColor: AppColors.primary400.withValues(alpha: 0.08),
      highlightColor: AppColors.primary400.withValues(alpha: 0.04),
      splashFactory: InkSplash.splashFactory,
      dividerTheme: const DividerThemeData(color: AppColors.hairline),
      snackBarTheme: const SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(14)),
        ),
      ),
      dialogTheme: const DialogThemeData(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(20)),
        ),
      ),
      // No custom text overrides per role — each surface styles its own
      // Text run explicitly; the family flows in through fontFamily.
      textTheme: const TextTheme(
        bodyLarge: TextStyle(color: AppColors.ink100),
        bodyMedium: TextStyle(color: AppColors.ink100),
        bodySmall: TextStyle(color: AppColors.ink400),
      ),
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: AppColors.primary400,
        foregroundColor: AppColors.ink950,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(12)),
        ),
      ),
    );
  }
}
