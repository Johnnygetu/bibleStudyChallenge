import { useState } from "react";
import { BookOpen, Trophy } from "lucide-react";
import { TodayScreen } from "./components/TodayScreen.jsx";
import { LeaderboardScreen } from "./components/LeaderboardScreen.jsx";
import { AppProvider } from "./lib/context.jsx";
import { PROFILE } from "./lib/data.js";
import "./components/App.css";

// Registration flow returns when integration starts:
// import { RegistrationModal } from "./components/RegistrationModal.jsx";

function AppContent() {
  const [activeTab, setActiveTab] = useState("today");

  const tabs = [
    { id: "today", label: "Today", icon: BookOpen },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  return (
    <div className="app-shell">
      <main className="app-main">
        {activeTab === "today" && <TodayScreen onNavigate={(tab) => setActiveTab(tab)} />}
        {activeTab === "leaderboard" && <LeaderboardScreen />}
      </main>

      <nav className="bottom-nav">
        <div className="bottom-nav__inner">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`bottom-nav__btn${isActive ? " bottom-nav__btn--active" : ""}`}
              >
                <Icon
                  className="bottom-nav__icon"
                  fill={isActive ? "currentColor" : "none"}
                />
                <span className="bottom-nav__label">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function App() {
  return (
    <AppProvider value={{ profile: PROFILE }}>
      <AppContent />
    </AppProvider>
  );
}

export default App;
