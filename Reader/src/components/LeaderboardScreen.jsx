import { Trophy, Flame, Brain } from 'lucide-react';
import { Avatar } from './ui';
import { useLeaderboard } from '../contexts/LeaderboardContext';
import './LeaderboardScreen.css';

export default function LeaderboardScreen() {
  const { entries, loading } = useLeaderboard();

  // For dummy purpose, let's assume current reader is the first one in the list
  const currentReaderId = entries.length > 0 ? entries[0].reader_id : null;

  if (loading) {
    return (
      <div className="loading-container flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  const top3 = entries.slice(0, 3);
  const restEntries = entries.slice(3);

  return (
    <div className="leaderboard-screen animate-fade-in">
      <header className="brand-header">
        <div className="brand-header-content">
          <Avatar name="Ayat Mekane Eyesus" size={48} />
          <div>
            <h1 className="brand-title">Ayat Mekane Eyesus</h1>
            <p className="brand-subtitle">Leaderboard</p>
          </div>
        </div>
      </header>

      <div className="podium-container">
        {top3[1] && <PodiumColumn entry={top3[1]} rank={2} height={88} isCurrent={top3[1].reader_id === currentReaderId} />}
        {top3[0] && <PodiumColumn entry={top3[0]} rank={1} height={112} isCurrent={top3[0].reader_id === currentReaderId} />}
        {top3[2] && <PodiumColumn entry={top3[2]} rank={3} height={76} isCurrent={top3[2].reader_id === currentReaderId} />}
      </div>

      <div className="list-container">
        {restEntries.map((entry, idx) => {
          const rank = idx + 4;
          const isCurrent = entry.reader_id === currentReaderId;
          return (
            <div
              key={entry.reader_id}
              className={`list-item ${isCurrent ? 'current-user-item' : ''}`}
            >
              <span className="item-rank">{rank}</span>
              <Avatar name={entry.reader_name} size={36} />
              
              <div className="item-details">
                <p className="item-name">
                  {entry.reader_name} {isCurrent && '(You)'}
                </p>
                <div className="item-stats">
                  <span className="stat-badge text-ember-600">
                    <Flame className="stat-icon" fill="currentColor" />
                    {entry.current_streak}
                  </span>
                  <span className="stat-badge text-primary-500">
                    <Brain className="stat-icon" />
                    {entry.total_correct}
                  </span>
                </div>
              </div>
              <span className="item-score">{entry.total_correct}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PodiumColumn({ entry, rank, height, isCurrent }) {
  const getColors = () => {
    switch(rank) {
      case 1: return { 
        bg: "podium-bg-1", 
        border: "podium-border-1", 
        text: "podium-text-1" 
      };
      case 2: return { 
        bg: "podium-bg-2", 
        border: "podium-border-2", 
        text: "podium-text-2" 
      };
      case 3: return { 
        bg: "podium-bg-3", 
        border: "podium-border-3", 
        text: "podium-text-3" 
      };
      default: return {};
    }
  };
  
  const c = getColors();

  return (
    <div className={`podium-col ${isCurrent ? 'current-user-podium' : ''}`}>
      <div className="podium-avatar-wrapper">
        <Avatar name={entry.reader_name} size={rank === 1 ? 56 : 48} ring={rank === 1} />
        <div className={`podium-badge ${c.text}`}>
          <Trophy className="podium-badge-icon" fill="currentColor" />
        </div>
      </div>
      <p className={`podium-name ${rank === 1 ? "text-primary-600" : "text-ink-400"}`}>
        {entry.reader_name.split(' ')[0]}
      </p>
      <p className="podium-stats">
        {entry.current_streak} streak
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
