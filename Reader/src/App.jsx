import { useState, useEffect, useCallback } from "react";
import { BookOpen, Trophy } from "lucide-react";
import { TodayScreen } from "./components/TodayScreen";
import { LeaderboardScreen } from "./components/LeaderboardScreen";
import { OnboardingModal } from "./components/OnboardingModal";
import { AppProvider } from "./lib/context";
import { TodayProvider } from "./contexts/TodayContext";
import { LeaderboardProvider } from "./contexts/LeaderboardContext";
import { authenticate, getCachedProfile, fetchProfile, initTelegramApp, updateProfile } from "./lib/auth";
import { Skeleton } from "./components/ui";
import "./App.css";

function AppContent() {
  const [activeTab, setActiveTab] = useState("today");

  const tabs = [
    { id: "today", label: "Today", icon: BookOpen },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  return (
    <div className="app-container">
      <main className="main-content">
        {activeTab === "today" && (
          <TodayProvider>
            <TodayScreen onNavigate={setActiveTab} />
          </TodayProvider>
        )}
        {activeTab === "leaderboard" && (
          <LeaderboardProvider>
            <LeaderboardScreen />
          </LeaderboardProvider>
        )}
      </main>

      <nav className="nav-bar">
        <div className="nav-container">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <Icon 
                  className={`nav-icon ${isActive ? "active" : ""}`}
                  fill={isActive ? "currentColor" : "none"}
                />
                <span className="nav-label">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function App() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleOnboardingSubmit = async (data) => {
    if (!profile) return;
    const names = data.fullName.split(" ");
    const firstName = names[0];
    const lastName = names.slice(1).join(" ");
    
    // In dev mode with dummy profile, just update local state since updateProfile won't find it in localStorage if it was skipped
    if (profile.id === "00000000-0000-0000-0000-000000000000") {
      setProfile({
        ...profile,
        first_name: firstName,
        last_name: lastName,
        phone_number: data.phoneNumber
      });
      return;
    }
    
    const updated = await updateProfile(profile.id, {
      first_name: firstName,
      last_name: lastName,
      phone_number: data.phoneNumber
    });
    
    if (updated) {
      setProfile(updated);
    }
  };

  if (loading && !profile) {
    return (
      <div className="loading-container">
        <Skeleton className="mb-4 h-24 w-full" />
        <Skeleton className="mb-4 h-48 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="error-container">
        <div className="error-box">
           <p className="error-title">Authentication Error</p>
           <p className="error-message">{error || "Profile not found"}</p>
           <button 
             onClick={loadProfile}
             className="retry-button"
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
      {!profile.phone_number && <OnboardingModal onSubmit={handleOnboardingSubmit} />}
      <AppContent />
    </AppProvider>
  );
}

export default App;
