import { useCallback, useEffect, useState, useRef } from "react";
import { Flame, Trophy, Crown, Medal, Award } from "lucide-react";
import { useApp } from "@/lib/context";
import { fetchLeaderboard } from "@/lib/api";
import type { LeaderboardEntry } from "@/lib/types";
import { Avatar, Skeleton, ErrorState } from "@/components/ui";
import { hapticImpact } from "@/lib/telegram";
import ayatLogo from "@/assets/ayat-logo.png";

export function LeaderboardScreen() {
  const { profile } = useApp();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const myEntryRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { entries: data, myRank: rank } = await fetchLeaderboard(profile.id);
      setEntries(data);
      setMyRank(rank);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  }, [profile.id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!loading && myEntryRef.current) {
      setTimeout(() => {
        myEntryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="px-5 pt-6 pb-24 space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={load} />;
  }

  if (entries.length === 0) {
    return (
      <div className="px-5 pt-16 pb-24 text-center">
        <Trophy className="w-12 h-12 text-primary-400/40 mx-auto mb-4" />
        <h2 className="text-lg font-serif text-ink-100 mb-2">No Rankings Yet</h2>
        <p className="text-sm text-ink-400">Start reading and answering quizzes to appear on the leaderboard.</p>
      </div>
    );
  }

  const top3 = entries.slice(0, 3);
  const restEntries = entries.slice(3);
  const myEntry = entries.find((e) => e.id === profile.id);

  return (
    <div className="px-5 pt-6 pb-24 space-y-5 animate-fade-in">
      {/* Brand Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 bg-primary-400 shrink-0 drop-shadow-md" 
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
            <h2 className="text-lg font-bold text-primary-400 uppercase tracking-wider">Ayat Mekane Eyesus</h2>
            <p className="text-xs text-ink-400 font-semibold tracking-widest uppercase">Bible Challenge</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <Trophy className="w-5 h-5 text-primary-400" />
        <h1 className="text-2xl font-serif font-semibold text-ink-100">Leaderboard</h1>
      </div>

      {/* My stats card */}
      {myEntry && (
        <div className="card-primary p-4 flex items-center gap-3">
          <div className="flex flex-col items-center justify-center w-14">
            <span className="text-2xl font-bold text-primary-700 tabular-nums">#{myRank}</span>
            <span className="text-[10px] text-ink-400">Your rank</span>
          </div>
          <div className="w-px h-12 bg-ink-700" />
          <div className="flex-1 grid grid-cols-2 gap-3">
            <div className="flex flex-col items-center">
              <Flame className="w-4 h-4 text-primary-400 mb-0.5" fill="currentColor" />
              <span className="text-lg font-bold text-primary-700 tabular-nums">{myEntry.current_streak}</span>
              <span className="text-[10px] text-ink-400">Streak</span>
            </div>
            <div className="flex flex-col items-center">
              <Brain className="w-4 h-4 text-primary-400 mb-0.5" />
              <span className="text-lg font-bold text-primary-700 tabular-nums">{myEntry.total_quiz_correct}</span>
              <span className="text-[10px] text-ink-400">Correct</span>
            </div>
          </div>
        </div>
      )}

      {/* Podium */}
      {top3.length > 0 && (
        <div className="flex items-end justify-center gap-3 pt-4 pb-2">
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
      <div ref={listRef} className="space-y-2">
        {restEntries.map((entry, idx) => {
          const rank = idx + 4;
          const isMe = entry.id === profile.id;
          return (
            <div
              key={entry.id}
              ref={isMe ? myEntryRef : null}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                isMe
                  ? "bg-primary-400/10 border border-primary-400/30"
                  : "bg-ink-850 border border-ink-700/30"
              }`}
            >
              <span className={`w-7 text-center text-sm font-semibold tabular-nums ${
                isMe ? "text-primary-700" : "text-ink-500"
              }`}>
                {rank}
              </span>
              <Avatar src={entry.photo_url} name={`${entry.first_name} ${entry.last_name ?? ""}`} size={36} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isMe ? "text-primary-600" : "text-ink-200"}`}>
                  {entry.first_name} {entry.last_name ?? ""}
                  {isMe && <span className="text-xs text-primary-400 ml-1">(You)</span>}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-xs text-ink-400">
                    <Flame className="w-3 h-3 text-primary-400/70" fill="currentColor" />
                    {entry.current_streak}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-ink-400">
                    <Trophy className="w-3 h-3 text-primary-400/70" />
                    {entry.total_quiz_correct}
                  </span>
                </div>
              </div>
              <span className="text-sm font-bold text-primary-700 tabular-nums">{entry.score}</span>
            </div>
          );
        })}
      </div>

      {entries.length <= 3 && (
        <p className="text-center text-xs text-ink-500 pt-4">
          More readers will appear as they join the challenge
        </p>
      )}
    </div>
  );
}

function PodiumColumn({ entry, rank, height }: { entry: LeaderboardEntry; rank: number; height: number }) {
  const colors = {
    1: { bg: "from-primary-400/20 to-primary-400/5", border: "border-primary-400/40", text: "text-primary-700", icon: Crown },
    2: { bg: "from-ink-300/15 to-ink-300/5", border: "border-ink-300/30", text: "text-ink-200", icon: Trophy },
    3: { bg: "from-ember-500/15 to-ember-500/5", border: "border-ember-500/30", text: "text-ember-500", icon: Trophy },
  };
  const c = colors[rank as 1 | 2 | 3];
  const Icon = c.icon;

  return (
    <div className="flex flex-col items-center" style={{ width: 80 }}>
      <div className="relative mb-2">
        <Avatar src={entry.photo_url} name={`${entry.first_name} ${entry.last_name ?? ""}`} size={rank === 1 ? 56 : 48} ring={rank === 1} />
        <div className={`absolute -top-2 -right-1 w-6 h-6 rounded-full bg-ink-900 flex items-center justify-center ${c.text}`}>
          <Icon className="w-3.5 h-3.5" fill="currentColor" />
        </div>
      </div>
      <p className={`text-xs font-medium truncate max-w-full ${rank === 1 ? "text-primary-600" : "text-ink-300"}`}>
        {entry.first_name}
      </p>
      <p className="text-[10px] text-ink-500 mb-2">
        {entry.current_streak} streak / {entry.total_quiz_correct} correct
      </p>
      <div
        className={`w-full rounded-t-lg bg-gradient-to-b ${c.bg} border-t ${c.border} flex items-start justify-center pt-2`}
        style={{ height }}
      >
        <span className={`text-lg font-bold ${c.text} tabular-nums`}>{rank}</span>
      </div>
    </div>
  );
}

function Brain({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.293 4 4 0 0 0 .556 6.883A3 3 0 0 0 12 21a3 3 0 0 0 3-3v-1a2 2 0 0 1 2-2h1a3 3 0 0 0 3-3 3 3 0 0 0-3-3" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.293 4 4 0 0 1-.556 6.883A3 3 0 0 1 12 21" />
    </svg>
  );
}
