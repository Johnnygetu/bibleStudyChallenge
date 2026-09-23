export function getTelegramWebApp() {
  return window.Telegram?.WebApp ?? null;
}

export function getTelegramUser() {
  return window.Telegram?.WebApp?.initDataUnsafe?.user ?? null;
}

export function getTelegramInitData() {
  return window.Telegram?.WebApp?.initData ?? "";
}

// Resolves with the Telegram user as soon as it is available. The
// telegram-web-app.js script may populate initDataUnsafe after React mounts,
// so we poll briefly instead of trusting a single synchronous read.
export function waitForTelegramUser(timeout = 3000) {
  return new Promise((resolve) => {
    const existing = getTelegramUser();
    if (existing) {
      resolve(existing);
      return;
    }
    const startedAt = Date.now();
    const timer = setInterval(() => {
      const user = getTelegramUser();
      if (user) {
        clearInterval(timer);
        resolve(user);
      } else if (Date.now() - startedAt >= timeout) {
        clearInterval(timer);
        resolve(null);
      }
    }, 50);
  });
}

// Asks Telegram for the user's phone number via the native consent popup.
// callback(success, contact) where contact = { first_name, last_name, phone_number, user_id }.
export function requestTelegramContact(callback) {
  const webApp = getTelegramWebApp();
  if (!webApp || typeof webApp.requestContact !== "function") {
    callback(false, null);
    return;
  }
  try {
    webApp.requestContact((success, info) => {
      if (success && info?.status === "sent" && info.responseUnsafe?.contact) {
        callback(true, info.responseUnsafe.contact);
      } else {
        callback(false, null);
      }
    });
  } catch {
    // Unsupported version or a request already in flight.
    callback(false, null);
  }
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
