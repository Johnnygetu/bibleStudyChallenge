import { useState, useEffect, useRef } from "react";
import { Flame, Trophy, Crown, Brain } from "lucide-react";
import { useGeneralContext } from "@/context/GeneralContext";
import { useUserContext } from "@/context/UserContext";
import { useDateOverride } from "@/context/DateOverrideContext";
import { getReaderDisplayName } from "@/lib/reader";
import { Avatar } from "@/components/ui";
import ayatLogo from "@/assets/ayat-logo.png";
import "./LeaderboardScreen.css";

export function LeaderboardScreen() {
  const { apiUrl } = useGeneralContext();
  const { user } = useUserContext();
  const { buildUrl } = useDateOverride();
  const myEntryRef = useRef(null);

  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    async function fetchLeaderboard() {
      if (!apiUrl) {
        setLoadError("The server address is not configured. Set VITE_API_URL to the public Laravel API base URL ending in /api, then rebuild the reader app.");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(buildUrl(`${apiUrl}/leaderboard`), {
          headers: { Accept: "application/json" },
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.message || `Leaderboard request failed (HTTP ${res.status}).`);
        }
        if (!Array.isArray(data?.personal)) {
          throw new Error("The server returned an invalid leaderboard response.");
        }

        const mapped = data.personal.map((person) => ({
          id: person.reader_id,
          name: getReaderDisplayName(person),
          current_streak: person.current_streak,
          score: person.total_score,
          photo_url: null,
        }));
        if (!cancelled) setEntries(mapped);
      } catch (err) {
        if (!cancelled) {
          setEntries([]);
          setLoadError(err instanceof TypeError
            ? `Couldn't reach the Bible Challenge server at ${apiUrl}. Check that the API is running and VITE_API_URL is correct.`
            : err instanceof Error ? err.message : "The leaderboard could not be loaded. Please try again.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    fetchLeaderboard();
    return () => {
      cancelled = true;
    };
  }, [apiUrl, buildUrl, fetchKey]);

  const myIndex = entries.findIndex((e) => e.id === user?.id);
  const myRank = myIndex >= 0 ? myIndex + 1 : null;

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        myEntryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

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

      {loadError && (
        <div className="data-error" role="alert">
          <p className="data-error__message">{loadError}</p>
          <button className="data-error__retry" onClick={() => setFetchKey((key) => key + 1)}>
            Retry
          </button>
        </div>
      )}

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
      {!isLoading && !loadError && top3.length > 0 && (
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
        {isLoading ? (
          <div className="leaderboard__status" role="status">Loading leaderboard…</div>
        ) : !loadError && entries.length === 0 ? (
          <div className="leaderboard__status">No leaderboard entries yet.</div>
        ) : restEntries.map((entry, idx) => {
          const rank = idx + 4;
          const isMe = entry.id === user?.id;
          return (
            <div
              key={entry.id}
              ref={isMe ? myEntryRef : null}
              className={`ranking-row${isMe ? " ranking-row--me" : ""}`}
            >
              <span className={`ranking-row__rank${isMe ? " ranking-row__rank--me" : ""}`}>
                {rank}
              </span>
              <Avatar src={entry.photo_url} name={entry.name} size={36} />
              <div className="ranking-row__identity">
                <p className={`ranking-row__name${isMe ? " ranking-row__name--me" : ""}`}>
                  {entry.name}
                  {isMe && <span className="ranking-row__you">(You)</span>}
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
              {/* <span className="ranking-row__score">{entry.score}</span> */}
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
        <Avatar src={entry.photo_url} name={entry.name} size={rank === 1 ? 56 : 48} ring={rank === 1} />
        <div className={`podium__badge podium__badge--${variant}`}>
          <Icon className="podium__badge-icon" fill="currentColor" />
        </div>
      </div>
      <p className={`podium__name${rank === 1 ? " podium__name--first" : ""}`}>
        {entry.name}
      </p>
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
