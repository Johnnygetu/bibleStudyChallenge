import { Flame, Trophy, Crown } from 'lucide-react';
import { Avatar, Skeleton } from '@/components/ui';
import { useLeaderboardContext } from '@/context/LeaderboardContext';

export default function Leaderboard() {
  const { entries, loading } = useLeaderboardContext();

  if (loading) {
    return (
      <div className="lb-skeletons">
        <Skeleton className="sk-lg" />
        <Skeleton className="sk-md" />
        <Skeleton className="sk-md" />
        <Skeleton className="sk-md" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="lb-empty">
        <Trophy className="icon-48 lb-empty-icon" />
        <h2 className="lb-empty-title serif">No Rankings Yet</h2>
        <p className="lb-empty-sub">Readers will appear here once they start answering quizzes.</p>
      </div>
    );

  }

  const top3 = entries.slice(0, 3);
  const restEntries = entries.slice(3);

  return (
    <div className="lb-page fade-in">
      {/* Header */}
      <div className="lb-header">
        <Trophy className="icon-20 lb-header-icon" />
        <h1 className="lb-header-title serif">Leaderboard</h1>
      </div>

      {/* Podium */}
      {top3.length > 0 && (
        <div className="lb-podium">
          {top3[1] && <PodiumColumn entry={top3[1]} rank={2} height={88} />}
          {top3[0] && <PodiumColumn entry={top3[0]} rank={1} height={112} />}
          {top3[2] && <PodiumColumn entry={top3[2]} rank={3} height={76} />}
        </div>
      )}

      {/* Full list */}
      <div className="lb-list">
        {restEntries.map((entry, idx) => {
          const rank = idx + 4;
          return (
            <div
              key={entry.reader_id}
              className="lb-row"
            >
              <span className="lb-rank tnum">
                {rank}
              </span>
              <Avatar name={entry.reader_name} size={36} />
              <div className="lb-row-main">
                <p className="lb-row-name truncate">
                  {entry.reader_name}
                </p>
                <div className="lb-row-stats">
                  <span className="lb-stat">
                    <Flame className="icon-12 lb-stat-icon" fill="currentColor" />
                    {entry.current_streak}
                  </span>
                  <span className="lb-stat">
                    <Brain className="icon-12 lb-stat-icon" />
                    {entry.total_correct}
                  </span>
                </div>
              </div>
              <span className="lb-score tnum">
                {entry.total_correct}
              </span>
            </div>
          );
        })}
      </div>

      {entries.length <= 3 && (
        <p className="lb-note">
          More readers will appear as they join the challenge
        </p>
      )}
    </div>
  );
}

function PodiumColumn({ entry, rank, height }) {
  const styles = {
    1: { modifier: 'podium-gold', Icon: Crown },
    2: { modifier: 'podium-silver', Icon: Trophy },
    3: { modifier: 'podium-bronze', Icon: Trophy },
  };
  const c = styles[rank];
  const Icon = c.Icon;

  return (
    <div className="podium-col">
      <div className="podium-avatar-wrap">
        <Avatar name={entry.reader_name} size={rank === 1 ? 56 : 48} ring={rank === 1} />
        <div className={`podium-badge ${c.modifier}`}>
          <Icon className="icon-14" fill="currentColor" />
        </div>
      </div>
      <p className={`podium-name truncate${rank === 1 ? ' primary' : ''}`}>
        {entry.reader_name.split(' ')[0]}
      </p>
      <p className="podium-meta">
        {entry.current_streak} streak<br />{entry.total_correct} correct
      </p>
      <div
        className={`podium-block ${c.modifier}`}
        style={{ height }}
      >
        <span className="podium-rank tnum">{rank}</span>
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
