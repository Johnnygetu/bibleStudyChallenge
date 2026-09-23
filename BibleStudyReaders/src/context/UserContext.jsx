import { createContext, useContext, useEffect, useState } from "react";
import { waitForTelegramUser } from "@/lib/telegram";

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
  const register = (fullName) => {
    const next = {
      fullName,
      chatId: telegramUser?.id ? String(telegramUser.id) : "",
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setUser(next);
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
