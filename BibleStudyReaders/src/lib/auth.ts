import type { Profile } from "./types";
import { getTelegramInitData, getTelegramUser, getTelegramWebApp } from "./telegram";

const AUTH_STORAGE_KEY = "bible_challenge_profile";

function getDummyProfile(tgUser: any): Profile {
  return {
    id: "dummy-user-id-" + (tgUser?.id || "123"),
    telegram_id: tgUser?.id || 123456789,
    username: tgUser?.username || "dummyuser",
    first_name: tgUser?.first_name || "Dummy",
    last_name: tgUser?.last_name || "User",
    photo_url: tgUser?.photo_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Dummy",
    current_streak: 5,
    longest_streak: 12,
    last_read_date: new Date().toISOString(),
    total_quiz_correct: 42,
    total_quiz_answered: 50,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function authenticate(): Promise<Profile> {
  const tgUser = getTelegramUser();
  const initData = getTelegramInitData();

  // For dummy testing, we can bypass the strict telegram check if not running in TG
  const dummyProfile = getDummyProfile(tgUser);
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ profile: dummyProfile, telegramId: dummyProfile.telegram_id }));
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return dummyProfile;
}

export function getCachedProfile(): Profile | null {
  try {
    const cached = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!cached) return null;
    const { profile, telegramId } = JSON.parse(cached);
    const tgUser = getTelegramUser();
    if (tgUser && tgUser.id !== telegramId) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return profile;
  } catch {
    return null;
  }
}

export function getMyProfileId(): string | null {
  const cached = getCachedProfile();
  return cached?.id ?? null;
}

export async function fetchProfile(profileId: string): Promise<Profile | null> {
  const cached = getCachedProfile();
  if (cached && cached.id === profileId) {
    return cached;
  }
  return getDummyProfile(null);
}

export function initTelegramApp() {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.ready();
    tg.expand();
    try {
      tg.setHeaderColor("#0a0a0b");
      tg.setBackgroundColor("#0a0a0b");
    } catch {
      // ignore if not supported
    }
  }
}
