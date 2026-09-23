import { useState } from "react";
import { BookOpen, Trophy } from "lucide-react";
import { TodayScreen } from "./components/TodayScreen.jsx";
import { LeaderboardScreen } from "./components/LeaderboardScreen.jsx";
import { GeneralProvider } from "./context/GeneralContext.jsx";
import { UserProvider, useUserContext } from "./context/UserContext.jsx";
import { RegistrationModal } from "./components/RegistrationModal.jsx";
import "./components/App.css";

function AppContent() {
  const [activeTab, setActiveTab] = useState("today");
  // First open: no registered user yet -> show the registration modal.
  const { isRegistered } = useUserContext();

  const tabs = [
    { id: "today", label: "Today", icon: BookOpen },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  return (
    <div className="app-shell">
      {!isRegistered && <RegistrationModal />}
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
    <GeneralProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </GeneralProvider>
  );
}

export default App;
