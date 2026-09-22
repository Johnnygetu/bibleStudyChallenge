import { useEffect, useState } from 'react';
import { Flame, Trophy, Crown, Medal, Award } from 'lucide-react';
import { dummyReaders, dummyQuizResponses, dummyProgress } from '@/lib/dummy';
import type { Reader, QuizResponse, ReadingProgress, LeaderboardEntry } from '@/lib/types';
import { Avatar, Skeleton } from '@/components/ui';

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Simulate network delay
      await new Promise(r => setTimeout(r, 500));

      const allReaders = dummyReaders;
      const allResponses = dummyQuizResponses;
      const allProgress = dummyProgress;

      const progressByReader = new Map<string, number>();
      allProgress.forEach((p) => {
        if (p.completed) {
          progressByReader.set(p.reader_id, (progressByReader.get(p.reader_id) || 0) + 1);
        }
      });

      const result: LeaderboardEntry[] = allReaders.map((reader) => {
        const readerResponses = allResponses.filter((r) => r.reader_id === reader.id);
        const totalCorrect = readerResponses.filter((r) => r.is_correct).length;
        const totalAnswered = readerResponses.length;
        return {
          reader_id: reader.id,
          reader_name: reader.name,
          total_correct: totalCorrect,
          total_answered: totalAnswered,
          current_streak: reader.current_streak,
          longest_streak: reader.longest_streak,
          days_completed: progressByReader.get(reader.id) || 0,
        };
      });

      result.sort((a, b) => {
        if (b.total_correct !== a.total_correct) return b.total_correct - a.total_correct;
        if (b.current_streak !== a.current_streak) return b.current_streak - a.current_streak;
        return b.days_completed - a.days_completed;
      });

      setEntries(result);
      setLoading(false);
    }
    load();
  }, []);

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

  if (entries.length === 0) {
    return (
      <div className="px-5 pt-16 pb-24 text-center">
        <Trophy className="w-12 h-12 text-primary-400/40 mx-auto mb-4" />
        <h2 className="text-lg font-serif text-ink-100 mb-2">No Rankings Yet</h2>
        <p className="text-sm text-ink-400">Readers will appear here once they start answering quizzes.</p>
      </div>
    );
  }

  const top3 = entries.slice(0, 3);
  const restEntries = entries.slice(3);

  return (
    <div className="px-5 pt-6 pb-24 space-y-5 animate-fade-in max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <Trophy className="w-5 h-5 text-primary-400" />
        <h1 className="text-2xl font-serif font-semibold text-ink-100">Leaderboard</h1>
      </div>

      {/* Podium */}
      {top3.length > 0 && (
        <div className="flex items-end justify-center gap-3 pt-4 pb-2">
          {top3[1] && <PodiumColumn entry={top3[1]} rank={2} height={88} />}
          {top3[0] && <PodiumColumn entry={top3[0]} rank={1} height={112} />}
          {top3[2] && <PodiumColumn entry={top3[2]} rank={3} height={76} />}
        </div>
      )}

      {/* Full list */}
      <div className="space-y-2">
        {restEntries.map((entry, idx) => {
          const rank = idx + 4;
          return (
            <div
              key={entry.reader_id}
              className="flex items-center gap-3 p-3 rounded-xl transition-all bg-ink-850 border border-ink-700/30"
            >
              <span className="w-7 text-center text-sm font-semibold tabular-nums text-ink-500">
                {rank}
              </span>
              <Avatar name={entry.reader_name} size={36} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-ink-200">
                  {entry.reader_name}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-xs text-ink-400">
                    <Flame className="w-3 h-3 text-primary-400/70" fill="currentColor" />
                    {entry.current_streak}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-ink-400">
                    <Brain className="w-3 h-3 text-primary-400/70" />
                    {entry.total_correct}
                  </span>
                </div>
              </div>
              <span className="text-sm font-bold text-primary-700 tabular-nums">
                {entry.total_correct}
              </span>
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
    3: { bg: "from-amber-500/15 to-amber-500/5", border: "border-amber-500/30", text: "text-amber-500", icon: Trophy },
  };
  const c = colors[rank as 1 | 2 | 3];
  const Icon = c.icon;

  return (
    <div className="flex flex-col items-center" style={{ width: 80 }}>
      <div className="relative mb-2">
        <Avatar name={entry.reader_name} size={rank === 1 ? 56 : 48} ring={rank === 1} />
        <div className={`absolute -top-2 -right-1 w-6 h-6 rounded-full bg-ink-900 flex items-center justify-center ${c.text}`}>
          <Icon className="w-3.5 h-3.5" fill="currentColor" />
        </div>
      </div>
      <p className={`text-xs font-medium truncate max-w-full ${rank === 1 ? "text-primary-600" : "text-ink-300"}`}>
        {entry.reader_name.split(' ')[0]}
      </p>
      <p className="text-[10px] text-ink-500 mb-2 text-center leading-tight">
        {entry.current_streak} streak<br/>{entry.total_correct} correct
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
