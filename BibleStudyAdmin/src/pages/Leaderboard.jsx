import { useState } from 'react';
import { Flame, Trophy, Crown, User, UsersRound, Users } from 'lucide-react';
import { Avatar, Skeleton, ErrorState } from '@/components/ui';
import { useLeaderboardContext } from '@/context/LeaderboardContext';

const VIEWS = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'group', label: 'Group', icon: UsersRound },
];

export default function Leaderboard() {
  const { entries, groupEntries, loading, error, reload } = useLeaderboardContext();
  const [view, setView] = useState('personal');

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

  if (error) {
    return (
      <div className="lb-page">
        <ErrorState message={error} onRetry={reload} />
      </div>
    );
  }

  const isGroup = view === 'group';
  const rows = isGroup ? groupEntries : entries;
  const isEmpty = rows.length === 0;
  const top3 = rows.slice(0, 3);
  const restRows = rows.slice(3);

  return (
    <div className="lb-page fade-in">
      {/* Header */}
      <div className="lb-header">
        <Trophy className="icon-20 lb-header-icon" />
        <h1 className="lb-header-title serif">Leaderboard</h1>
      </div>

      {/* Personal / Group tab */}
      <div className="lb-tabs">
        <div className="toggle-group">
          {VIEWS.map((v) => {
            const Icon = v.icon;
            return (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={view === v.id ? 'toggle-btn active' : 'toggle-btn'}
              >
                <Icon className="icon-14" />
                {v.label}
              </button>
            );
          })}
        </div>
      </div>

      {isEmpty ? (
        <div className="lb-empty">
          {isGroup ? (
            <UsersRound className="icon-48 lb-empty-icon" />
          ) : (
            <Trophy className="icon-48 lb-empty-icon" />
          )}
          <h2 className="lb-empty-title serif">
            {isGroup ? 'No Groups Yet' : 'No Rankings Yet'}
          </h2>
          <p className="lb-empty-sub">
            {isGroup
              ? 'Groups will appear here once readers are assigned to them.'
              : 'Readers will appear here once they start answering quizzes.'}
          </p>
        </div>
      ) : (
        <>
          {/* Podium */}
          {top3.length > 0 && (
            <div className="lb-podium">
              {top3[1] && (
                <PodiumColumn
                  {...podiumProps(top3[1], isGroup)}
                  rank={2}
                  height={88}
                />
              )}
              {top3[0] && (
                <PodiumColumn
                  {...podiumProps(top3[0], isGroup)}
                  rank={1}
                  height={112}
                />
              )}
              {top3[2] && (
                <PodiumColumn
                  {...podiumProps(top3[2], isGroup)}
                  rank={3}
                  height={76}
                />
              )}
            </div>
          )}

          {/* Full list */}
          <div className="lb-list">
            {restRows.map((item, idx) =>
              isGroup ? (
                <GroupRow key={item.group_id} group={item} rank={idx + 4} />
              ) : (
                <PersonalRow key={item.reader_id} entry={item} rank={idx + 4} />
              ),
            )}
          </div>

          {rows.length <= 3 && (
            <p className="lb-note">
              {isGroup
                ? 'More groups will appear as readers are assigned'
                : 'More readers will appear as they join the challenge'}
            </p>
          )}
        </>
      )}
    </div>
  );
}

function podiumProps(item, isGroup) {
  if (isGroup) {
    return {
      name: item.group_name,
      meta: (
        <>
          {item.members_count} member{item.members_count === 1 ? '' : 's'}
          <br />
          {item.total_correct} correct
        </>
      ),
    };
  }
  return {
    name: item.reader_name,
    meta: (
      <>
        {item.current_streak} streak
        <br />
        {item.total_correct} correct
      </>
    ),
  };
}

function PersonalRow({ entry, rank }) {
  return (
    <div className="lb-row">
      <span className="lb-rank tnum">{rank}</span>
      <Avatar name={entry.reader_name} size={36} />
      <div className="lb-row-main">
        <p className="lb-row-name truncate">{entry.reader_name}</p>
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
      <span className="lb-score tnum">{entry.total_correct}</span>
    </div>
  );
}

function GroupRow({ group, rank }) {
  return (
    <div className="lb-row">
      <span className="lb-rank tnum">{rank}</span>
      <Avatar name={group.group_name} size={36} />
      <div className="lb-row-main">
        <p className="lb-row-name truncate">{group.group_name}</p>
        <div className="lb-row-stats">
          <span className="lb-stat">
            <Users className="icon-12 lb-stat-icon" />
            {group.members_count} member{group.members_count === 1 ? '' : 's'}
          </span>
          <span className="lb-stat">
            <Brain className="icon-12 lb-stat-icon" />
            {group.avg_correct} avg
          </span>
        </div>
      </div>
      <span className="lb-score tnum">{group.total_correct}</span>
    </div>
  );
}

function PodiumColumn({ name, meta, rank, height }) {
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
        <Avatar name={name} size={rank === 1 ? 56 : 48} ring={rank === 1} />
        <div className={`podium-badge ${c.modifier}`}>
          <Icon className="icon-14" fill="currentColor" />
        </div>
      </div>
      <p className={`podium-name truncate${rank === 1 ? ' primary' : ''}`}>
        {name}
      </p>
      <p className="podium-meta">{meta}</p>
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
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.293 4 4 0 0 1-.556 6.883A3 3 0 0 1 12 21a3 3 0 0 1-3-3v-1a2 2 0 0 1 2-2h1a3 3 0 0 0 3-3 3 3 0 0 0-3-3" />
    </svg>
  );
}
