import { useState } from 'react';
import { LayoutDashboard, Users, TrendingUp, HelpCircle, Trophy } from 'lucide-react';
import ayatLogo from './assets/ayat-logo.png';
import Dashboard from './pages/Dashboard';
import Readers from './pages/Readers';
import Progress from './pages/Progress';
import Quizzes from './pages/Quizzes';
import Leaderboard from './pages/Leaderboard';
import { DashboardProvider } from './contexts/DashboardContext';
import { ReadersProvider } from './contexts/ReadersContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { QuizzesProvider } from './contexts/QuizzesContext';
import { LeaderboardProvider } from './contexts/LeaderboardContext';
import './App.css';

const tabs = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'readers', label: 'Readers', icon: Users },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
  { id: 'leaderboard', label: 'Ranks', icon: Trophy },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="app-header-content">
          <div className="app-header-logo-container">
            <div 
              className="app-logo" 
              style={{ 
                WebkitMaskImage: `url(${ayatLogo})`, 
                WebkitMaskSize: 'contain', 
                WebkitMaskRepeat: 'no-repeat', 
                WebkitMaskPosition: 'center',
                maskImage: `url(${ayatLogo})`,
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center'
              }} 
            />
            <div>
              <h1 className="app-title">Ayat Mekane Eyesus</h1>
              <p className="app-subtitle">Admin Panel</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="app-main">
        {activeTab === 'dashboard' && (
          <DashboardProvider>
            <Dashboard onNavigate={setActiveTab} />
          </DashboardProvider>
        )}
        {activeTab === 'readers' && (
          <ReadersProvider>
            <Readers />
          </ReadersProvider>
        )}
        {activeTab === 'progress' && (
          <ProgressProvider>
            <Progress />
          </ProgressProvider>
        )}
        {activeTab === 'quizzes' && (
          <QuizzesProvider>
            <Quizzes />
          </QuizzesProvider>
        )}
        {activeTab === 'leaderboard' && (
          <LeaderboardProvider>
            <Leaderboard />
          </LeaderboardProvider>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="app-nav">
        <div className="app-nav-content">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-button ${active ? 'active' : ''}`}
              >
                <Icon
                  className="nav-icon"
                  strokeWidth={active ? 2.4 : 2}
                />
                <span className="nav-label">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
