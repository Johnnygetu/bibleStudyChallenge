import { useState } from 'react';
import { Plus, X, HelpCircle, ChevronDown, ChevronRight, Trash2, BookOpen, Check, AlertCircle } from 'lucide-react';
import { useQuizzes } from '../contexts/QuizzesContext';
import './Quizzes.css';

export default function Quizzes() {
  const { questions, loading, grouped, deleteQuestion, load, BIBLE_BOOKS } = useQuizzes();
  const [showForm, setShowForm] = useState(false);
  const [expandedBook, setExpandedBook] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);

  if (loading) {
    return (
      <div className="quizzes-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="quizzes-container">
      <div className="quizzes-header">
        <div>
          <h2 className="quizzes-title">Quiz Questions</h2>
          <p className="quizzes-subtitle">{questions.length} questions across {grouped.size} books</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary add-btn"
        >
          <Plus className="add-icon" strokeWidth={2.5} />
          Add
        </button>
      </div>

      {/* Questions grouped by book and chapter */}
      {grouped.size === 0 ? (
        <div className="quizzes-empty">
          <div className="empty-icon-wrapper">
            <HelpCircle className="empty-icon-lg" />
          </div>
          <p className="empty-title">No quiz questions yet</p>
          <p className="empty-subtitle">Tap Add to create your first question</p>
        </div>
      ) : (
        <div className="quizzes-list">
          {Array.from(grouped.entries())
            .sort((a, b) => {
              const indexA = Object.keys(BIBLE_BOOKS).indexOf(a[0]);
              const indexB = Object.keys(BIBLE_BOOKS).indexOf(b[0]);
              if (indexA === -1 && indexB === -1) return a[0].localeCompare(b[0]);
              if (indexA === -1) return 1;
              if (indexB === -1) return -1;
              return indexA - indexB;
            })
            .map(([book, chaptersMap]) => {
              const isBookExpanded = expandedBook === book;
              let totalQuestions = 0;
              chaptersMap.forEach((qs) => totalQuestions += qs.length);
              
              return (
                <div key={book} className="book-card">
                  <button
                    onClick={() => setExpandedBook(isBookExpanded ? null : book)}
                    className="book-btn"
                  >
                    <div className="book-icon-wrapper">
                      <BookOpen className="book-icon" />
                    </div>
                    <div className="book-info">
                      <p className="book-title">{book}</p>
                      <p className="book-stats">
                        {chaptersMap.size} chapter{chaptersMap.size !== 1 ? 's' : ''} · {totalQuestions} question{totalQuestions !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {isBookExpanded ? (
                      <ChevronDown className="chevron-icon" />
                    ) : (
                      <ChevronRight className="chevron-icon" />
                    )}
                  </button>

                  {isBookExpanded && (
                    <div className="book-content">
                      {Array.from(chaptersMap.entries())
                        .sort((a, b) => a[0] - b[0])
                        .map(([chapter, qs]) => {
                          const isChapterExpanded = expandedChapter?.book === book && expandedChapter?.chapter === chapter;
                          
                          return (
                            <div key={chapter} className="chapter-item">
                              <button
                                onClick={() => setExpandedChapter(isChapterExpanded ? null : { book, chapter })}
                                className="chapter-btn"
                              >
                                <div className="chapter-info">
                                  <span className="chapter-title">Chapter {chapter}</span>
                                  <span className="chapter-stats">({qs.length})</span>
                                </div>
                                {isChapterExpanded ? (
                                  <ChevronDown className="chevron-icon-sm" />
                                ) : (
                                  <ChevronRight className="chevron-icon-sm" />
                                )}
                              </button>
                              
                              {isChapterExpanded && (
                                <div className="chapter-content">
                                  {qs.length === 0 ? (
                                    <div className="chapter-empty">
                                      <p className="chapter-empty-title">No questions yet</p>
                                      <p className="chapter-empty-subtitle">Click Add to create the first question for this chapter</p>
                                    </div>
                                  ) : qs.map((q) => (
                                    <div key={q.id} className="question-card">
                                      <div className="question-header">
                                        <p className="question-text">{q.question_text}</p>
                                        <button
                                          onClick={() => deleteQuestion(q.id)}
                                          className="delete-btn"
                                        >
                                          <Trash2 className="delete-icon" />
                                        </button>
                                      </div>
                                      <div className="options-list">
                                        {['a', 'b', 'c', 'd'].map((opt) => {
                                          const text = q[`option_${opt}`];
                                          const isCorrect = q.correct_option === opt;
                                          return (
                                            <div
                                              key={opt}
                                              className={`option-item ${isCorrect ? 'is-correct' : 'is-default'}`}
                                            >
                                              <span className={`option-letter ${isCorrect ? 'letter-correct' : 'letter-default'}`}>
                                                {opt.toUpperCase()}
                                              </span>
                                              <span className="option-text">{text}</span>
                                              {isCorrect && <Check className="correct-icon" />}
                                            </div>
                                          );
                                        })}
                                      </div>
                                      {q.bible_reference && (
                                        <div className="bible-ref">
                                          <BookOpen className="ref-icon" />
                                          {q.bible_reference}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {showForm && <QuestionForm onClose={() => setShowForm(false)} onSaved={load} BIBLE_BOOKS={BIBLE_BOOKS} />}
    </div>
  );
}

function QuestionForm({ onClose, onSaved, BIBLE_BOOKS }) {
  const [book, setBook] = useState('Genesis');
  const [chapter, setChapter] = useState(1);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState({ a: '', b: '', c: '', d: '' });
  const [correct, setCorrect] = useState('a');
  const [reference, setReference] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function save() {
    if (!book.trim() || !question.trim() || !options.a.trim() || !options.b.trim() || !options.c.trim() || !options.d.trim()) {
      setError('Please fill in the book, question, and all four options.');
      return;
    }
    setSaving(true);
    
    try {
      const stored = localStorage.getItem('dummy_quizzes');
      const currentQuestions = stored ? JSON.parse(stored) : [];
      
      const newQuestion = {
        id: crypto.randomUUID(),
        book: book.trim(),
        chapter: chapter,
        week_number: 1,
        question_text: question.trim(),
        option_a: options.a.trim(),
        option_b: options.b.trim(),
        option_c: options.c.trim(),
        option_d: options.d.trim(),
        correct_option: correct,
        bible_reference: reference.trim() || null,
        created_at: new Date().toISOString(),
      };
      
      currentQuestions.push(newQuestion);
      localStorage.setItem('dummy_quizzes', JSON.stringify(currentQuestions));
      
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to save locally.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">New Quiz Question</h3>
          <button onClick={onClose} className="close-btn">
            <X className="close-icon" />
          </button>
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle className="error-icon" />
            {error}
          </div>
        )}

        <div className="form-body">
          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Book *</label>
              <select
                value={book}
                onChange={(e) => {
                  setBook(e.target.value);
                  setChapter(1);
                }}
                className="form-input"
              >
                {Object.keys(BIBLE_BOOKS).map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div className="form-group w-32">
              <label className="form-label">Chapter *</label>
              <select
                value={chapter}
                onChange={(e) => setChapter(Number(e.target.value))}
                className="form-input"
              >
                {Array.from({ length: BIBLE_BOOKS[book] || 1 }, (_, i) => i + 1).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Question *</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What did God create on the first day?"
              rows={2}
              className="form-input resize-none"
            />
          </div>

          <div className="form-group">
            <label className="form-label mb-2">Answer Options * (tap circle to mark correct)</label>
            <div className="options-form-list">
              {['a', 'b', 'c', 'd'].map((opt) => (
                <div key={opt} className="option-input-row">
                  <button
                    type="button"
                    onClick={() => setCorrect(opt)}
                    className={`option-radio ${
                      correct === opt
                        ? 'radio-selected'
                        : 'radio-unselected'
                    }`}
                  >
                    {correct === opt && <Check className="check-icon-sm" />}
                    {correct !== opt && opt.toUpperCase()}
                  </button>
                  <input
                    type="text"
                    value={options[opt]}
                    onChange={(e) => setOptions({ ...options, [opt]: e.target.value })}
                    placeholder={`Option ${opt.toUpperCase()}`}
                    className="form-input flex-1"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Bible Reference (optional)</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. Genesis 1:3-5"
              className="form-input"
            />
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="btn-primary modal-submit"
        >
          {saving ? 'Saving...' : 'Add Question'}
        </button>
      </div>
    </div>
  );
}
