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

// Maps the server's Reader model JSON to the account shape saved on this
// device — the same shape registration itself stores.
function readerToStoredUser(reader) {
  return {
    id: reader.id,
    fullName: (reader.name ?? "").trim(),
    phone: reader.phone_number ?? "",
    chatId: reader.chat_id != null ? String(reader.chat_id) : "",
    // null means the church question has not been answered yet; the reader app
    // uses that to decide whether to ask.
    isChurchMember: reader.is_church_member ?? null,
  };
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

  const clearUser = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

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

    const next = {
      id: payload?.id,
      fullName,
      phone,
      chatId: savedChatId,
      isChurchMember: payload?.is_church_member ?? null,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setUser(next);
    setNotice("You're registered! Welcome to the Bible Study Challenge.");
    return next;
  };

  // Installs a server reader as this device's account — only when the device
  // holds none. Shared by the automatic first-launch restore below and the
  // registration modal's manual "Fetch account" button.
  const restoreReader = useCallback((reader) => {
    setUser((prev) => {
      if (prev) return prev;
      const next = readerToStoredUser(reader);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Pulls the church flag from a freshly fetched reader into the stored
  // account, so an answer the server already holds (the reader answered on
  // another device, or the Telegram group sweep set it) silences the question
  // here too. A server null means "not answered" and never overwrites a value
  // this device is holding.
  const syncChurchMembership = useCallback((reader) => {
    const serverValue = reader.is_church_member;
    if (serverValue == null) return;

    setUser((prev) => {
      if (!prev || prev.isChurchMember === serverValue) return prev;
      const next = { ...prev, isChurchMember: serverValue };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Manual account lookup behind the modal's "Fetch account" button: the chat
  // id is matched against the server's readers and a match becomes this
  // device's account. Returns a tri-state for the modal to render:
  // "restored" (a match is now active — the modal unmounts), "not-found"
  // (no reader with this chat id), or "error" (message for the person).
  const restoreByChat = useCallback(async () => {
    if (!apiUrl) {
      return {
        status: "error",
        message:
          "The server address is not configured. Set VITE_API_URL to the public Laravel API base URL ending in /api, then rebuild the reader app.",
      };
    }

    const chatId = telegramUser?.id ? String(telegramUser.id) : "";
    if (!chatId) {
      // Telegram is still hydrating, or the launch carried no user at all.
      // Outside Telegram the chat id can never arrive, so the reply is an
      // instruction rather than a "try again".
      if (telegramStatus === "loading") {
        return {
          status: "error",
          message:
            "Still connecting to Telegram — tap Fetch account again in a moment.",
        };
      }
      return {
        status: "error",
        message:
          "Open this app from its Telegram link so your Telegram account can be looked up.",
      };
    }

    try {
      const res = await fetch(`${apiUrl}/readers/by-chat/${chatId}`, {
        headers: { Accept: "application/json" },
      });
      const reader = await res.json().catch(() => null);

      if (res.status === 404) {
        return { status: "not-found" };
      }
      if (!res.ok) {
        return {
          status: "error",
          message:
            "The server could not complete the lookup. Please try again shortly.",
        };
      }
      if (!reader?.id) {
        return { status: "not-found" };
      }

      restoreReader(reader);
      setNotice("Welcome back! Your account is restored.");
      return { status: "restored" };
    } catch {
      return {
        status: "error",
        message:
          "We could not reach the server. Check your connection and try again.",
      };
    }
  }, [apiUrl, telegramStatus, telegramUser, restoreReader]);

  // Fetches the Reader model using the chat id when the app first runs. A
  // "not found" is NOT treated as a stale device: a chat id the server does
  // not know also belongs to accounts created without one (registered outside
  // Telegram, or whose chat-id attach never landed), and wiping here would
  // lock those readers out for good now that registration is closed. Instead:
  // - When a Reader comes back and this device holds no account, restore it —
  //   the chat id is the way back in ("open the app from your Telegram link").
  // - When this device already holds an account, keep it; the chat-id sync
  //   below links the id up server-side if it is still missing there.
  useEffect(() => {
    const chatId = telegramUser?.id ? String(telegramUser.id) : "";
    if (!chatId || !apiUrl) return;

    let cancelled = false;

    fetch(`${apiUrl}/readers/by-chat/${chatId}`, {
      headers: { Accept: "application/json" },
    })
      .then(async (res) => {
        if (cancelled || !res.ok) return;
        const reader = await res.json().catch(() => null);
        if (cancelled || !reader?.id) return;
        restoreReader(reader);
        syncChurchMembership(reader);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [apiUrl, telegramUser, restoreReader, syncChurchMembership]);

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

  // Records the reader's own answer to the church membership question
  // (is_church_member). The stored flag only flips once the server has the
  // answer, so the question keeps coming back until it is stored — and a
  // failed save leaves the modal up for another try.
  const submitChurchMembership = useCallback(
    async (isMember) => {
      if (!apiUrl || !user?.id) {
        return { status: "error" };
      }

      try {
        const res = await fetch(`${apiUrl}/readers/${user.id}/set-church-membership`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ is_church_member: isMember }),
        });

        if (!res.ok) {
          return { status: "error" };
        }

        setUser((prev) => {
          if (!prev) return prev;
          const next = { ...prev, isChurchMember: isMember };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          return next;
        });

        return { status: "saved" };
      } catch {
        return { status: "error" };
      }
    },
    [apiUrl, user]
  );

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
    clearUser,
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
    restoreByChat,
    isChurchMember: user?.isChurchMember ?? null,
    submitChurchMembership,
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
