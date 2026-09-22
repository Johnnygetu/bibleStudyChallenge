import { useCallback, useEffect, useState } from "react";
import { Flame, BookOpen, Check, Calendar, ChevronRight, Sunrise, Trophy, Lock, Brain } from "lucide-react";
import { useApp } from "@/lib/context";
import {
  fetchReadingPlanForDay,
  fetchReadingPlanForWeek,
  fetchReadingProgress,
  markChapterComplete,
  unmarkChapter,
  updateStreak,
  getChapterLabels,
  calculateStreak,
  fetchQuizQuestionsForChapter,
  fetchQuizAnswers,
  fetchLeaderboard,
  submitQuizAnswer,
} from "@/lib/api";
import type { ReadingPlanDay, ReadingProgressEntry, QuizQuestion, QuizAnswer, LeaderboardEntry } from "@/lib/types";
import { hapticImpact, hapticNotification } from "@/lib/telegram";
import { ProgressBar, Skeleton, ErrorState, Avatar } from "@/components/ui";
import ayatLogo from "@/assets/ayat-logo.png";

interface DayGroup {
  planDay: ReadingPlanDay;
  chapterLabels: string[];
}

interface TodayScreenProps {
  onNavigate?: (tab: "quiz" | "leaderboard") => void;
}

export function TodayScreen({ onNavigate }: TodayScreenProps) {
  const { profile, challengeStartDate, refreshProfile } = useApp();
  const [todayGroups, setTodayGroups] = useState<DayGroup[]>([]);
  const [weekDays, setWeekDays] = useState<ReadingPlanDay[]>([]);
  const [progress, setProgress] = useState<ReadingProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [pendingChanges, setPendingChanges] = useState<Record<string, { planDayId: string; completed: boolean }>>({});
  const [saving, setSaving] = useState(false);
  const [todayQuestions, setTodayQuestions] = useState<QuizQuestion[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  const today = new Date();
  const daysSinceStart = Math.floor((today.getTime() - challengeStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const currentDay = Math.max(1, Math.min(182, daysSinceStart));
  const currentWeek = Math.ceil(currentDay / 7);

  const baseCompletedLabels = new Set(progress.map((p) => p.chapter_label));
  const completedLabels = new Set(baseCompletedLabels);
  for (const [label, change] of Object.entries(pendingChanges)) {
    if (change.completed) completedLabels.add(label);
    else completedLabels.delete(label);
  }

  const allTodayChapters = todayGroups.flatMap((g) => g.chapterLabels);
  const todayCompletedCount = allTodayChapters.filter((ch) => completedLabels.has(ch)).length;
  const todayTotal = allTodayChapters.length;
  
  const baseCompletedCount = allTodayChapters.filter((ch) => baseCompletedLabels.has(ch)).length;
  const baseAllDone = todayTotal > 0 && baseCompletedCount === todayTotal;
  const allDone = todayTotal > 0 && todayCompletedCount === todayTotal;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [dayPlan, weekPlan, lbData] = await Promise.all([
        fetchReadingPlanForDay(currentDay),
        fetchReadingPlanForWeek(currentWeek),
        fetchLeaderboard(profile.id)
      ]);
      setTodayGroups(dayPlan.map(d => ({ planDay: d, chapterLabels: getChapterLabels(d.book, d.chapters) })));
      setWeekDays(weekPlan);
      
      const allDayIds = [...new Set([...dayPlan.map((d) => d.id), ...weekPlan.map((d) => d.id)])];
      const prog = await fetchReadingProgress(profile.id, allDayIds);
      setProgress(prog);
      setLeaderboard(lbData.entries.slice(0, 5));
    } catch (err) {
      console.error(err);
      setError("Failed to load today's reading.");
    } finally {
      setLoading(false);
    }
  }, [currentDay, currentWeek, profile.id]);

  useEffect(() => {
    load();
  }, [load]);

  // Check for streak update when all chapters are done
  useEffect(() => {
    if (baseAllDone && !celebrating) {
      const todayStr = today.toISOString().split("T")[0];
      if (profile.last_read_date !== todayStr) {
        const { newStreak, newLongestStreak, shouldUpdate } = calculateStreak(
          profile.current_streak,
          profile.last_read_date,
          today
        );
        if (shouldUpdate) {
          updateStreak(profile.id, newStreak, newLongestStreak, todayStr)
            .then(() => {
              refreshProfile();
              setCelebrating(true);
              hapticNotification("success");
              setTimeout(() => setCelebrating(false), 3000);
            })
            .catch(() => {});
        }
      }
    }

    // Always fetch today's quizzes to display behind the lock overlay
    const fetchQuizzes = async () => {
      try {
        const qs: QuizQuestion[] = [];
        for (const label of allTodayChapters) {
          const q = await fetchQuizQuestionsForChapter(label);
          qs.push(...q);
        }
        const limitedQs = qs.slice(0, 5);
        setTodayQuestions(limitedQs);
        if (limitedQs.length > 0) {
          const ans = await fetchQuizAnswers(profile.id, limitedQs.map(q => q.id));
          const ansRecord: Record<string, string> = {};
          for (const a of ans) ansRecord[a.question_id] = a.selected_option;
          setQuizAnswers(ansRecord);
        }
      } catch (err) {
        console.error("Failed to fetch quizzes", err);
      }
    };
    fetchQuizzes();
  }, [celebrating, profile, today, refreshProfile, allTodayChapters.join(",")]);

  const handleToggleChapter = (planDayId: string, chapterLabel: string) => {
    hapticImpact("light");
    const isCompleted = completedLabels.has(chapterLabel);
    const newStatus = !isCompleted;
    
    setPendingChanges(prev => {
      const next = { ...prev };
      const originalStatus = baseCompletedLabels.has(chapterLabel);
      if (newStatus === originalStatus) {
        delete next[chapterLabel];
      } else {
        next[chapterLabel] = { planDayId, completed: newStatus };
      }
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const newlyCompleted: string[] = [];
      for (const [label, change] of Object.entries(pendingChanges)) {
        if (change.completed) {
          await markChapterComplete(profile.id, change.planDayId, label);
          newlyCompleted.push(label);
        } else {
          await unmarkChapter(profile.id, change.planDayId, label);
        }
      }
      
      setPendingChanges({});
      await load();

      hapticNotification("success");
    } catch (err) {
      console.error(err);
      hapticNotification("error");
    } finally {
      setSaving(false);
    }
  };

  const handleQuizAnswer = async (questionId: string, optionKey: "a"|"b"|"c"|"d") => {
    if (quizAnswers[questionId] || submittingQuiz) return;
    
    setSubmittingQuiz(true);
    hapticImpact("medium");
    try {
      const q = todayQuestions.find(qq => qq.id === questionId);
      if (!q) return;
      const isCorrect = q.correct_option === optionKey;
      
      await submitQuizAnswer(
        profile.id, 
        questionId, 
        optionKey, 
        isCorrect, 
        profile.total_quiz_correct + (isCorrect ? 1 : 0),
        profile.total_quiz_answered + 1
      );
      
      setQuizAnswers(prev => ({ ...prev, [questionId]: optionKey }));
      if (isCorrect) {
        hapticNotification("success");
      } else {
        hapticNotification("error");
      }
      await refreshProfile();
    } catch (err) {
      console.error("Failed to submit quiz", err);
    } finally {
      setSubmittingQuiz(false);
    }
  };

  if (loading) {
    return (
      <div className="px-5 pt-6 pb-24 space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-5 pt-12">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  if (todayGroups.length === 0) {
    return (
      <div className="px-5 pt-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-ink-800 flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-ink-500" />
        </div>
        <h2 className="text-xl font-serif text-ink-100 font-semibold mb-2">No Reading Today</h2>
        <p className="text-ink-400 text-sm max-w-[250px]">
          There are no chapters scheduled for today. Take a break or catch up on previous days!
        </p>
      </div>
    );
  }

  const greeting = today.getHours() < 12 ? "Good morning" : today.getHours() < 18 ? "Good afternoon" : "Good evening";
  const todayDateStr = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="px-5 pt-6 pb-24 space-y-6">
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

      {/* Greeting Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-ink-50 tracking-tight">
          {greeting}, {profile.first_name}
        </h1>
        <p className="text-sm font-medium text-ink-400 mt-1">{todayDateStr}</p>
      </div>

      {/* Streak Section */}
      <div className="card-primary p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary-400 font-semibold mb-1">
              <Flame className="w-5 h-5" fill="currentColor" />
              <span>{profile.current_streak} Day Streak</span>
            </div>
            <p className="text-xs text-primary-600/80">
              {profile.current_streak > 0 
              ? "You're on fire! Keep reading daily." 
              : "Read today to start your streak!"}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-primary-600/60 uppercase tracking-wider">Best</span>
            <p className="text-lg font-bold text-primary-700">
              {Math.max(profile.current_streak, profile.longest_streak)} days
            </p>
          </div>
        </div>
      </div>

      {/* Celebration banner */}
      {celebrating && (
        <div className="bg-success-500/20 border border-success-500/50 rounded-2xl p-4 flex items-start gap-3 animate-fade-in">
          <div className="bg-success-500/30 p-2 rounded-full">
            <Flame className="w-5 h-5 text-success-300" fill="currentColor" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-success-300">Today's reading complete!</p>
            <p className="text-xs text-success-300/80">Your streak is now {profile.current_streak} days. Keep it going!</p>
          </div>
        </div>
      )}

      {/* Today's Reading Section */}
      <div className="card-primary p-5">
        <div className="flex items-center gap-2 mb-1">
          <Sunrise className="w-4 h-4 text-primary-400" />
          <h2 className="text-sm font-medium text-primary-600">Today's Reading</h2>
          <span className="ml-auto text-xs text-ink-400">Day {currentDay} of 182</span>
        </div>
        <p className="text-xs text-primary-600/60 mb-4">{todayTotal} chapters total</p>
        
        <ProgressBar value={todayCompletedCount} max={todayTotal} showNumbers size="lg" />
        
        {allDone && !celebratingCheck(profile, today) && (
          <p className="text-xs text-success-500 mt-3 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" /> All caught up for today. See you tomorrow!
          </p>
        )}

        {/* Chapter List */}
        <div className="mt-5 pt-5 border-t border-primary-400/10 space-y-3">
          {todayGroups.map((group) => (
            <ChapterGroup
              key={group.planDay.id}
              book={group.planDay.book}
              chapters={group.planDay.chapters}
              chapterLabels={group.chapterLabels}
              completedLabels={completedLabels}
              onToggle={(ch) => handleToggleChapter(group.planDay.id, ch)}
            />
          ))}
        </div>
        
        {Object.keys(pendingChanges).length > 0 && (
          <button 
            onClick={handleSave} 
            disabled={saving} 
            className="w-full mt-5 btn-primary py-3 text-sm font-semibold transition-all"
          >
            {saving ? "Saving..." : "Save Progress"}
          </button>
        )}
      </div>

      {/* Today's Quiz Section */}
      <div className="relative">
        {!baseAllDone && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-ink-950/60 backdrop-blur-[2px] rounded-2xl border border-ink-700/50">
            <Lock className="w-8 h-8 text-ink-500 mb-2" />
            <p className="text-sm font-medium text-ink-300">Complete today's reading to unlock</p>
          </div>
        )}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-serif font-semibold text-ink-100">Today's Quiz</h2>
          </div>
          
          {todayQuestions.length > 0 ? (
            <div className="space-y-6 mt-4">
              {(baseAllDone ? todayQuestions : todayQuestions.slice(0, 1)).map((q, idx) => {
                const answer = quizAnswers[q.id];
                const options = [
                  { key: "a" as const, text: q.option_a },
                  { key: "b" as const, text: q.option_b },
                  { key: "c" as const, text: q.option_c },
                  { key: "d" as const, text: q.option_d },
                ];
                return (
                  <div key={q.id} className="space-y-3">
                    <p className="text-sm font-medium text-ink-200">
                      <span className="text-primary-400 mr-2">{idx + 1}.</span>
                      {q.question_text}
                    </p>
                    <div className="space-y-2">
                      {options.map(({ key, text }) => {
                        const isSelected = answer === key;
                        const isCorrectOpt = q.correct_option === key;
                        const showCorrect = answer && isCorrectOpt;
                        const showWrong = answer && isSelected && !isCorrectOpt;

                        let btnClass = "bg-ink-800 border-ink-700/50 text-ink-300 hover:bg-ink-750";
                        if (showCorrect) btnClass = "bg-success-500/20 border-success-500/50 text-success-300";
                        else if (showWrong) btnClass = "bg-ember-500/20 border-ember-500/50 text-ember-300";
                        else if (isSelected) btnClass = "bg-primary-500/20 border-primary-500/50 text-primary-700";

                        return (
                          <button
                            key={key}
                            disabled={!!answer || submittingQuiz}
                            onClick={() => handleQuizAnswer(q.id, key)}
                            className={`w-full text-left p-3 rounded-xl border text-sm transition-all flex items-center justify-between ${btnClass}`}
                          >
                            <span>{text}</span>
                            {showCorrect && <Check className="w-4 h-4 text-success-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-ink-400 mt-2">
              {baseAllDone 
                ? "No quizzes available for today's reading. Enjoy your day!" 
                : "Test your knowledge on what you just read. Earn points and climb the leaderboard!"}
            </p>
          )}
        </div>
      </div>

      {/* Top 5 Leaderboard */}
      <div className="card p-5 mt-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary-400" />
            <h3 className="font-serif font-semibold text-ink-100">Top 5 Leaderboard</h3>
          </div>
          {onNavigate && (
            <button 
              onClick={() => onNavigate("leaderboard")}
              className="flex items-center gap-1 text-xs font-medium text-primary-400 hover:text-primary-700 transition-colors"
            >
              See all <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
        
        {leaderboard.length > 0 ? (
          <div className="space-y-3">
            {leaderboard.map((entry, idx) => {
              const isMe = entry.id === profile.id;
              return (
                <div key={entry.id} className="flex items-center gap-3">
                  <span className={`w-4 text-center text-xs font-bold ${idx < 3 ? "text-primary-700" : "text-ink-500"}`}>
                    {idx + 1}
                  </span>
                  <Avatar src={entry.photo_url} name={`${entry.first_name} ${entry.last_name ?? ""}`} size={28} ring={isMe} />
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <p className={`text-sm truncate font-medium ${isMe ? "text-primary-600" : "text-ink-200"}`}>
                      {entry.first_name} {entry.last_name ?? ""}
                    </p>
                    <div className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-primary-400" fill="currentColor" />
                      <span className={`text-xs font-bold tabular-nums ${isMe ? "text-primary-700" : "text-ink-300"}`}>
                        {entry.current_streak}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-ink-500 text-center py-4">No active readers yet.</p>
        )}
      </div>
    </div>
  );
}

function celebratingCheck(profile: { last_read_date: string | null }, today: Date) {
  return profile.last_read_date === today.toISOString().split("T")[0];
}

interface ChapterGroupProps {
  book: string;
  chapters: string;
  chapterLabels: string[];
  completedLabels: Set<string>;
  onToggle: (label: string) => void;
}

function ChapterGroup({ book, chapters, chapterLabels, completedLabels, onToggle }: ChapterGroupProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-4 h-4 text-primary-400" />
        <h3 className="font-serif font-medium text-ink-100">{book}</h3>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {chapterLabels.map((label) => {
          const done = completedLabels.has(label);
          const chapterNum = label.split(" ").pop();
          return (
            <button
              key={label}
              onClick={() => onToggle(label)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all active:scale-[0.98] ${
                done
                  ? "bg-primary-400/10 border border-primary-400/30"
                  : "bg-ink-800 border border-ink-700/30"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  done ? "bg-primary-400" : "bg-ink-600"
                }`}
              >
                {done && <Check className="w-3.5 h-3.5 text-ink-900" strokeWidth={3} />}
              </div>
              <span className={`text-sm font-medium ${done ? "text-primary-700" : "text-ink-200"}`}>
                {book} {chapterNum}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
