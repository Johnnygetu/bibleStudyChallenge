import { Users, TrendingUp, HelpCircle, AlertTriangle, BookOpen, UsersRound, MessageSquare } from 'lucide-react';
import { Skeleton, ErrorState } from '@/components/ui';
import { useDashboardContext } from '@/context/DashboardContext';

export default function Dashboard({ onNavigate }) {
  const { stats, currentWeek, totalWeeks, loading, error, reload } = useDashboardContext();

  if (error) {
    return (
      <div className="page">
        <ErrorState message={error} onRetry={reload} />
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="page stack-lg" aria-hidden="true">
        {/* Week banner */}
        <Skeleton className="sk-banner" />

        {/* Stat cards */}
        <div className="grid-2">
          <Skeleton className="sk-stat-wide" />
          <Skeleton className="sk-stat" />
          <Skeleton className="sk-stat" />
        </div>

        {/* On track vs falling behind */}
        <div className="grid-2">
          <Skeleton className="sk-mini" />
          <Skeleton className="sk-mini" />
        </div>

        {/* Church membership breakdown */}
        <div>
          <div className="sk-line sk-heading" />
          <div className="grid-3">
            <Skeleton className="sk-mini" />
            <Skeleton className="sk-mini" />
            <Skeleton className="sk-mini" />
          </div>
        </div>
      </div>
    );
  }

  const cards = [
    { label: 'Total Readers', value: stats.totalReaders, icon: Users, tab: 'readers' },
    { label: 'Quiz Questions', value: stats.totalQuestions, icon: HelpCircle, tab: 'quizzes' },
    { label: 'Groups', value: stats.totalGroups, icon: UsersRound, tab: 'groups' },
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
            <span className="week-total">of {totalWeeks}</span>
          </div>
          <div className="week-progress">
            <div className="week-track">
              <div
                className="week-fill"
                style={{ width: `${(currentWeek / totalWeeks) * 100}%` }}
              />
            </div>
            <span className="week-pct">
              {Math.round((currentWeek / totalWeeks) * 100)}%
            </span>
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

      {/* Posts shortcut: opens the community notes manager */}
      <button
        onClick={() => onNavigate?.('posts')}
        className="btn-primary btn-block dashboard-posts-btn"
      >
        <MessageSquare className="icon-20" strokeWidth={2.2} />
        Posts
      </button>

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

      {/* Church membership breakdown */}
      <div>
        <h2 className="section-title">Church Membership</h2>
        <div className="grid-3">
          <div className="stat-tile">
            <p className="stat-tile-value">{stats.churchMembers}</p>
            <p className="stat-tile-label">Church Members</p>
          </div>
          <div className="stat-tile">
            <p className="stat-tile-value danger">{stats.nonChurchMembers}</p>
            <p className="stat-tile-label">Non Members</p>
          </div>
          <div className="stat-tile">
            <p className="stat-tile-value ember">{stats.unknownChurchMembers}</p>
            <p className="stat-tile-label">Unknown</p>
          </div>
        </div>
      </div>

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
