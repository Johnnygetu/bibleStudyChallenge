import { Flame, BookOpen, Check, ChevronRight, Sunrise, Trophy, Lock, Brain, AlertCircle } from "lucide-react";
import { useGeneralContext } from "@/context/GeneralContext";
import { useUserContext } from "@/context/UserContext";
import { useNavigationContext } from "@/context/NavigationContext";
import { useReadingContext } from "@/context/ReadingContext";
import { useQuizContext } from "@/context/QuizContext";
import { useLeaderboardContext } from "@/context/LeaderboardContext";
import { ApiErrorMessage, ProgressBar, Avatar } from "@/components/ui";
import ayatLogo from "@/assets/ayat-logo.png";
import "./TodayScreen.css";

// Everything this screen shows — the reading, the quiz and the Top 5 — is
// fetched and derived by its contexts; the component only renders it.
export function TodayScreen() {
  const { greeting, todayDateStr } = useGeneralContext();
  const { displayName } = useUserContext();
  const { navigate } = useNavigationContext();
  const {
    apiMetadata,
    todayGroups,
    todayCompletedCount,
    todayTotal,
    allDone,
    savedToday,
    notStarted,
    daysUntilStart,
    startDateLabel,
    isLoading,
    isSaving,
    canSave,
    saveMessage,
    error: readingError,
    reload: reloadReadings,
    toggleChapter,
    saveProgress,
  } = useReadingContext();
  const {
    quizLoading,
    hasQuestions,
    questionError,
    questions,
    isSubmittingQuiz,
    quizResult,
    quizSubmitError,
    quizOver,
    allQuizAnswered,
    canSubmitQuiz,
    submitLabel,
    answerQuestion,
    submitQuiz,
    reloadQuestions,
  } = useQuizContext();
  const {
    topFive,
    loading: leaderboardLoading,
    error: leaderboardError,
    reload: reloadLeaderboard,
  } = useLeaderboardContext();

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
              <span>{apiMetadata ? apiMetadata.current_streak : "—"} Day Streak</span>
            </div>
            <p className="streak-card__hint">
              {(apiMetadata?.current_streak ?? 0) > 0
              ? "You're on fire! Keep reading daily."
              : apiMetadata ? "Read today to start your streak!" : "Streak information is unavailable."}
            </p>
          </div>
          <div className="streak-card__best">
            <span className="streak-card__best-label">Best</span>
            <p className="streak-card__best-value">
              {apiMetadata ? `${apiMetadata.best_streak} days` : "—"}
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

        {savedToday ? (
          // The save has just gone through, so the checklist is done with: the
          // progress bar and the chapter list give way to the confirmation.
          <div className="reading-card__complete">
            <span className="reading-card__complete-icon-wrap">
              <Check className="reading-card__complete-icon" />
            </span>
            <p className="reading-card__complete-text">You have completed today's reading!</p>
            <p className="reading-card__complete-hint">Come back tomorrow for the next chapters.</p>
          </div>
        ) : (
        <>
        {apiMetadata?.is_catch_up_mode && (
          <div style={{ backgroundColor: 'rgba(255, 165, 0, 0.2)', padding: '8px 12px', borderRadius: '8px', marginBottom: '12px', fontSize: '0.9rem', color: '#e67e22' }}>
            <strong>Catch-up mode:</strong> We added a few extra verses today to keep you on track!
          </div>
        )}

        <p className="reading-card__total">
          {apiMetadata
            ? `${todayTotal} chapters total (${apiMetadata.verses_assigned || 0} verses)`
            : "Today's reading is unavailable."}
        </p>

        {apiMetadata && <ProgressBar value={todayCompletedCount} max={todayTotal} showNumbers size="lg" />}

        {readingError && <ApiErrorMessage message={readingError} onRetry={reloadReadings} />}

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
              chapters={group.chapters}
              onToggle={toggleChapter}
            />
          ))}
          {apiMetadata && todayGroups.length === 0 && (
            <p className="reading-card__empty">No chapters are assigned for today.</p>
          )}
        </div>

        {/* Only offered when there is something to send — a reader who is
            already caught up has nothing to save. Kept on screen while a save
            is in flight so its "Saving..." state stays visible. */}
        {(canSave || isSaving) && (
          <button
            className="reading-card__save"
            onClick={saveProgress}
            disabled={!canSave}
          >
            {isSaving ? "Saving..." : "Save Progress"}
          </button>
        )}
        {saveMessage && (
          <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', textAlign: 'center', color: 'var(--ember-500)' }}>
            {saveMessage.text}
          </div>
        )}
        </>
        )}
      </div>

      {/* Today's Quiz Section */}
      {quizOver ? (
        <div className="card quiz-empty">
          <Check className="quiz-empty__icon quiz-empty__icon--done" />
          <p className="quiz-empty__text">You have completed today's quiz.</p>
          {/* The quiz is dropped the moment it is over, so the score the
              submission just produced is reported here instead. A visit later
              the same day has no score in hand — the server reports only
              whether the day's quiz is done — so it gets the plain line. */}
          <p className="quiz-empty__hint">
            {quizResult
              ? `You scored ${quizResult.score} of ${quizResult.answered} — saved to today's leaderboard.`
              : "Come back tomorrow for a new set of questions."}
          </p>
        </div>
      ) : (
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
          ) : readingError ? (
            <p className="quiz-card__empty">The quiz is unavailable until today's reading loads.</p>
          ) : questionError ? (
            <ApiErrorMessage message={questionError} onRetry={reloadQuestions} />
          ) : !hasQuestions || questions.length === 0 ? (
            <div className="quiz-empty">
              <AlertCircle className="quiz-empty__icon" />
              <p className="quiz-empty__text">There are no questions for today's reading chapters.</p>
              <p className="quiz-empty__hint">Questions will appear here once they are added for the chapters you're reading today.</p>
            </div>
          ) : (
            <div className="quiz-list">
              {questions.map((question, idx) => (
                <div key={question.id} className="quiz-item">
                  <p className="quiz-item__question">
                    <span className="quiz-item__number">{idx + 1}.</span>
                    {question.question_text}
                  </p>
                  {question.chapter && (
                    <p className="quiz-item__chapter">{question.chapter.book} {question.chapter.chapter_number}</p>
                  )}
                  <div className="quiz-item__options">
                    {question.answers.map((answer) => (
                      <button
                        key={answer.id}
                        disabled={isSubmittingQuiz}
                        onClick={() => answerQuestion(question.id, answer.id)}
                        className={[
                          "quiz-option",
                          answer.showCorrect && "quiz-option--correct",
                          !answer.showCorrect && answer.showWrong && "quiz-option--wrong",
                          !answer.showCorrect && !answer.showWrong && answer.isSelected && "quiz-option--selected",
                        ].filter(Boolean).join(" ")}
                      >
                        <span>{answer.answer_text}</span>
                        {answer.showCorrect && <Check className="quiz-option__check" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!quizLoading && questions.length > 0 && (
            <>
              <button
                className="quiz-card__submit"
                onClick={submitQuiz}
                disabled={!canSubmitQuiz || isSubmittingQuiz}
              >
                {submitLabel}
              </button>
              {!allQuizAnswered && (
                <p className="quiz-card__hint">Answer every question to submit.</p>
              )}
            </>
          )}
          {quizSubmitError && <p className="quiz-card__error">{quizSubmitError}</p>}
        </div>
      </div>
      )}

        </>
      )}

      {/* Top 5 Leaderboard */}
      <div className="card top5">
        <div className="top5__head">
          <div className="top5__head-left">
            <Trophy className="top5__trophy" />
            <h3 className="top5__title">Top 5 Leaderboard</h3>
          </div>
          <button onClick={() => navigate("leaderboard")} className="top5__see-all">
            See all <ChevronRight className="top5__chevron" />
          </button>
        </div>

        <div className="top5__list">
          {leaderboardLoading ? (
            <p className="top5__empty" role="status">Loading leaderboard…</p>
          ) : leaderboardError ? (
            <ApiErrorMessage message={leaderboardError} onRetry={reloadLeaderboard} />
          ) : topFive.length === 0 ? (
            <p className="top5__empty">No leaderboard entries yet.</p>
          ) : topFive.map((entry) => (
            <div key={entry.id} className="top5__row">
              <span className={`top5__rank${entry.rank <= 3 ? " top5__rank--top" : ""}`}>
                {entry.rank}
              </span>
              <Avatar src={entry.photo_url} name={entry.name} size={28} ring={entry.isMe} />
              <div className="top5__identity">
                <p className={`top5__name${entry.isMe ? " top5__name--me" : ""}`}>
                  {entry.name}
                  {entry.isMe && <span className="top5__you">(You)</span>}
                </p>
                <div className="top5__streak">
                  <Flame className="top5__streak-flame" fill="currentColor" />
                  <span className={`top5__streak-value${entry.isMe ? " top5__streak-value--me" : ""}`}>
                    {entry.current_streak}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChapterGroup({ book, chapters, onToggle }) {
  return (
    <div className="chapter-group">
      <div className="chapter-group__head">
        <BookOpen className="chapter-group__icon" />
        <h3 className="chapter-group__title">{book}</h3>
      </div>
      <div className="chapter-group__list">
        {chapters.map((chapter) => (
          <button
            key={chapter.label}
            onClick={() => onToggle(chapter.label)}
            disabled={chapter.locked || chapter.saved}
            className={`chapter-toggle${chapter.done ? " chapter-toggle--done" : ""}${chapter.locked ? " chapter-toggle--locked" : ""}${chapter.saved ? " chapter-toggle--saved" : ""}`}
          >
            <div className={`chapter-toggle__check${chapter.done ? " chapter-toggle__check--done" : ""}`}>
              {chapter.done && <Check className="chapter-toggle__check-icon" strokeWidth={3} />}
            </div>
            <span className="chapter-toggle__label">
              {book} {chapter.chapterNum}
            </span>
            {chapter.locked && <Lock className="chapter-toggle__lock" />}
          </button>
        ))}
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
