import { useState, useEffect } from "react";
import { Flame, BookOpen, Check, ChevronRight, Sunrise, Trophy, Lock, Brain, AlertCircle } from "lucide-react";
import { useGeneralContext } from "@/context/GeneralContext";
import { useUserContext } from "@/context/UserContext";
import {
  TODAY_GROUPS,
  COMPLETED_CHAPTERS,
} from "@/lib/data";
import { useLeaderboardContext } from "@/context/LeaderboardContext";
import { hapticImpact, hapticNotification } from "@/lib/telegram";
import { ProgressBar, Avatar } from "@/components/ui";
import ayatLogo from "@/assets/ayat-logo.png";
import "./TodayScreen.css";

export function TodayScreen({ onNavigate }) {
  const { profile, apiUrl } = useGeneralContext();
  // The registered name lives in localStorage (saved by the registration modal).
  const { user } = useUserContext();
  // Local-only state; nothing persists until integration starts.
  const [completedLabels, setCompletedLabels] = useState(() => new Set());
  const [quizAnswers, setQuizAnswers] = useState({});

  const [todayGroups, setTodayGroups] = useState([]);
  const [apiMetadata, setApiMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Quiz submission: posts the day's answers and stores the score on the server.
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [quizSubmitError, setQuizSubmitError] = useState(null);

  // Quiz questions fetched from the API for today's chapters
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [hasQuestions, setHasQuestions] = useState(true);
  const [saveMessage, setSaveMessage] = useState(null);

  // Live leaderboard from the backend (Top 5 of the personal board).
  const {
    entries: leaderboardEntries,
    loading: leaderboardLoading,
    error: leaderboardError,
    reload: reloadLeaderboard,
  } = useLeaderboardContext();
  const top5 = leaderboardEntries.slice(0, 5);
  const myId = user?.id != null ? Number(user.id) : null;

  const today = new Date();

  useEffect(() => {
    // If the local storage has a user but is missing the ID (from before we updated the code)
    // clear it and force a reload to show the registration screen.
    if (user && !user.id) {
      localStorage.removeItem("bible_challenge_user_details");
      window.location.reload();
      return;
    }

    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    
    async function fetchReadings() {
      try {
        const res = await fetch(`${apiUrl}/readers/${user.id}/plans/1/daily-readings`);
        
        // If the database was cleared, the backend will return 404 (Not Found).
        // We should clear the local storage and force a reload to show the registration screen.
        if (res.status === 404) {
          localStorage.removeItem("bible_challenge_user_details");
          window.location.reload();
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setApiMetadata(data);

          // The plan's start date hasn't arrived yet — show an "X days left"
          // countdown instead of the readings, questions and streak details.
          if ((data.days_until_start ?? 0) > 0) {
            setTodayGroups([]);
            setCompletedLabels(new Set());
            setHasQuestions(false);
            return;
          }
          
          // Group the readings by book for the UI
          const grouped = {};
          const completed = new Set();
          
          data.readings.forEach(reading => {
            const label = `${reading.book} ${reading.chapter_number}`;
            if (!grouped[reading.book]) {
              grouped[reading.book] = {
                id: reading.book.toLowerCase().replace(/\s+/g, '-'),
                book: reading.book,
                chapterLabels: []
              };
            }
            grouped[reading.book].chapterLabels.push(label);
            
            if (reading.is_completed) {
              completed.add(label);
            }
          });
          
          setTodayGroups(Object.values(grouped));
          setCompletedLabels(completed);

          // --- Fetch questions for today's chapter IDs ---
          const chapterIds = data.readings.map(r => r.chapter_id);
          if (chapterIds.length > 0) {
            fetchQuestions(chapterIds);
          } else {
            setHasQuestions(false);
          }
        }
      } catch (err) {
        console.error("Failed to fetch daily readings", err);
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchQuestions(chapterIds) {
      setQuizLoading(true);
      try {
        const ids = chapterIds.join(',');
        const res = await fetch(`${apiUrl}/questions/by-chapters?chapter_ids=${ids}`);
        if (res.ok) {
          const payload = await res.json();
          setQuizQuestions(payload.questions || []);
          setHasQuestions(payload.has_questions ?? false);
        } else {
          setHasQuestions(false);
        }
      } catch (err) {
        console.error("Failed to fetch quiz questions", err);
        setHasQuestions(false);
      } finally {
        setQuizLoading(false);
      }
    }
    
    fetchReadings();
  }, [user, apiUrl]);

  // Countdown view: while the plan's start date is in the future we show an
  // "X days left" card instead of the reading plan, quiz and streak sections.
  const daysUntilStart = apiMetadata?.days_until_start ?? 0;
  const notStarted = daysUntilStart > 0;
  const startDateLabel = apiMetadata?.starting_day
    ? new Date(`${apiMetadata.starting_day}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  const allTodayChapters = todayGroups.flatMap((g) => g.chapterLabels);
  const todayCompletedCount = allTodayChapters.filter((ch) => completedLabels.has(ch)).length;
  const todayTotal = allTodayChapters.length;
  const allDone = todayTotal > 0 && todayCompletedCount === todayTotal;

  // Only the unlocked questions can be answered and submitted; finishing the
  // reading unlocks the rest, which makes the button available once more.
  const visibleQuizQuestions = allDone ? quizQuestions : quizQuestions.slice(0, 1);
  const allQuizAnswered =
    visibleQuizQuestions.length > 0 &&
    visibleQuizQuestions.every((q) => quizAnswers[q.id]);
  const canSubmitQuiz =
    allQuizAnswered &&
    (!quizResult || quizResult.answered < visibleQuizQuestions.length);

  const handleToggleChapter = (chapterLabel) => {
    hapticImpact("light");
    setCompletedLabels(prev => {
      const next = new Set(prev);
      if (next.has(chapterLabel)) next.delete(chapterLabel);
      else next.add(chapterLabel);
      return next;
    });
  };

  const handleQuizAnswer = (questionId, answerId) => {
    if (quizAnswers[questionId]) return;
    hapticImpact("medium");
    const q = quizQuestions.find((item) => item.id === questionId);
    const selectedAnswer = q?.answers?.find(a => a.id === answerId);
    setQuizAnswers(prev => ({ ...prev, [questionId]: answerId }));
    hapticNotification(selectedAnswer?.correct_answer ? "success" : "error");
  };

  // Post today's answers; the server computes the score and stores one row
  // per reading day, then the Top 5 card refreshes with the new total.
  const handleQuizSubmit = async () => {
    if (!user?.id || isSubmittingQuiz || !canSubmitQuiz) return;

    const payload = visibleQuizQuestions.map((q) => ({
      question_id: q.id,
      answer_id: quizAnswers[q.id],
    }));

    setIsSubmittingQuiz(true);
    setQuizSubmitError(null);
    try {
      hapticImpact("medium");
      const res = await fetch(`${apiUrl}/readers/${user.id}/scores`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ answers: payload }),
      });
      if (!res.ok) throw new Error(`The server responded with ${res.status}.`);

      const data = await res.json();
      hapticNotification("success");
      setQuizResult({ score: data.score, answered: data.answered });
      reloadLeaderboard();
    } catch (err) {
      console.error("Failed to submit quiz", err);
      hapticNotification("error");
      setQuizSubmitError("Could not submit your quiz. Check your connection and try again.");
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  const handleSaveProgress = async () => {
    if (completedLabels.size === 0 || !apiMetadata) return;

    setIsSaving(true);
    
    // Find the highest order_id among the checked chapters
    const checkedChapters = apiMetadata.readings.filter(r => 
      completedLabels.has(`${r.book} ${r.chapter_number}`)
    );
    
    if (checkedChapters.length === 0) {
      setIsSaving(false);
      return;
    }

    const lastChapter = checkedChapters.reduce((prev, current) => 
      (prev.order_id > current.order_id) ? prev : current
    );

    try {
      hapticImpact("medium");
      const res = await fetch(`${apiUrl}/readers/${user.id}/plans/1/save-progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapter_id: lastChapter.chapter_id })
      });
      if (res.ok) {
        hapticNotification("success");
        setSaveMessage({ type: "success", text: "Progress saved successfully!" });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        hapticNotification("error");
        setSaveMessage({ type: "error", text: "Failed to save progress." });
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch (err) {
      console.error("Failed to save progress", err);
      hapticNotification("error");
      setSaveMessage({ type: "error", text: "Network error while saving." });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = user?.fullName?.trim() || profile.first_name;
  const greeting = today.getHours() < 12 ? "Good morning" : today.getHours() < 18 ? "Good afternoon" : "Good evening";
  const todayDateStr = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  if (isLoading) {
    return <TodayScreenSkeleton />;
  }

  return (
    <div className="screen">
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

      {/* Greeting Header */}
      <div>
        <h1 className="greeting__title">
          {greeting}, {displayName}
        </h1>
        <p className="greeting__date">{todayDateStr}</p>
      </div>

      {notStarted ? (
        <div className="card-primary countdown-card">
          <div className="countdown-card__icon-wrap">
            <Sunrise className="countdown-card__icon" />
          </div>
          <p className="countdown-card__days">
            {daysUntilStart} {daysUntilStart === 1 ? "day" : "days"} left
          </p>
          <p className="countdown-card__title">The challenge hasn't started yet</p>
          <p className="countdown-card__hint">
            Your reading plan, questions and streak will appear here on {startDateLabel}.
          </p>
        </div>
      ) : (
        <>
      {/* Streak Section */}
      <div className="card-primary streak-card">
        <div className="streak-card__row">
          <div>
            <div className="streak-card__label">
              <Flame className="streak-card__flame" fill="currentColor" />
              <span>{apiMetadata?.current_streak ?? 0} Day Streak</span>
            </div>
            <p className="streak-card__hint">
              {(apiMetadata?.current_streak ?? 0) > 0
              ? "You're on fire! Keep reading daily."
              : "Read today to start your streak!"}
            </p>
          </div>
          <div className="streak-card__best">
            <span className="streak-card__best-label">Best</span>
            <p className="streak-card__best-value">
              {apiMetadata?.best_streak ?? 0} days
            </p>
          </div>
        </div>
      </div>

      {/* Today's Reading Section */}
      <div className="card-primary reading-card">
        <div className="reading-card__head">
          <Sunrise className="reading-card__sun" />
          <h2 className="reading-card__title">Today's Reading</h2>
          <span className="reading-card__day">Day {apiMetadata?.current_day ?? '–'} of {apiMetadata?.total_days ?? '–'}</span>
        </div>

        {apiMetadata?.is_catch_up_mode && (
          <div style={{ backgroundColor: 'rgba(255, 165, 0, 0.2)', padding: '8px 12px', borderRadius: '8px', marginBottom: '12px', fontSize: '0.9rem', color: '#e67e22' }}>
            <strong>Catch-up mode:</strong> We added a few extra verses today to keep you on track!
          </div>
        )}

        <p className="reading-card__total">
          {todayTotal} chapters total ({apiMetadata?.verses_assigned || 0} verses)
        </p>

        <ProgressBar value={todayCompletedCount} max={todayTotal} showNumbers size="lg" />

        {allDone && (
          <p className="reading-card__done">
            <Check className="reading-card__done-check" /> All caught up for today. See you tomorrow!
          </p>
        )}

        {/* Chapter List */}
        <div className="chapter-groups">
          {todayGroups.map((group) => (
            <ChapterGroup
              key={group.id}
              book={group.book}
              chapterLabels={group.chapterLabels}
              completedLabels={completedLabels}
              onToggle={handleToggleChapter}
            />
          ))}
        </div>
        
        <button 
          className="reading-card__save" 
          onClick={handleSaveProgress}
          disabled={completedLabels.size === 0 || isSaving}
        >
          {isSaving ? "Saving..." : "Save Progress"}
        </button>
        {saveMessage && (
          <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', textAlign: 'center', color: saveMessage.type === 'success' ? 'var(--success-500)' : 'var(--ember-500)' }}>
            {saveMessage.text}
          </div>
        )}
      </div>

      {/* Today's Quiz Section */}
      <div className="quiz-section">
        {!allDone && hasQuestions && (
          <div className="quiz-lock">
            <Lock className="quiz-lock__icon" />
            <p className="quiz-lock__text">Complete today's reading to unlock</p>
          </div>
        )}
        <div className="card quiz-card">
          <div className="quiz-card__head">
            <Brain className="quiz-card__brain" />
            <h2 className="quiz-card__title">Today's Quiz</h2>
          </div>

          {quizLoading ? (
            <div className="quiz-list">
              <div className="skeleton" style={{ height: '1.2rem', width: '80%', marginBottom: '0.75rem' }} />
              <div className="skeleton" style={{ height: '3rem', width: '100%', borderRadius: '0.75rem', marginBottom: '0.5rem' }} />
              <div className="skeleton" style={{ height: '3rem', width: '100%', borderRadius: '0.75rem' }} />
            </div>
          ) : !hasQuestions || quizQuestions.length === 0 ? (
            <div className="quiz-empty">
              <AlertCircle className="quiz-empty__icon" />
              <p className="quiz-empty__text">There are no questions for today's reading chapters.</p>
              <p className="quiz-empty__hint">Questions will appear here once they are added for the chapters you're reading today.</p>
            </div>
          ) : (
            <div className="quiz-list">
              {(allDone ? quizQuestions : quizQuestions.slice(0, 1)).map((q, idx) => {
                const selectedAnswerId = quizAnswers[q.id];
                return (
                  <div key={q.id} className="quiz-item">
                    <p className="quiz-item__question">
                      <span className="quiz-item__number">{idx + 1}.</span>
                      {q.question_text}
                    </p>
                    {q.chapter && (
                      <p className="quiz-item__chapter">{q.chapter.book} {q.chapter.chapter_number}</p>
                    )}
                    <div className="quiz-item__options">
                      {(q.answers || []).map((ans) => {
                        const isSelected = selectedAnswerId === ans.id;
                        const isCorrectOpt = ans.correct_answer;
                        const showCorrect = selectedAnswerId && isCorrectOpt;
                        const showWrong = selectedAnswerId && isSelected && !isCorrectOpt;

                        let optionClass = "quiz-option";
                        if (showCorrect) optionClass += " quiz-option--correct";
                        else if (showWrong) optionClass += " quiz-option--wrong";
                        else if (isSelected) optionClass += " quiz-option--selected";

                        return (
                          <button
                            key={ans.id}
                            disabled={!!selectedAnswerId}
                            onClick={() => handleQuizAnswer(q.id, ans.id)}
                            className={optionClass}
                          >
                            <span>{ans.answer_text}</span>
                            {showCorrect && <Check className="quiz-option__check" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!quizLoading && quizQuestions.length > 0 && (
            <>
              <button
                className="quiz-card__submit"
                onClick={handleQuizSubmit}
                disabled={!canSubmitQuiz || isSubmittingQuiz}
              >
                {isSubmittingQuiz
                  ? "Submitting..."
                  : quizResult && !canSubmitQuiz
                    ? "Submitted"
                    : "Submit quiz"}
              </button>
              {quizResult && !canSubmitQuiz ? (
                <p className="quiz-card__result">
                  You scored {quizResult.score} of {quizResult.answered} — saved to today's
                  leaderboard.
                </p>
              ) : !allQuizAnswered ? (
                <p className="quiz-card__hint">Answer every question to submit.</p>
              ) : null}
            </>
          )}
          {quizSubmitError && <p className="quiz-card__error">{quizSubmitError}</p>}
        </div>
      </div>

        </>
      )}

      {/* Top 5 Leaderboard */}
      <div className="card top5">
        <div className="top5__head">
          <div className="top5__head-left">
            <Trophy className="top5__trophy" />
            <h3 className="top5__title">Top 5 Leaderboard</h3>
          </div>
          {onNavigate && (
            <button onClick={() => onNavigate("leaderboard")} className="top5__see-all">
              See all <ChevronRight className="top5__chevron" />
            </button>
          )}
        </div>

        <div className="top5__list">
          {leaderboardLoading ? (
            <div className="top5__empty">Loading leaderboard…</div>
          ) : top5.length === 0 ? (
            <div className="top5__empty">
              {leaderboardError ?? "No readers to show yet."}
            </div>
          ) : top5.map((entry, idx) => {
            const isMe = myId !== null && Number(entry.id) === myId;
            return (
              <div key={entry.id} className="top5__row">
                <span className={`top5__rank${idx < 3 ? " top5__rank--top" : ""}`}>
                  {idx + 1}
                </span>
                <Avatar src={entry.photo_url} name={`${entry.first_name} ${entry.last_name ?? ""}`} size={28} ring={isMe} />
                <div className="top5__identity">
                  <p className={`top5__name${isMe ? " top5__name--me" : ""}`}>
                    {entry.first_name} {entry.last_name ?? ""}
                  </p>
                  <div className="top5__streak">
                    <Flame className="top5__streak-flame" fill="currentColor" />
                    <span className={`top5__streak-value${isMe ? " top5__streak-value--me" : ""}`}>
                      {entry.current_streak}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ChapterGroup({ book, chapterLabels, completedLabels, onToggle }) {
  return (
    <div className="chapter-group">
      <div className="chapter-group__head">
        <BookOpen className="chapter-group__icon" />
        <h3 className="chapter-group__title">{book}</h3>
      </div>
      <div className="chapter-group__list">
        {chapterLabels.map((label) => {
          const done = completedLabels.has(label);
          const chapterNum = label.split(" ").pop();
          return (
            <button
              key={label}
              onClick={() => onToggle(label)}
              className={`chapter-toggle${done ? " chapter-toggle--done" : ""}`}
            >
              <div className={`chapter-toggle__check${done ? " chapter-toggle__check--done" : ""}`}>
                {done && <Check className="chapter-toggle__check-icon" strokeWidth={3} />}
              </div>
              <span className="chapter-toggle__label">
                {book} {chapterNum}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TodayScreenSkeleton() {
  return (
    <div className="screen">
      {/* Brand Header Skeleton */}
      <div className="brand">
        <div className="brand__row">
          <div className="skeleton skeleton-logo"></div>
          <div>
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-subtitle"></div>
          </div>
        </div>
      </div>

      {/* Greeting Skeleton */}
      <div>
        <div className="skeleton skeleton-greeting"></div>
        <div className="skeleton skeleton-date"></div>
      </div>

      {/* Streak Skeleton */}
      <div className="card-primary streak-card">
        <div className="skeleton skeleton-streak-row"></div>
      </div>

      {/* Reading Skeleton */}
      <div className="card-primary reading-card">
        <div className="skeleton skeleton-reading-head"></div>
        <div className="skeleton skeleton-reading-total"></div>
        <div className="skeleton skeleton-progress"></div>
        
        <div className="chapter-groups" style={{ marginTop: '1.25rem' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="chapter-group">
              <div className="skeleton skeleton-chapter-head"></div>
              <div className="skeleton skeleton-chapter-toggle"></div>
              {i === 1 && <div className="skeleton skeleton-chapter-toggle" style={{ marginTop: '0.5rem' }}></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
