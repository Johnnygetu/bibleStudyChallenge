import { useState, useEffect, useCallback } from "react";
import { BookOpen, Trophy } from "lucide-react";
import { TodayScreen } from "./components/TodayScreen";
import { LeaderboardScreen } from "./components/LeaderboardScreen";
import { AppProvider } from "./lib/context";
import { authenticate, getCachedProfile, fetchProfile, initTelegramApp } from "./lib/auth";
import type { Profile } from "./lib/types";
import { Skeleton } from "./components/ui";
import { RegistrationModal } from "./components/RegistrationModal";

function AppContent() {
  const [activeTab, setActiveTab] = useState<"today" | "leaderboard">("today");
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    const details = localStorage.getItem("bible_challenge_user_details");
    if (!details) {
      setShowRegistration(true);
    }
  }, []);

  const tabs = [
    { id: "today", label: "Today", icon: BookOpen },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  ] as const;

  return (
    <div className="flex flex-col min-h-screen bg-ink-950 text-ink-100 pb-20">
      {showRegistration && (
        <RegistrationModal onComplete={() => setShowRegistration(false)} />
      )}
      <main className="flex-1 overflow-y-auto">
        {activeTab === "today" && <TodayScreen onNavigate={(tab) => setActiveTab(tab as any)} />}
        {activeTab === "leaderboard" && <LeaderboardScreen />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-ink-900/90 backdrop-blur-md border-t border-ink-800 pb-[env(safe-area-inset-bottom)] z-50">
        <div className="flex items-center justify-around p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center w-16 h-12 transition-colors ${
                  isActive ? "text-primary-400" : "text-ink-400 hover:text-ink-300"
                }`}
              >
                <Icon 
                  className={`w-5 h-5 mb-1 ${isActive ? "drop-shadow-[0_0_8px_rgba(2,41,66,0.5)]" : ""}`}
                  fill={isActive ? "currentColor" : "none"}
                />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Try cached profile first for fast load
      const cached = getCachedProfile();
      if (cached) {
        setProfile(cached);
        // Refresh silently
        fetchProfile(cached.id).then((p) => {
          if (p) setProfile(p);
        }).catch(() => {});
        return;
      }
      
      // Fallback for local development if not in Telegram (for testing outside TG)
      if (import.meta.env.MODE === 'development' && (!window.Telegram?.WebApp?.initData)) {
         // Create dummy dev profile
         setProfile({
            id: "00000000-0000-0000-0000-000000000000",
            telegram_id: 12345,
            username: "devmode",
            first_name: "Developer",
            last_name: "Mode",
            photo_url: "",
            current_streak: 12,
            longest_streak: 15,
            last_read_date: new Date().toISOString().split('T')[0],
            total_quiz_correct: 42,
            total_quiz_answered: 50,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
         });
         return;
      }

      // Authenticate via Telegram
      const newProfile = await authenticate();
      setProfile(newProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initTelegramApp();
    loadProfile();
  }, [loadProfile]);

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-ink-950 p-5 pt-10">
        <Skeleton className="h-24 w-full mb-4" />
        <Skeleton className="h-48 w-full mb-4" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-ink-950 flex flex-col items-center justify-center p-5 space-y-4">
        <div className="text-center p-6 bg-ink-850 rounded-2xl border border-ink-800">
           <p className="text-danger-500 mb-2 font-semibold">Authentication Error</p>
           <p className="text-ink-400 text-sm mb-4">{error || "Profile not found"}</p>
           <button 
             onClick={loadProfile}
             className="px-4 py-2 bg-ink-700 hover:bg-ink-600 rounded-lg text-sm text-ink-100 transition-colors"
           >
             Try Again
           </button>
        </div>
      </div>
    );
  }

  return (
    <AppProvider 
      value={{ 
        profile, 
        refreshProfile: loadProfile,
        // Using January 1st, 2024 as a placeholder challenge start date
        challengeStartDate: new Date("2024-01-01T00:00:00Z") 
      }}
    >
      <AppContent />
    </AppProvider>
  );
}

export default App;
