import { useEffect, useState } from 'react';
import { Users, TrendingUp, HelpCircle, Flame, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';
import { dummyReaders, getDummyQuestions } from '@/lib/dummy';
import type { Reader, QuizQuestion } from '@/lib/types';
import { Avatar } from '@/components/ui';

interface Stats {
  totalReaders: number;
  activeReaders: number;
  totalQuestions: number;
  onTrack: number;
  fallingBehind: number;
  avgStreak: number;
}

export default function Dashboard({ onNavigate }: { onNavigate?: (tab: 'dashboard' | 'readers' | 'progress' | 'quizzes' | 'leaderboard') => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [recentReaders, setRecentReaders] = useState<Reader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Simulate network delay
      await new Promise(r => setTimeout(r, 500));
      const readers = dummyReaders;
      const questions = getDummyQuestions();

      const today = new Date();
      const startDate = new Date('2026-09-21');
      const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const week = Math.max(1, Math.min(26, Math.floor(daysDiff / 7) + 1));
      setCurrentWeek(week);

      const allReaders = (readers as Reader[]) || [];
      const active = allReaders.filter((r) => r.status === 'active');
      const onTrack = active.filter((r) => r.current_streak >= 3).length;
      const fallingBehind = active.filter((r) => r.current_streak === 0).length;
      const avgStreak =
        active.length > 0
          ? Math.round((active.reduce((s, r) => s + r.current_streak, 0) / active.length) * 10) / 10
          : 0;

      setStats({
        totalReaders: allReaders.length,
        activeReaders: active.length,
        totalQuestions: questions.length,
        onTrack,
        fallingBehind,
        avgStreak,
      });

      setRecentReaders(
        [...allReaders].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5),
      );
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { label: 'Total Readers', value: stats.totalReaders, icon: Users, color: 'bg-primary-500/10 text-primary-600', ring: 'ring-primary-500/10', tab: 'readers' as const },
    { label: 'Quiz Questions', value: stats.totalQuestions, icon: HelpCircle, color: 'bg-primary-500/10 text-primary-600', ring: 'ring-primary-500/10', tab: 'quizzes' as const },
    { label: 'Avg Streak', value: `${stats.avgStreak}d`, icon: Flame, color: 'bg-primary-500/10 text-primary-600', ring: 'ring-primary-500/10', tab: 'progress' as const },
  ];

  return (
    <div className="px-5 py-5 space-y-6 animate-fade-in">
      {/* Week banner */}
      <div className="card-primary p-5 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-primary-500/10" />
        <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-primary-500/5" />
        <div className="relative">
          <p className="text-primary-600 text-xs font-semibold uppercase tracking-wider">Current Week</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-bold font-serif text-ink-100">Week {currentWeek}</span>
            <span className="text-ink-400 text-sm font-medium">of 26</span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-2 bg-primary-500/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-500"
                style={{ width: `${(currentWeek / 26) * 100}%` }}
              />
            </div>
            <span className="text-xs text-primary-600 font-bold">{Math.round((currentWeek / 26) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const isFirst = idx === 0;
          return (
            <button key={card.label} onClick={() => onNavigate?.(card.tab)} className={`card p-4 hover:bg-ink-800 transition-colors flex ${isFirst ? 'col-span-2 flex-col items-center justify-center text-center' : 'items-center gap-4 text-left'}`}>
              <Icon className={`w-8 h-8 text-primary-600 shrink-0 ${isFirst ? 'mb-3' : ''}`} strokeWidth={2.2} />
              <div>
                <p className="text-2xl font-bold text-ink-100 leading-none">{card.value}</p>
                <p className="text-xs text-ink-400 font-medium mt-1">{card.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* On track vs falling behind */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => onNavigate?.('progress')} className="card p-4 text-left hover:bg-ink-800 transition-colors flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-primary-600 shrink-0" />
          <div>
            <p className="text-xl font-bold text-primary-600 leading-none">{stats.onTrack}</p>
            <p className="text-[11px] text-ink-400 font-medium mt-1">On Track</p>
          </div>
        </button>
        <button onClick={() => onNavigate?.('progress')} className="card p-4 text-left hover:bg-ink-800 transition-colors flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-primary-600 shrink-0" />
          <div>
            <p className="text-xl font-bold text-primary-600 leading-none">{stats.fallingBehind}</p>
            <p className="text-[11px] text-ink-400 font-medium mt-1">Falling Behind</p>
          </div>
        </button>
      </div>

      {/* Recent readers */}
      {recentReaders.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-ink-300 mb-3 px-1">Recently Joined Readers</h2>
          <div className="card divide-y divide-ink-700/50">
            {recentReaders.map((reader) => (
              <div key={reader.id} className="flex items-center gap-3 p-3.5">
                <Avatar name={reader.name} size={40} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-100 truncate">{reader.name}</p>
                  <p className="text-xs text-ink-400 truncate">{reader.phone || 'No phone'}</p>
                </div>
                {reader.current_streak > 0 && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-ember-600 bg-ember-500/10 px-2 py-1 rounded-full">
                    <Flame className="w-3 h-3" />
                    {reader.current_streak}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.totalReaders === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-ink-800 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-ink-400" />
          </div>
          <p className="text-ink-300 text-sm font-medium">No readers yet</p>
          <p className="text-ink-400 text-xs mt-1">Readers will appear here once they sign up via the bot</p>
        </div>
      )}
    </div>
  );
}
