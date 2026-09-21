import { Flame, Trophy, Crown } from 'lucide-react';
import { Avatar, Skeleton } from '../components/ui';
import { useLeaderboard } from '../contexts/LeaderboardContext';
import './Leaderboard.css';

export default function Leaderboard() {
  const { entries, loading } = useLeaderboard();

  if (loading) {
    return (
      <div className="leaderboard-loading">
        <Skeleton className="skeleton-hero" />
        <Skeleton className="skeleton-item" />
        <Skeleton className="skeleton-item" />
        <Skeleton className="skeleton-item" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="leaderboard-empty">
        <Trophy className="empty-icon" />
        <h2 className="empty-title">No Rankings Yet</h2>
        <p className="empty-subtitle">Readers will appear here once they start answering quizzes.</p>
      </div>
    );
  }

  const top3 = entries.slice(0, 3);
  const restEntries = entries.slice(3);

  return (
    <div className="leaderboard-container">
      {/* Header */}
      <div className="leaderboard-header">
        <Trophy className="header-icon" />
        <h1 className="header-title">Leaderboard</h1>
      </div>

      {/* Podium */}
      {top3.length > 0 && (
        <div className="podium-container">
          {top3[1] && <PodiumColumn entry={top3[1]} rank={2} height={88} />}
          {top3[0] && <PodiumColumn entry={top3[0]} rank={1} height={112} />}
          {top3[2] && <PodiumColumn entry={top3[2]} rank={3} height={76} />}
        </div>
      )}

      {/* Full list */}
      <div className="list-container">
        {restEntries.map((entry, idx) => {
          const rank = idx + 4;
          return (
            <div
              key={entry.reader_id}
              className="list-item"
            >
              <span className="item-rank">
                {rank}
              </span>
              <Avatar name={entry.reader_name} size={36} />
              <div className="item-details">
                <p className="item-name">
                  {entry.reader_name}
                </p>
                <div className="item-stats">
                  <span className="stat-badge">
                    <Flame className="stat-icon" fill="currentColor" />
                    {entry.current_streak}
                  </span>
                  <span className="stat-badge">
                    <Brain className="stat-icon" />
                    {entry.total_correct}
                  </span>
                </div>
              </div>
              <span className="item-score">
                {entry.total_correct}
              </span>
            </div>
          );
        })}
      </div>

      {entries.length <= 3 && (
        <p className="footer-text">
          More readers will appear as they join the challenge
        </p>
      )}
    </div>
  );
}

function PodiumColumn({ entry, rank, height }) {
  const getColors = () => {
    switch(rank) {
      case 1: return { 
        bg: "podium-bg-1", 
        border: "podium-border-1", 
        text: "podium-text-1", 
        icon: Crown 
      };
      case 2: return { 
        bg: "podium-bg-2", 
        border: "podium-border-2", 
        text: "podium-text-2", 
        icon: Trophy 
      };
      case 3: return { 
        bg: "podium-bg-3", 
        border: "podium-border-3", 
        text: "podium-text-3", 
        icon: Trophy 
      };
      default: return {};
    }
  };
  
  const c = getColors();
  const Icon = c.icon;

  return (
    <div className="podium-col">
      <div className="podium-avatar-wrapper">
        <Avatar name={entry.reader_name} size={rank === 1 ? 56 : 48} ring={rank === 1} />
        <div className={`podium-badge ${c.text}`}>
          <Icon className="podium-badge-icon" fill="currentColor" />
        </div>
      </div>
      <p className={`podium-name ${rank === 1 ? "text-primary-600" : "text-ink-300"}`}>
        {entry.reader_name.split(' ')[0]}
      </p>
      <p className="podium-stats">
        {entry.current_streak} streak<br/>{entry.total_correct} correct
      </p>
      <div
        className={`podium-base ${c.bg} ${c.border}`}
        style={{ height }}
      >
        <span className={`podium-rank ${c.text}`}>{rank}</span>
      </div>
    </div>
  );
}

function Brain({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.293 4 4 0 0 0 .556 6.883A3 3 0 0 0 12 21a3 3 0 0 0 3-3v-1a2 2 0 0 1 2-2h1a3 3 0 0 0 3-3 3 3 0 0 0-3-3" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.293 4 4 0 0 1-.556 6.883A3 3 0 0 1 12 21" />
    </svg>
  );
}
