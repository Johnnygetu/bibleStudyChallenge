import { Users, TrendingUp, HelpCircle, Flame, AlertTriangle, BookOpen } from 'lucide-react';
import { Avatar } from '../components/ui';
import { useDashboard } from '../contexts/DashboardContext';
import './Dashboard.css';

export default function Dashboard({ onNavigate }) {
  const { stats, currentWeek, recentReaders, loading } = useDashboard();

  if (loading || !stats) {
    return (
      <div className="dashboard-loading">
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
    <div className="dashboard-container">
      {/* Week banner */}
      <div className="dashboard-banner">
        <div className="banner-bg-circle-1" />
        <div className="banner-bg-circle-2" />
        <div className="banner-content">
          <p className="banner-label">Current Week</p>
          <div className="banner-week-info">
            <span className="banner-week-number">Week {currentWeek}</span>
            <span className="banner-week-total">of 26</span>
          </div>
          <div className="banner-progress-container">
            <div className="banner-progress-track">
              <div
                className="banner-progress-fill"
                style={{ width: `${(currentWeek / 26) * 100}%` }}
              />
            </div>
            <span className="banner-progress-text">{Math.round((currentWeek / 26) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stat-cards-grid">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const isFirst = idx === 0;
          return (
            <button key={card.label} onClick={() => onNavigate?.(card.tab)} className={`stat-card ${isFirst ? 'stat-card-first' : ''}`}>
              <Icon className={`stat-card-icon ${isFirst ? 'mb-3' : ''}`} strokeWidth={2.2} />
              <div>
                <p className="stat-card-value">{card.value}</p>
                <p className="stat-card-label">{card.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* On track vs falling behind */}
      <div className="track-cards-grid">
        <button onClick={() => onNavigate?.('progress')} className="track-card">
          <TrendingUp className="track-card-icon" />
          <div>
            <p className="track-card-value">{stats.onTrack}</p>
            <p className="track-card-label">On Track</p>
          </div>
        </button>
        <button onClick={() => onNavigate?.('progress')} className="track-card">
          <AlertTriangle className="track-card-icon" />
          <div>
            <p className="track-card-value">{stats.fallingBehind}</p>
            <p className="track-card-label">Falling Behind</p>
          </div>
        </button>
      </div>

      {/* Recent readers */}
      {recentReaders.length > 0 && (
        <div className="recent-readers-section">
          <h2 className="section-title">Recently Joined Readers</h2>
          <div className="recent-readers-list">
            {recentReaders.map((reader) => (
              <div key={reader.id} className="reader-item">
                <Avatar name={reader.name} size={40} />
                <div className="reader-info">
                  <p className="reader-name">{reader.name}</p>
                  <p className="reader-phone">{reader.phone || 'No phone'}</p>
                </div>
                {reader.current_streak > 0 && (
                  <span className="reader-streak">
                    <Flame className="streak-icon" />
                    {reader.current_streak}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.totalReaders === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon-wrapper">
            <BookOpen className="empty-state-icon" />
          </div>
          <p className="empty-state-title">No readers yet</p>
          <p className="empty-state-subtitle">Readers will appear here once they sign up via the bot</p>
        </div>
      )}
    </div>
  );
}
