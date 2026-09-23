import { createContext, useContext, useEffect, useState } from "react";
import { waitForTelegramUser } from "@/lib/telegram";
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

// Owns everything user-related: the Telegram user (name + chat id), the
// registered user saved on this device, and the registration flow itself.
export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);
  const [telegramUser, setTelegramUser] = useState(null);
  const { apiUrl } = useGeneralContext();

  // Hydrate the Telegram user when it becomes available (first open).
  useEffect(() => {
    let cancelled = false;
    waitForTelegramUser().then((tu) => {
      if (!cancelled && tu) setTelegramUser(tu);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // The chat id always comes silently from the Telegram bot — never typed.
  // Creates the matching row in the backend (tg_users) before marking this
  // device registered, so a saved local user always has a server-side user.
  const register = async (fullName) => {
    const chatId = telegramUser?.id ? String(telegramUser.id) : "";

    if (chatId) {
      let response;
      try {
        response = await fetch(`${apiUrl}/tg-users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ chat_id: Number(chatId), full_name: fullName }),
        });
      } catch {
        throw new Error("We could not reach the server. Check your connection and try again.");
      }

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const firstError = payload?.errors ? Object.values(payload.errors)[0]?.[0] : null;
        throw new Error(firstError ?? payload?.message ?? "We could not create your account. Please try again.");
      }
    } else {
      // No Telegram context (local preview outside the bot): register locally only.
      console.warn("No Telegram chat id available — skipping backend registration.");
    }

    const next = { fullName, chatId };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setUser(next);
    return next;
  };

  const value = {
    user,
    isRegistered: user !== null,
    telegramUser,
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
