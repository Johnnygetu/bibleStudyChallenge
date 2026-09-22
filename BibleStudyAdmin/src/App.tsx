import { useState } from 'react';
import { LayoutDashboard, Users, TrendingUp, HelpCircle, Trophy, BookOpen } from 'lucide-react';
import ayatLogo from '@/assets/ayat-logo.png';
import Dashboard from '@/pages/Dashboard';
import Readers from '@/pages/Readers';
import Progress from '@/pages/Progress';
import Quizzes from '@/pages/Quizzes';
import Leaderboard from '@/pages/Leaderboard';

type Tab = 'dashboard' | 'readers' | 'progress' | 'quizzes' | 'leaderboard';

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'readers', label: 'Readers', icon: Users },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
  { id: 'leaderboard', label: 'Ranks', icon: Trophy },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen bg-ink-950 flex flex-col max-w-md mx-auto relative">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-ink-850/90 backdrop-blur-md border-b border-ink-700/50">
        <div className="flex items-center justify-center px-5 py-3.5">
          <div className="flex items-center gap-5">
            <div 
              className="w-10 h-10 bg-primary-400 shrink-0 drop-shadow-md" 
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
              <h1 className="text-sm font-bold text-primary-400 uppercase tracking-wider leading-tight">Ayat Mekane Eyesus</h1>
              <p className="text-[10px] text-ink-400 font-semibold tracking-widest uppercase leading-tight mt-0.5">Admin Panel</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pb-20 overflow-y-auto">
        {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
        {activeTab === 'readers' && <Readers />}
        {activeTab === 'progress' && <Progress />}
        {activeTab === 'quizzes' && <Quizzes />}
        {activeTab === 'leaderboard' && <Leaderboard />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-ink-850 border-t border-ink-700/50 z-30 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around px-1 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                  active ? 'text-primary-500' : 'text-ink-400'
                }`}
              >
                <Icon
                  className={`w-[22px] h-[22px] transition-transform duration-200 ${
                    active ? 'scale-110' : ''
                  }`}
                  strokeWidth={active ? 2.4 : 2}
                />
                <span className={`text-[10px] ${active ? 'font-semibold' : 'font-medium'}`}>
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
