function getTelegramWebApp() {
  return window.Telegram?.WebApp ?? null;
}
function getTelegramUser() {
  return window.Telegram?.WebApp?.initDataUnsafe?.user ?? null;
}
function getTelegramInitData() {
  return window.Telegram?.WebApp?.initData ?? "";
}
function hapticImpact(style = "light") {
  try {
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(style);
  } catch {
  }
}
function hapticNotification(type) {
  try {
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred(type);
  } catch {
  }
}
function hapticSelection() {
  try {
    window.Telegram?.WebApp?.HapticFeedback?.selectionChanged();
  } catch {
  }
}
export {
  getTelegramInitData,
  getTelegramUser,
  getTelegramWebApp,
  hapticImpact,
  hapticNotification,
  hapticSelection
};
