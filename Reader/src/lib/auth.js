import { getTelegramInitData, getTelegramUser, getTelegramWebApp } from "./telegram";
const AUTH_STORAGE_KEY = "bible_challenge_profile";
function getDummyProfile(tgUser) {
  return {
    id: "dummy-user-id-" + (tgUser?.id || "123"),
    telegram_id: tgUser?.id || 123456789,
    username: tgUser?.username || "dummyuser",
    first_name: tgUser?.first_name || "Dummy",
    last_name: tgUser?.last_name || "User",
    photo_url: tgUser?.photo_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Dummy",
    current_streak: 5,
    longest_streak: 12,
    last_read_date: (/* @__PURE__ */ new Date()).toISOString(),
    total_quiz_correct: 42,
    total_quiz_answered: 50,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
}
async function authenticate() {
  const tgUser = getTelegramUser();
  const initData = getTelegramInitData();
  const dummyProfile = getDummyProfile(tgUser);
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ profile: dummyProfile, telegramId: dummyProfile.telegram_id }));
  await new Promise((resolve) => setTimeout(resolve, 500));
  return dummyProfile;
}
function getCachedProfile() {
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
function getMyProfileId() {
  const cached = getCachedProfile();
  return cached?.id ?? null;
}
async function fetchProfile(profileId) {
  const cached = getCachedProfile();
  if (cached && cached.id === profileId) {
    return cached;
  }
  return getDummyProfile(null);
}
async function updateProfile(profileId, updates) {
  const cached = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!cached) return null;
  const data = JSON.parse(cached);
  if (data.profile.id !== profileId) return null;
  
  data.profile = { ...data.profile, ...updates };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  return data.profile;
}

function initTelegramApp() {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.ready();
    tg.expand();
    try {
      tg.setHeaderColor("#0a0a0b");
      tg.setBackgroundColor("#0a0a0b");
    } catch {
    }
  }
}
export {
  authenticate,
  fetchProfile,
  getCachedProfile,
  getMyProfileId,
  updateProfile,
  initTelegramApp
};
