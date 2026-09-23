export function getTelegramWebApp() {
  return window.Telegram?.WebApp ?? null;
}

export function getTelegramUser() {
  return window.Telegram?.WebApp?.initDataUnsafe?.user ?? null;
}

export function getTelegramInitData() {
  return window.Telegram?.WebApp?.initData ?? "";
}

export function hapticImpact(style = "light") {
  try {
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(style);
  } catch {
    // ignore
  }
}

export function hapticNotification(type) {
  try {
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred(type);
  } catch {
    // ignore
  }
}

export function hapticSelection() {
  try {
    window.Telegram?.WebApp?.HapticFeedback?.selectionChanged();
  } catch {
    // ignore
  }
}
