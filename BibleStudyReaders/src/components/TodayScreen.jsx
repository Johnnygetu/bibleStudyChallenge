import { useState } from "react";
import { Flame, BookOpen, Check, ChevronRight, Sunrise, Trophy, Lock, Brain } from "lucide-react";
import { useGeneralContext } from "@/context/GeneralContext";
import {
  TODAY_GROUPS,
  COMPLETED_CHAPTERS,
  QUIZ_QUESTIONS,
  LEADERBOARD,
  CURRENT_DAY,
  TOTAL_DAYS,
} from "@/lib/data";
import { hapticImpact, hapticNotification } from "@/lib/telegram";
import { ProgressBar, Avatar } from "@/components/ui";
import ayatLogo from "@/assets/ayat-logo.png";
import "./TodayScreen.css";

export function TodayScreen({ onNavigate }) {
  const { profile } = useGeneralContext();
  // Local-only state; nothing persists until integration starts.
  const [completedLabels, setCompletedLabels] = useState(() => new Set(COMPLETED_CHAPTERS));
  const [quizAnswers, setQuizAnswers] = useState({});

  const today = new Date();
  const todayGroups = TODAY_GROUPS;
  const leaderboard = LEADERBOARD.slice(0, 5);

  const allTodayChapters = todayGroups.flatMap((g) => g.chapterLabels);
  const todayCompletedCount = allTodayChapters.filter((ch) => completedLabels.has(ch)).length;
  const todayTotal = allTodayChapters.length;
  const allDone = todayTotal > 0 && todayCompletedCount === todayTotal;

  const handleToggleChapter = (chapterLabel) => {
    hapticImpact("light");
    setCompletedLabels(prev => {
      const next = new Set(prev);
      if (next.has(chapterLabel)) next.delete(chapterLabel);
      else next.add(chapterLabel);
      return next;
    });
  };

  const handleQuizAnswer = (questionId, optionKey) => {
    if (quizAnswers[questionId]) return;
    hapticImpact("medium");
    const q = QUIZ_QUESTIONS.find((item) => item.id === questionId);
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionKey }));
    hapticNotification(q && q.correct_option === optionKey ? "success" : "error");
  };

  const greeting = today.getHours() < 12 ? "Good morning" : today.getHours() < 18 ? "Good afternoon" : "Good evening";
  const todayDateStr = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

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
          {greeting}, {profile.first_name}
        </h1>
        <p className="greeting__date">{todayDateStr}</p>
      </div>

      {/* Streak Section */}
      <div className="card-primary streak-card">
        <div className="streak-card__row">
          <div>
            <div className="streak-card__label">
              <Flame className="streak-card__flame" fill="currentColor" />
              <span>{profile.current_streak} Day Streak</span>
            </div>
            <p className="streak-card__hint">
              {profile.current_streak > 0
              ? "You're on fire! Keep reading daily."
              : "Read today to start your streak!"}
            </p>
          </div>
          <div className="streak-card__best">
            <span className="streak-card__best-label">Best</span>
            <p className="streak-card__best-value">
              {Math.max(profile.current_streak, profile.longest_streak)} days
            </p>
          </div>
        </div>
      </div>

      {/* Today's Reading Section */}
      <div className="card-primary reading-card">
        <div className="reading-card__head">
          <Sunrise className="reading-card__sun" />
          <h2 className="reading-card__title">Today's Reading</h2>
          <span className="reading-card__day">Day {CURRENT_DAY} of {TOTAL_DAYS}</span>
        </div>
        <p className="reading-card__total">{todayTotal} chapters total</p>

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
      </div>

      {/* Today's Quiz Section */}
      <div className="quiz-section">
        {!allDone && (
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

          <div className="quiz-list">
            {(allDone ? QUIZ_QUESTIONS : QUIZ_QUESTIONS.slice(0, 1)).map((q, idx) => {
              const answer = quizAnswers[q.id];
              const options = [
                { key: "a", text: q.option_a },
                { key: "b", text: q.option_b },
                { key: "c", text: q.option_c },
                { key: "d", text: q.option_d },
              ];
              return (
                <div key={q.id} className="quiz-item">
                  <p className="quiz-item__question">
                    <span className="quiz-item__number">{idx + 1}.</span>
                    {q.question_text}
                  </p>
                  <div className="quiz-item__options">
                    {options.map(({ key, text }) => {
                      const isSelected = answer === key;
                      const isCorrectOpt = q.correct_option === key;
                      const showCorrect = answer && isCorrectOpt;
                      const showWrong = answer && isSelected && !isCorrectOpt;

                      let optionClass = "quiz-option";
                      if (showCorrect) optionClass += " quiz-option--correct";
                      else if (showWrong) optionClass += " quiz-option--wrong";
                      else if (isSelected) optionClass += " quiz-option--selected";

                      return (
                        <button
                          key={key}
                          disabled={!!answer}
                          onClick={() => handleQuizAnswer(q.id, key)}
                          className={optionClass}
                        >
                          <span>{text}</span>
                          {showCorrect && <Check className="quiz-option__check" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

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
          {leaderboard.map((entry, idx) => {
            const isMe = entry.id === profile.id;
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
