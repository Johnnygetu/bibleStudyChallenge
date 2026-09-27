import { createContext, useContext, useEffect, useState } from "react";
import { isTelegramContext, waitForTelegramUser } from "@/lib/telegram";
import { useGeneralContext } from "@/context/GeneralContext";

const STORAGE_KEY = "bible_challenge_user_details";

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function composeFullName(telegramUser) {
  if (!telegramUser) return "";
  return `${telegramUser.first_name ?? ""} ${telegramUser.last_name ?? ""}`.trim();
}

// ---------------------------------------------------------------------------
// TEMPORARY (local development): the Telegram gate is switched off so the app
// can be exercised in a plain browser. Flip TELEGRAM_REQUIRED back to `true`
// to restore the "Telegram required" gate — the real path is untouched.
// ---------------------------------------------------------------------------
const TELEGRAM_REQUIRED = false;
const DEV_CHAT_ID_STORAGE_KEY = "bible_challenge_dev_chat_id";

// A 10-digit id in the 9xxxxxxxxx range, which real Telegram chat ids never
// reach, so a stand-in id can't shadow a genuine one.
function generateFakeChatId() {
  return 9000000000 + Math.floor(Math.random() * 1000000000);
}

// Stable per device: a fresh id on every load would create a new tg_users row
// each time and orphan the previous registration.
function loadOrCreateFakeChatId() {
  try {
    const stored = localStorage.getItem(DEV_CHAT_ID_STORAGE_KEY);
    if (stored && /^\d+$/.test(stored)) return Number(stored);
    const generated = generateFakeChatId();
    localStorage.setItem(DEV_CHAT_ID_STORAGE_KEY, String(generated));
    return generated;
  } catch {
    return generateFakeChatId();
  }
}

// A stand-in user for plain-browser runs. Available immediately, so there is
// no 3s "Waiting for Telegram…" stall, and it disappears (letting the real
// Telegram path run) as soon as the gate is turned back on or a genuine
// Telegram launch is detected.
function localFallbackUser() {
  if (TELEGRAM_REQUIRED) return null;
  if (isTelegramContext()) return null;
  return { id: loadOrCreateFakeChatId() };
}

// Owns everything user-related: the Telegram user (name + chat id), the
// registered user saved on this device, and the registration flow itself.
export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);
  const [telegramUser, setTelegramUser] = useState(() => localFallbackUser());
  // "loading" -> "ready" once the chat id is known, "failed" if Telegram
  // never delivers a user (e.g. opened outside the bot, script blocked).
  const [telegramStatus, setTelegramStatus] = useState(telegramUser ? "ready" : "loading");
  const [telegramAttempt, setTelegramAttempt] = useState(0);
  const { apiUrl } = useGeneralContext();

  // Hydrate the Telegram user when it becomes available (first open).
  // Bumping telegramAttempt (Retry) re-runs the wait.
  useEffect(() => {
    // Outside Telegram the stand-in user is already set, so there is nothing
    // to wait for — don't stall the register button behind a 3s poll.
    if (!TELEGRAM_REQUIRED && !isTelegramContext()) {
      setTelegramStatus("ready");
      return;
    }

    let cancelled = false;
    setTelegramStatus("loading");
    waitForTelegramUser().then((tu) => {
      if (cancelled) return;
      if (tu) {
        setTelegramUser(tu);
        setTelegramStatus("ready");
      } else if (TELEGRAM_REQUIRED) {
        setTelegramStatus("failed");
      } else {
        // Telegram was present but never produced a user — fall back so the
        // app still works while the gate is off.
        setTelegramUser({ id: loadOrCreateFakeChatId() });
        setTelegramStatus("ready");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [telegramAttempt]);

  const retryTelegram = () => setTelegramAttempt((n) => n + 1);

  // The chat id always comes silently from the Telegram bot — never typed.
  // Creates the matching row in the backend (tg_users) before marking this
  // device registered, so a saved local user always has a server-side user.
  const register = async (fullName, phoneNumber) => {
    const chatId = telegramUser?.id ? String(telegramUser.id) : "";
    const phone = (phoneNumber ?? "").trim();

    // Registration is gated on the chat id: without it there is nothing to
    // create server-side, so refuse instead of saving an incomplete user.
    if (!chatId) {
      throw new Error(
        telegramStatus === "failed"
          ? "Telegram did not load. Open this app inside Telegram and tap Retry."
          : "Your Telegram chat id is not ready yet. Please try again in a moment."
      );
    }

    if (!phone) {
      throw new Error("A phone number is required to complete registration.");
    }

    let response;
    try {
      response = await fetch(`${apiUrl}/tg-users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          chat_id: Number(chatId),
          full_name: fullName,
          phone_number: phone,
        }),
      });
    } catch {
      throw new Error("We could not reach the server. Check your connection and try again.");
    }

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const firstError = payload?.errors ? Object.values(payload.errors)[0]?.[0] : null;
      throw new Error(firstError ?? payload?.message ?? "We could not create your account. Please try again.");
    }

    const next = { fullName, phone, chatId };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setUser(next);
    return next;
  };

  const value = {
    user,
    isRegistered: user !== null,
    telegramUser,
    telegramStatus,
    retryTelegram,
    suggestedName: composeFullName(telegramUser),
    register,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext must be used within UserProvider");
  return ctx;
}
