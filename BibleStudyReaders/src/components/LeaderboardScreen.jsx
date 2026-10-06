import { Flame, Trophy, Crown, Brain } from "lucide-react";
import { useLeaderboardContext } from "@/context/LeaderboardContext";
import { ApiErrorMessage, Avatar } from "@/components/ui";
import ayatLogo from "@/assets/ayat-logo.png";
import "./LeaderboardScreen.css";

// The board, the reader's rank and the auto-scroll to their row are all owned
// by LeaderboardContext; this screen only renders them.
export function LeaderboardScreen() {
  const {
    entries,
    top3,
    restEntries,
    myEntry,
    myRank,
    loading,
    error,
    reload,
    myEntryRef,
  } = useLeaderboardContext();

  return (
    <div className="screen leaderboard animate-fade-in">
      {/* Brand Header */}
      <div className="brand">
        <div className="brand__row">
          <div
            className="brand__logo"
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
            <h2 className="brand__name">Ayat Mekane Eyesus</h2>
            <p className="brand__tagline">Bible Challenge</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="leaderboard__header">
        <Trophy className="leaderboard__header-icon" />
        <h1 className="leaderboard__header-title">Leaderboard</h1>
      </div>

      {error && <ApiErrorMessage message={error} onRetry={reload} />}

      {loading ? (
        <div className="leaderboard-empty">
          <p className="leaderboard-empty__text">Loading leaderboard…</p>
        </div>
      ) : error ? (
        <div className="leaderboard-empty">
          <Trophy className="leaderboard-empty__icon" />
          <p className="leaderboard-empty__title">Leaderboard unavailable</p>
          <p className="leaderboard-empty__text">{error}</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="leaderboard-empty">
          <Trophy className="leaderboard-empty__icon" />
          <p className="leaderboard-empty__title">No readers yet</p>
          <p className="leaderboard-empty__text">
            Rankings will appear here once readers start scoring.
          </p>
        </div>
      ) : (
        <>
      {/* My stats card */}
      {myEntry && (
        <div className="card-primary my-stats">
          <div className="my-stats__rank">
            <span className="my-stats__rank-value">#{myRank}</span>
            <span className="my-stats__rank-label">Your rank</span>
          </div>
          <div className="my-stats__divider" />
          <div className="my-stats__grid">
            <div className="my-stats__stat">
              <Flame className="my-stats__stat-icon" fill="currentColor" />
              <span className="my-stats__stat-value">{myEntry.current_streak}</span>
              <span className="my-stats__stat-label">Streak</span>
            </div>
            <div className="my-stats__stat">
              <Brain className="my-stats__stat-icon" />
              <span className="my-stats__stat-value">{myEntry.score}</span>
              <span className="my-stats__stat-label">Score</span>
            </div>
          </div>
        </div>
      )}

      {/* Podium */}
      {top3.length > 0 && (
        <div className="podium">
          {top3[1] && <PodiumColumn entry={top3[1]} height={88} />}
          {top3[0] && <PodiumColumn entry={top3[0]} height={112} />}
          {top3[2] && <PodiumColumn entry={top3[2]} height={76} />}
        </div>
      )}

      {/* Full list */}
      <div className="ranking-list">
        {restEntries.map((entry) => (
          <div
            key={entry.id}
            ref={entry.isMe ? myEntryRef : null}
            className={`ranking-row${entry.isMe ? " ranking-row--me" : ""}`}
          >
            <span className={`ranking-row__rank${entry.isMe ? " ranking-row__rank--me" : ""}`}>
              {entry.rank}
            </span>
            <Avatar src={entry.photo_url} name={entry.name} size={36} />
            <div className="ranking-row__identity">
              <p className={`ranking-row__name${entry.isMe ? " ranking-row__name--me" : ""}`}>
                {entry.name}
                {entry.isMe && <span className="ranking-row__you">(You)</span>}
              </p>
              <div className="ranking-row__stats">
                <span className="ranking-row__stat">
                  <Flame className="ranking-row__stat-icon" fill="currentColor" />
                  {entry.current_streak}
                </span>
                <span className="ranking-row__stat">
                  <Trophy className="ranking-row__stat-icon" />
                  {entry.score}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
        </>
      )}
    </div>
  );
}

function PodiumColumn({ entry, height }) {
  const rank = entry.rank;
  const variant = rank === 1 ? "gold" : rank === 2 ? "silver" : "bronze";
  const Icon = rank === 1 ? Crown : Trophy;

  return (
    <div className="podium__column">
      <div className="podium__avatar-wrap">
        <Avatar src={entry.photo_url} name={entry.name} size={rank === 1 ? 56 : 48} ring={rank === 1} />
        <div className={`podium__badge podium__badge--${variant}`}>
          <Icon className="podium__badge-icon" fill="currentColor" />
        </div>
      </div>
      <p className={`podium__name${rank === 1 ? " podium__name--first" : ""}`}>
        {entry.name}
      </p>
      {entry.isMe && <span className="podium__you">(You)</span>}
      <p className="podium__stats">
        {entry.current_streak} streak / {entry.score} score
      </p>
      <div
        className={`podium__bar podium__bar--${variant}`}
        style={{ height }}
      >
        <span className="podium__rank">{rank}</span>
      </div>
    </div>
  );
}
