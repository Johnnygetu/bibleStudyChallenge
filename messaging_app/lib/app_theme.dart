import 'package:flutter/material.dart';

/// Colors ported from the admin and reader web apps (`src/index.css`).
/// The messaging app keeps the palette but ships with the platform
/// default font — no custom font is loaded.
class AppColors {
  AppColors._();

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

  // shared shadows (from .app-nav / .menu)
  static const navShadow = <BoxShadow>[
    BoxShadow(
      offset: Offset(0, -10),
      blurRadius: 20,
      spreadRadius: -10,
      color: Color(0x0D000000),
    ),
  ];
}

/// Shared theme — mirrors the web apps' component styling (cards, buttons,
/// inputs) while keeping the default platform font.
class AppTheme {
  AppTheme._();

  static ThemeData light() {
    final scheme = ColorScheme.light(
      primary: AppColors.primary400,
      onPrimary: AppColors.ink950,
      secondary: AppColors.ember500,
      onSecondary: AppColors.ink950,
      error: AppColors.danger500,
      surface: AppColors.ink850,
      onSurface: AppColors.ink100,
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      scaffoldBackgroundColor: AppColors.ink950,
      splashColor: AppColors.primary400.withValues(alpha: 0.08),
      highlightColor: AppColors.primary400.withValues(alpha: 0.04),
      splashFactory: InkSplash.splashFactory,
      // No fontFamily set anywhere — the default platform font is used.
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
