import { CheckCircle2, ChevronRight, XCircle, Flame, BookOpen } from 'lucide-react';
import { useToday } from '../contexts/TodayContext';
import { Avatar } from './ui';
import './TodayScreen.css';

export default function TodayScreen({ onNavigate }) {
  const { 
    question, completed, loading, selected, setSelected, 
    submitted, isCorrect, showExplanation, setShowExplanation, 
    readerProfile, submitAnswer, todayDate 
  } = useToday();

  if (loading) {
    return (
      <div className="loading-container flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="error-container">
        <div className="error-box animate-fade-in">
          <h2 className="error-title font-serif">No Quiz Today</h2>
          <p className="error-message">Check back tomorrow for the next reading challenge.</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const startDate = new Date('2026-09-21');
  const daysDiff = Math.max(1, Math.floor((todayDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  return (
    <div className="today-container animate-fade-in">
      {/* Header */}
      <header className="brand-header">
        <div className="brand-header-content">
          <Avatar name="Ayat Mekane Eyesus" size={48} />
          <div>
            <h1 className="brand-title">Ayat Mekane Eyesus</h1>
            <p className="brand-subtitle">Bible Reading Challenge</p>
          </div>
        </div>
      </header>

      {/* Main Content Card */}
      <div className="main-card">
        {/* Status / Streak Banner */}
        <div className="status-banner">
          <div className="day-info">
            <span className="day-label">Day {daysDiff}</span>
            <span className="book-info">
              {question.book} {question.chapter}
            </span>
          </div>
          {readerProfile && readerProfile.current_streak > 0 && (
            <div className="streak-badge">
              <Flame className="streak-icon" fill="currentColor" />
              <span>{readerProfile.current_streak} streak</span>
            </div>
          )}
        </div>

        {/* Question Area */}
        <div className="question-area">
          <h2 className="question-text font-serif">
            {question.question_text}
          </h2>
          {question.bible_reference && (
            <p className="bible-reference">
              <BookOpen className="bible-ref-icon" />
              {question.bible_reference}
            </p>
          )}
        </div>

        {/* Options */}
        <div className="options-container">
          {['a', 'b', 'c', 'd'].map((opt) => {
            const isSelected = selected === opt;
            const isActuallyCorrect = question.correct_option === opt;
            const text = question[`option_${opt}`];

            let stateClass = 'option-default';
            if (submitted) {
              if (isActuallyCorrect) stateClass = 'option-correct';
              else if (isSelected) stateClass = 'option-incorrect';
              else stateClass = 'option-disabled';
            } else if (isSelected) {
              stateClass = 'option-selected';
            }

            return (
              <button
                key={opt}
                disabled={submitted}
                onClick={() => setSelected(opt)}
                className={`option-btn ${stateClass}`}
              >
                <div className={`option-letter ${stateClass}`}>
                  {opt.toUpperCase()}
                </div>
                <span className="option-text">{text}</span>
                {submitted && isActuallyCorrect && (
                  <CheckCircle2 className="result-icon icon-correct" />
                )}
                {submitted && isSelected && !isActuallyCorrect && (
                  <XCircle className="result-icon icon-incorrect" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="action-area">
        {!submitted ? (
          <button
            disabled={!selected}
            onClick={submitAnswer}
            className="submit-btn"
          >
            Submit Answer
          </button>
        ) : (
          <div className="post-submit-area animate-fade-in">
            <div className={`result-message ${isCorrect ? 'result-success' : 'result-error'}`}>
              {isCorrect ? (
                <>
                  <CheckCircle2 className="result-icon-lg" />
                  <p className="font-semibold">Excellent! That's correct.</p>
                </>
              ) : (
                <>
                  <XCircle className="result-icon-lg" />
                  <p className="font-semibold">Not quite right.</p>
                </>
              )}
            </div>

            {/* View Leaderboard Button */}
            <button
              onClick={() => onNavigate?.('leaderboard')}
              className="leaderboard-nav-btn"
            >
              <span>View Leaderboard</span>
              <ChevronRight className="chevron-icon" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
