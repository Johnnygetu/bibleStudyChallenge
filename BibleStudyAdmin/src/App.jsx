import { useState } from 'react';
import { LayoutDashboard, Users, TrendingUp, HelpCircle, Trophy } from 'lucide-react';
import ayatLogo from '@/assets/ayat-logo.png';
import Dashboard from '@/pages/Dashboard.jsx';
import Readers from '@/pages/Readers.jsx';
import Progress from '@/pages/Progress.jsx';
import Quizzes from '@/pages/Quizzes.jsx';
import Leaderboard from '@/pages/Leaderboard.jsx';
import { UsersProvider } from '@/context/UsersContext';

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
    <UsersProvider>
      <div className="app-shell">
        {/* Header */}
        <header className="app-header">
          <div className="app-header-inner">
            <div className="brand">
              <div
                className="brand-logo"
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
                <h1 className="brand-title">Ayat Mekane Eyesus</h1>
                <p className="brand-sub">Admin Panel</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main">
          {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
          {activeTab === 'readers' && <Readers />}
          {activeTab === 'progress' && <Progress />}
          {activeTab === 'quizzes' && <Quizzes />}
          {activeTab === 'leaderboard' && <Leaderboard />}
        </main>

        {/* Bottom Navigation */}
        <nav className="app-nav">
          <div className="app-nav-inner">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={active ? 'nav-tab active' : 'nav-tab'}
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
    </UsersProvider>
  );
}
