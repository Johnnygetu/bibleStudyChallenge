import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { hapticNotification, isTelegramContext, waitForTelegramUser } from "@/lib/telegram";
import { useGeneralContext } from "@/context/GeneralContext";

const STORAGE_KEY = "bible_challenge_user_details";

// Digits, an optional leading +, and the usual separators people type.
const PHONE_INPUT_PATTERN = /^\+?[\d\s\-()]{6,20}$/;

// Store a single canonical form so the unique phone_number constraint means
// what it should: "+1 (234) 567-8901" and "+12345678901" are the same person.
function normalizePhone(value) {
  return value.replace(/[\s\-()]/g, "");
}

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
// can be exercised in a plain browser. The chat id is therefore OPTIONAL —
// registration works with or without it, and a later Telegram launch attaches
// the id it missed. Flip TELEGRAM_REQUIRED back to `true` to make the chat id
// mandatory again once the mini app is the only way in.
// ---------------------------------------------------------------------------
const TELEGRAM_REQUIRED = false;

// Owns everything user-related: the Telegram user (name + chat id), the
// registered user saved on this device, and the registration flow itself.
export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);
  const [telegramUser, setTelegramUser] = useState(null);
  // "loading" -> "ready" once the chat id is known (or Telegram was skipped,
  // since the id is optional), "failed" only when Telegram is required and
  // never delivers a user (e.g. opened outside the bot, script blocked).
  const [telegramStatus, setTelegramStatus] = useState(() =>
    !TELEGRAM_REQUIRED && !isTelegramContext() ? "ready" : "loading"
  );
  const [telegramAttempt, setTelegramAttempt] = useState(0);
  const { apiUrl, profile } = useGeneralContext();

  // Hydrate the Telegram user when it becomes available (first open).
  // Bumping telegramAttempt (Retry) re-runs the wait.
  useEffect(() => {
    // Outside Telegram there is nothing to wait for: the chat id simply stays
    // absent, so don't stall behind the 3s poll.
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
        // Optional mode: a launch that never produced a user just means "no
        // chat id yet" — registration still works without it.
        setTelegramStatus("ready");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [telegramAttempt]);

  const retryTelegram = () => setTelegramAttempt((n) => n + 1);

  // Success feedback for registration: the modal unmounts the moment the user
  // is saved, so the message lives here and App renders it as a notice.
  const [notice, setNotice] = useState("");
  const dismissNotice = () => setNotice("");

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 6000);
    return () => clearTimeout(timer);
  }, [notice]);

  // Chat ids already sent to the server (stored or refused), so a link the
  // server declined is not retried on every visit.
  const syncedChatIds = useRef(new Set());

  // The chat id comes silently from the Telegram bot — never typed. When it
  // is available it rides along with the registration request; when it is not
  // (optional mode, opened outside Telegram) the account is still created.
  const register = async (fullName, phoneNumber) => {
    if (!apiUrl) {
      throw new Error("The server address is not configured. Set VITE_API_URL to the public Laravel API base URL ending in /api, then rebuild the reader app.");
    }

    const chatId = telegramUser?.id ? String(telegramUser.id) : "";
    const phone = (phoneNumber ?? "").trim();

    // Only enforced once the mini app is the sole entry point.
    if (TELEGRAM_REQUIRED && !chatId) {
      throw new Error(
        telegramStatus === "failed"
          ? "Telegram did not load. Open this app inside Telegram and tap Retry."
          : "Your Telegram chat id is not ready yet. Please try again in a moment."
      );
    }

    if (!phone) {
      throw new Error("A phone number is required to complete registration.");
    }

    const body = { name: fullName, phone_number: phone };
    if (chatId) body.chat_id = Number(chatId);

    const post = () =>
      fetch(`${apiUrl}/readers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });

    const unreachable = () =>
      new Error("We could not reach the server. Check your connection and try again.");

    let response;
    let payload;
    try {
      response = await post();
      payload = await response.json().catch(() => null);
    } catch {
      throw unreachable();
    }

    // A chat id that already belongs to another reader is skipped instead of
    // failing the sign-up: drop it and register anyway. The server does the
    // same on its own — the retry only fires against an older backend.
    const chatIdTaken = !response.ok && body.chat_id !== undefined && !!payload?.errors?.chat_id;

    if (chatIdTaken) {
      delete body.chat_id;
      try {
        response = await post();
        payload = await response.json().catch(() => null);
      } catch {
        throw unreachable();
      }
      syncedChatIds.current.add(chatId);
    }

    if (!response.ok) {
      const firstError = payload?.errors ? Object.values(payload.errors)[0]?.[0] : null;
      throw new Error(firstError ?? payload?.message ?? "We could not create your account. Please try again.");
    }

    // Keep what the server actually stored: a skipped chat id stays empty, so
    // the background sync never retries a link the server already refused.
    const savedChatId = payload?.chat_id != null ? String(payload.chat_id) : "";
    if (chatId && !savedChatId) syncedChatIds.current.add(chatId);

    const next = { id: payload?.id, fullName, phone, chatId: savedChatId };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setUser(next);
    setNotice("You're registered! Welcome to the Bible Study Challenge.");
    return next;
  };

  // Fetches the Reader model using the chat id — if no Reader is returned
  // the local device data is stale / orphaned, so clear it.
  useEffect(() => {
    const chatId = telegramUser?.id ? String(telegramUser.id) : "";
    if (!chatId || !apiUrl) return;

    let cancelled = false;

    fetch(`${apiUrl}/readers/by-chat/${chatId}`, {
      headers: { Accept: "application/json" },
    })
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 404) {
          localStorage.clear();
          return;
        }
        if (!res.ok) return;
        const reader = await res.json().catch(() => null);
        if (!reader) {
          localStorage.clear();
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [apiUrl, telegramUser?.id]);

  // A chat id the registration missed (it was still loading, or the account
  // was made outside Telegram) is attached silently on the first launch that
  // does have one, so the optional id is never permanently missing. Best
  // effort: losing it only leaves the reader without Telegram reminders.
  useEffect(() => {
    const chatId = telegramUser?.id ? String(telegramUser.id) : "";
    if (!apiUrl || !user?.id || !chatId || user.chatId === chatId) return;
    if (syncedChatIds.current.has(chatId)) return;
    syncedChatIds.current.add(chatId);

    fetch(`${apiUrl}/readers/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ chat_id: Number(chatId) }),
    })
      .then((res) => {
        if (!res.ok) return;
        setUser((prev) => {
          if (!prev || prev.chatId === chatId) return prev;
          const next = { ...prev, chatId };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          return next;
        });
      })
      .catch(() => {
        // Registration already succeeded without the chat id — nothing to do.
      });
  }, [telegramUser, user, apiUrl]);

  // -------------------------------------------------------------------------
  // Registration form
  // The modal that collects the name and phone number renders from this state,
  // so it stays presentational.
  // -------------------------------------------------------------------------
  const suggestedName = composeFullName(telegramUser);
  const [registrationForm, setRegistrationForm] = useState({ fullName: "", phone: "" });
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState("");

  // Prefill the name with the Telegram user's name (first + last) once it
  // arrives — without clobbering anything the user has already typed.
  useEffect(() => {
    setRegistrationForm((prev) => (prev.fullName ? prev : { ...prev, fullName: suggestedName }));
  }, [suggestedName]);

  // The chat id is optional for now, so Telegram only ever *adds* detail — it
  // never blocks the form.
  const telegramWaiting = telegramStatus === "loading";
  const telegramFailed = telegramStatus === "failed";

  // Surface the "Telegram never loaded" failure once, loudly.
  useEffect(() => {
    if (telegramFailed) hapticNotification("error");
  }, [telegramFailed]);

  const setRegistrationField = useCallback((field, value) => {
    setRegistrationForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const submitRegistration = useCallback(
    async (event) => {
      event.preventDefault();
      const fullName = registrationForm.fullName.trim();
      const phone = registrationForm.phone.trim();
      // Enter in the input can still submit the form — re-check the gate here.
      if (!fullName || !phone || isRegistering) return;

      if (!PHONE_INPUT_PATTERN.test(phone)) {
        setRegistrationError("Enter a valid phone number, e.g. 0912345678.");
        hapticNotification("error");
        return;
      }

      setIsRegistering(true);
      setRegistrationError("");
      try {
        // Creates the reader in the backend; App then closes the modal and
        // shows the "you're registered" notice.
        await register(fullName, normalizePhone(phone));
        hapticNotification("success");
      } catch (err) {
        setRegistrationError(err?.message || "Something went wrong. Please try again.");
        hapticNotification("error");
      } finally {
        setIsRegistering(false);
      }
    },
    [isRegistering, register, registrationForm]
  );

  const value = {
    user,
    isRegistered: user !== null,
    displayName: user?.fullName?.trim() || profile.first_name,
    telegramUser,
    telegramStatus,
    telegramWaiting,
    telegramFailed,
    retryTelegram,
    notice,
    dismissNotice,
    suggestedName,
    register,
    registrationForm,
    setRegistrationField,
    submitRegistration,
    isRegistering,
    registrationError,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext must be used within UserProvider");
  return ctx;
}
