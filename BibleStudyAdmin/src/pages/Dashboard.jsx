import { useEffect, useState } from 'react';
import { Users, TrendingUp, HelpCircle, Flame, AlertTriangle, BookOpen } from 'lucide-react';
import { dummyReaders, getDummyQuestions } from '@/lib/dummy';
import { Avatar } from '@/components/ui';

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [recentReaders, setRecentReaders] = useState([]);
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

      const allReaders = readers || [];
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
      <div className="page-loader">
        <div className="spinner" />
      </div>
    );
  }

  const cards = [
    { label: 'Total Readers', value: stats.totalReaders, icon: Users, tab: 'readers' },
    { label: 'Quiz Questions', value: stats.totalQuestions, icon: HelpCircle, tab: 'quizzes' },
    { label: 'Avg Streak', value: `${stats.avgStreak}d`, icon: Flame, tab: 'progress' },
  ];

  return (
    <div className="page stack-lg fade-in">
      {/* Week banner */}
      <div className="card-primary week-banner">
        <div className="week-blob week-blob-top" />
        <div className="week-blob week-blob-bottom" />
        <div className="week-content">
          <p className="week-eyebrow">Current Week</p>
          <div className="week-heading">
            <span className="week-number serif">Week {currentWeek}</span>
            <span className="week-total">of 26</span>
          </div>
          <div className="week-progress">
            <div className="week-track">
              <div
                className="week-fill"
                style={{ width: `${(currentWeek / 26) * 100}%` }}
              />
            </div>
            <span className="week-pct">{Math.round((currentWeek / 26) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid-2">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const isFirst = idx === 0;
          return (
            <button
              key={card.label}
              onClick={() => onNavigate?.(card.tab)}
              className={`card card-pad card-hover stat-card${isFirst ? ' stat-card-wide' : ''}`}
            >
              <Icon className={`icon-32 stat-icon${isFirst ? ' stat-icon-below' : ''}`} strokeWidth={2.2} />
              <div>
                <p className="stat-value">{card.value}</p>
                <p className="stat-label">{card.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* On track vs falling behind */}
      <div className="grid-2">
        <button onClick={() => onNavigate?.('progress')} className="card card-pad card-hover mini-card">
          <TrendingUp className="icon-24 mini-icon" />
          <div>
            <p className="mini-value">{stats.onTrack}</p>
            <p className="mini-label">On Track</p>
          </div>
        </button>
        <button onClick={() => onNavigate?.('progress')} className="card card-pad card-hover mini-card">
          <AlertTriangle className="icon-24 mini-icon" />
          <div>
            <p className="mini-value">{stats.fallingBehind}</p>
            <p className="mini-label">Falling Behind</p>
          </div>
        </button>
      </div>

      {/* Recent readers */}
      {recentReaders.length > 0 && (
        <div>
          <h2 className="section-title">Recently Joined Readers</h2>
          <div className="card divided">
            {recentReaders.map((reader) => (
              <div key={reader.id} className="row">
                <Avatar name={reader.name} size={40} />
                <div className="row-main">
                  <p className="row-title truncate">{reader.name}</p>
                  <p className="row-sub truncate">{reader.phone || 'No phone'}</p>
                </div>
                {reader.current_streak > 0 && (
                  <span className="pill pill-ember">
                    <Flame className="icon-12" />
                    {reader.current_streak}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.totalReaders === 0 && (
        <div className="empty-block">
          <div className="empty-circle">
            <BookOpen className="icon-32 empty-glyph" />
          </div>
          <p className="empty-title">No readers yet</p>
          <p className="empty-sub">Readers will appear here once they sign up via the bot</p>
        </div>
      )}
    </div>
  );
}
