import { TodayScreen } from "./components/TodayScreen.jsx";
import { LeaderboardScreen } from "./components/LeaderboardScreen.jsx";
import { NavigationProvider, useNavigationContext } from "./context/NavigationContext.jsx";
import { GeneralProvider } from "./context/GeneralContext.jsx";
import { UserProvider, useUserContext } from "./context/UserContext.jsx";
import { DateOverrideProvider } from "./context/DateOverrideContext.jsx";
import { LeaderboardProvider } from "./context/LeaderboardContext.jsx";
import { ReadingProvider } from "./context/ReadingContext.jsx";
import { QuizProvider } from "./context/QuizContext.jsx";
import { RegistrationModal } from "./components/RegistrationModal.jsx";
import { TestDateBar } from "./components/TestDateBar.jsx";
import "./components/App.css";

function AppContent() {
  // First open: no registered user yet -> show the registration modal.
  const { isRegistered, notice, dismissNotice } = useUserContext();
  const { activeTab, tabs } = useNavigationContext();

  return (
    <div className="app-shell">
      {notice && (
        <div className="app-notice" role="status">
          <span>{notice}</span>
          <button
            type="button"
            className="app-notice__close"
            onClick={dismissNotice}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}
      {!isRegistered && <RegistrationModal />}
      <main className="app-main">
        {activeTab === "today" && <TodayScreen />}
        {activeTab === "leaderboard" && <LeaderboardScreen />}
      </main>

      <TestDateBar />

      <nav className="bottom-nav">
        <div className="bottom-nav__inner">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={tab.onSelect}
              className={`bottom-nav__btn${tab.isActive ? " bottom-nav__btn--active" : ""}`}
            >
              <tab.icon
                className="bottom-nav__icon"
                fill={tab.isActive ? "currentColor" : "none"}
              />
              <span className="bottom-nav__label">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

// Provider order matters: each provider consumes the ones above it.
function App() {
  return (
    <NavigationProvider>
      <DateOverrideProvider>
        <GeneralProvider>
          <UserProvider>
            <LeaderboardProvider>
              <ReadingProvider>
                <QuizProvider>
                  <AppContent />
                </QuizProvider>
              </ReadingProvider>
            </LeaderboardProvider>
          </UserProvider>
        </GeneralProvider>
      </DateOverrideProvider>
    </NavigationProvider>
  );
}

export default App;
