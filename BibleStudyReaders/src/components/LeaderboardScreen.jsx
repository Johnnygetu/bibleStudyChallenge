import { useEffect, useRef } from "react";
import { Flame, Trophy, Crown, Brain } from "lucide-react";
import { useApp } from "@/lib/context";
import { LEADERBOARD } from "@/lib/data";
import { Avatar } from "@/components/ui";
import ayatLogo from "@/assets/ayat-logo.png";
import "./LeaderboardScreen.css";

export function LeaderboardScreen() {
  const { profile } = useApp();
  const myEntryRef = useRef(null);

  const entries = LEADERBOARD;
  const myIndex = entries.findIndex((e) => e.id === profile.id);
  const myRank = myIndex >= 0 ? myIndex + 1 : null;

  useEffect(() => {
    const timer = setTimeout(() => {
      myEntryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const top3 = entries.slice(0, 3);
  const restEntries = entries.slice(3);
  const myEntry = myIndex >= 0 ? entries[myIndex] : null;

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
              <span className="my-stats__stat-value">{myEntry.total_quiz_correct}</span>
              <span className="my-stats__stat-label">Correct</span>
            </div>
          </div>
        </div>
      )}

      {/* Podium */}
      {top3.length > 0 && (
        <div className="podium">
          {top3[1] && (
            <PodiumColumn entry={top3[1]} rank={2} height={88} />
          )}
          {top3[0] && (
            <PodiumColumn entry={top3[0]} rank={1} height={112} />
          )}
          {top3[2] && (
            <PodiumColumn entry={top3[2]} rank={3} height={76} />
          )}
        </div>
      )}

      {/* Full list */}
      <div className="ranking-list">
        {restEntries.map((entry, idx) => {
          const rank = idx + 4;
          const isMe = entry.id === profile.id;
          return (
            <div
              key={entry.id}
              ref={isMe ? myEntryRef : null}
              className={`ranking-row${isMe ? " ranking-row--me" : ""}`}
            >
              <span className={`ranking-row__rank${isMe ? " ranking-row__rank--me" : ""}`}>
                {rank}
              </span>
              <Avatar src={entry.photo_url} name={`${entry.first_name} ${entry.last_name ?? ""}`} size={36} />
              <div className="ranking-row__identity">
                <p className={`ranking-row__name${isMe ? " ranking-row__name--me" : ""}`}>
                  {entry.first_name} {entry.last_name ?? ""}
                  {isMe && <span className="ranking-row__you">(You)</span>}
                </p>
                <div className="ranking-row__stats">
                  <span className="ranking-row__stat">
                    <Flame className="ranking-row__stat-icon" fill="currentColor" />
                    {entry.current_streak}
                  </span>
                  <span className="ranking-row__stat">
                    <Trophy className="ranking-row__stat-icon" />
                    {entry.total_quiz_correct}
                  </span>
                </div>
              </div>
              <span className="ranking-row__score">{entry.score}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PodiumColumn({ entry, rank, height }) {
  const variant = rank === 1 ? "gold" : rank === 2 ? "silver" : "bronze";
  const Icon = rank === 1 ? Crown : Trophy;

  return (
    <div className="podium__column">
      <div className="podium__avatar-wrap">
        <Avatar src={entry.photo_url} name={`${entry.first_name} ${entry.last_name ?? ""}`} size={rank === 1 ? 56 : 48} ring={rank === 1} />
        <div className={`podium__badge podium__badge--${variant}`}>
          <Icon className="podium__badge-icon" fill="currentColor" />
        </div>
      </div>
      <p className={`podium__name${rank === 1 ? " podium__name--first" : ""}`}>
        {entry.first_name}
      </p>
      <p className="podium__stats">
        {entry.current_streak} streak / {entry.total_quiz_correct} correct
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
