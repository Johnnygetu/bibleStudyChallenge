import { useEffect, useState, useCallback } from 'react';
import { Plus, X, Edit2, HelpCircle, ChevronDown, ChevronRight, Trash2, BookOpen, Check, AlertCircle } from 'lucide-react';
import { ErrorState } from '@/components/ui';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const BIBLE_BOOKS = {
  "Genesis": 50, "Exodus": 40, "Leviticus": 27, "Numbers": 36, "Deuteronomy": 34,
  "Joshua": 24, "Judges": 21, "Ruth": 4, "1 Samuel": 31, "2 Samuel": 24,
  "1 Kings": 22, "2 Kings": 25, "1 Chronicles": 29, "2 Chronicles": 36, "Ezra": 10,
  "Nehemiah": 13, "Esther": 10, "Job": 42, "Psalms": 150, "Proverbs": 31,
  "Ecclesiastes": 12, "Song of Solomon": 8, "Isaiah": 66, "Jeremiah": 52,
  "Lamentations": 5, "Ezekiel": 48, "Daniel": 12, "Hosea": 14, "Joel": 3,
  "Amos": 9, "Obadiah": 1, "Jonah": 4, "Micah": 7, "Nahum": 3, "Habakkuk": 3,
  "Zephaniah": 3, "Haggai": 2, "Zechariah": 14, "Malachi": 4, "Matthew": 28,
  "Mark": 16, "Luke": 24, "John": 21, "Acts": 28, "Romans": 16,
  "1 Corinthians": 16, "2 Corinthians": 13, "Galatians": 6, "Ephesians": 6,
  "Philippians": 4, "Colossians": 4, "1 Thessalonians": 5, "2 Thessalonians": 3,
  "1 Timothy": 6, "2 Timothy": 4, "Titus": 3, "Philemon": 1, "Hebrews": 13,
  "James": 5, "1 Peter": 5, "2 Peter": 3, "1 John": 5, "2 John": 1,
  "3 John": 1, "Jude": 1, "Revelation": 22
};

const LETTERS = ['a', 'b', 'c', 'd'];

// The API nests the chapter and answers; flatten them into the shape the
// book/chapter grouping and option rendering below already expect.
function toQuestion(row) {
  const answers = Array.isArray(row.answers) ? row.answers : [];
  const correctIndex = answers.findIndex((a) => a.correct_answer);

  const mapped = {
    id: row.id,
    book: row.chapter?.book || 'Unknown Book',
    chapter: row.chapter?.chapter_number || 1,
    question_text: row.question_text,
    bible_reference: row.bible_reference || null,
    created_at: row.created_at,
    correct_option: correctIndex >= 0 ? LETTERS[correctIndex] : null,
  };

  LETTERS.forEach((letter, index) => {
    mapped[`option_${letter}`] = answers[index]?.answer_text || '';
  });

  return mapped;
}

export default function Quizzes() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedBook, setExpandedBook] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/questions`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`The server responded with ${response.status}.`);
      }
      const rows = await response.json();
      const mapped = (Array.isArray(rows) ? rows : []).map(toQuestion);
      // Sort descending by created_at
      mapped.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setQuestions(mapped);
    } catch (err) {
      console.error('Failed to load questions:', err);
      setError('We could not reach the server. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const grouped = new Map();

  // Initialize grouped with all books and chapters
  Object.entries(BIBLE_BOOKS).forEach(([book, totalChapters]) => {
    const chaptersMap = new Map();
    for (let i = 1; i <= totalChapters; i++) {
      chaptersMap.set(i, []);
    }
    grouped.set(book, chaptersMap);
  });

  questions.forEach((q) => {
    const book = q.book || 'Unknown Book';
    const chapter = q.chapter || 1;

    if (!grouped.has(book)) {
      grouped.set(book, new Map());
    }
    const bookMap = grouped.get(book);

    if (!bookMap.has(chapter)) {
      bookMap.set(chapter, []);
    }
    bookMap.get(chapter).push(q);
  });

  async function deleteQuestion(id) {
    try {
      const response = await fetch(`${API_URL}/questions/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`The server responded with ${response.status}.`);
      }
      load();
    } catch (err) {
      console.error('Failed to delete question:', err);
    }
  }

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page stack fade-in">
      <div className="page-head">
        <div>
          <h2 className="page-title serif">Quiz Questions</h2>
          <p className="page-sub">{questions.length} questions across {grouped.size} books</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary btn-compact"
        >
          <Plus className="icon-16" strokeWidth={2.5} />
          Add
        </button>
      </div>

      {/* Questions grouped by book and chapter */}
      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : grouped.size === 0 ? (
        <div className="empty-block">
          <div className="empty-circle">
            <HelpCircle className="icon-32 empty-glyph" />
          </div>
          <p className="empty-title">No quiz questions yet</p>
          <p className="empty-sub">Tap Add to create your first question</p>
        </div>
      ) : (
        <div className="list-tight">
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
                <div key={book} className="card overflow-hidden">
                  <button
                    onClick={() => setExpandedBook(isBookExpanded ? null : book)}
                    className="book-btn"
                  >
                    <div className="book-icon">
                      <BookOpen className="icon-20 book-glyph" />
                    </div>
                    <div className="book-main">
                      <p className="book-name">{book}</p>
                      <p className="book-meta">
                        {chaptersMap.size} chapter{chaptersMap.size !== 1 ? 's' : ''} · {totalQuestions} question{totalQuestions !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {isBookExpanded ? (
                      <ChevronDown className="icon-16 book-chevron" />
                    ) : (
                      <ChevronRight className="icon-16 book-chevron" />
                    )}
                  </button>

                  {isBookExpanded && (
                    <div className="chapter-list">
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
                                <div className="chapter-summary">
                                  <span className="chapter-name">Chapter {chapter}</span>
                                  <span className="chapter-count">({qs.length})</span>
                                </div>
                                {isChapterExpanded ? (
                                  <ChevronDown className="icon-14 book-chevron" />
                                ) : (
                                  <ChevronRight className="icon-14 book-chevron" />
                                )}
                              </button>

                              {isChapterExpanded && (
                                <div className="chapter-body">
                                  {qs.length === 0 ? (
                                    <div className="q-empty">
                                      <p className="q-empty-title">No questions yet</p>
                                      <p className="q-empty-sub">Click Add to create the first question for this chapter</p>
                                    </div>
                                  ) : qs.map((q) => (
                                    <div key={q.id} className="q-card">
                                      <div className="q-head">
                                        <p className="q-text">{q.question_text}</p>
                                        <div className="q-actions">
                                          <button
                                            onClick={() => setEditing(q)}
                                            className="q-del q-edit"
                                            aria-label="Edit question"
                                          >
                                            <Edit2 className="icon-14" />
                                          </button>
                                          <button
                                            onClick={() => deleteQuestion(q.id)}
                                            className="q-del"
                                            aria-label="Delete question"
                                          >
                                            <Trash2 className="icon-14" />
                                          </button>
                                        </div>
                                      </div>
                                      <div className="q-options">
                                        {['a', 'b', 'c', 'd'].map((opt) => {
                                          const text = q[`option_${opt}`];
                                          const isCorrect = q.correct_option === opt;
                                          return (
                                            <div
                                              key={opt}
                                              className={isCorrect ? 'q-opt correct' : 'q-opt'}
                                            >
                                              <span className={isCorrect ? 'q-badge on' : 'q-badge'}>
                                                {opt.toUpperCase()}
                                              </span>
                                              <span className="q-opt-text">{text}</span>
                                              {isCorrect && <Check className="icon-14 q-opt-check" />}
                                            </div>
                                          );
                                        })}
                                      </div>
                                      {q.bible_reference && (
                                        <div className="q-ref">
                                          <BookOpen className="icon-12" />
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

      {showForm && <QuestionForm onClose={() => setShowForm(false)} onSaved={load} />}
      {editing && <QuestionForm question={editing} onClose={() => setEditing(null)} onSaved={load} />}
    </div>
  );
}

function QuestionForm({ question, onClose, onSaved }) {
  const isEdit = Boolean(question);
  const [book, setBook] = useState(question?.book || 'Genesis');
  const [chapter, setChapter] = useState(question?.chapter || 1);
  const [questionText, setQuestionText] = useState(question?.question_text || '');
  const [options, setOptions] = useState({
    a: question?.option_a || '',
    b: question?.option_b || '',
    c: question?.option_c || '',
    d: question?.option_d || '',
  });
  const [correct, setCorrect] = useState(question?.correct_option || 'a');
  const [reference, setReference] = useState(question?.bible_reference || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function save() {
    if (!book.trim() || !questionText.trim() || !options.a.trim() || !options.b.trim() || !options.c.trim() || !options.d.trim()) {
      setError('Please fill in the book, question, and all four options.');
      return;
    }
    setSaving(true);
    setError('');

    try {
      const response = await fetch(isEdit ? `${API_URL}/questions/${question.id}` : `${API_URL}/questions`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          book: book.trim(),
          chapter: chapter,
          question_text: questionText.trim(),
          options: {
            a: options.a.trim(),
            b: options.b.trim(),
            c: options.c.trim(),
            d: options.d.trim(),
          },
          correct_option: correct,
          bible_reference: reference.trim() || null,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message || `The server responded with ${response.status}.`);
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error('Failed to save question:', err);
      setError(err.message || 'Failed to save the question.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div
        className="modal scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h3 className="modal-title serif">{isEdit ? 'Edit Question' : 'New Quiz Question'}</h3>
          <button onClick={onClose} className="btn-ghost">
            <X className="icon-20" />
          </button>
        </div>

        {error && (
          <div className="form-error">
            <AlertCircle className="icon-16 form-error-icon" />
            {error}
          </div>
        )}

        <div className="stack">
          <div className="form-row">
            <div className="form-col">
              <label className="field-label">Book *</label>
              <select
                value={book}
                onChange={(e) => {
                  setBook(e.target.value);
                  setChapter(1);
                }}
                className="input"
                disabled={isEdit}
              >
                {Object.keys(BIBLE_BOOKS).map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div className="form-col-narrow">
              <label className="field-label">Chapter *</label>
              <select
                value={chapter}
                onChange={(e) => setChapter(Number(e.target.value))}
                className="input"
                disabled={isEdit}
              >
                {Array.from({ length: BIBLE_BOOKS[book] || 1 }, (_, i) => i + 1).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="field-label">Question *</label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="e.g. What did God create on the first day?"
              rows={2}
              className="input textarea resize-none"
            />
          </div>

          <div>
            <label className="field-label field-label-loose">Answer Options * (tap circle to mark correct)</label>
            <div className="stack-2">
              {['a', 'b', 'c', 'd'].map((opt) => (
                <div key={opt} className="opt-row">
                  <button
                    type="button"
                    onClick={() => setCorrect(opt)}
                    className={correct === opt ? 'opt-letter on' : 'opt-letter'}
                  >
                    {correct === opt && <Check className="icon-16" />}
                    {correct !== opt && opt.toUpperCase()}
                  </button>
                  <input
                    type="text"
                    value={options[opt]}
                    onChange={(e) => setOptions({ ...options, [opt]: e.target.value })}
                    placeholder={`Option ${opt.toUpperCase()}`}
                    className="input input-inline opt-input"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label">Bible Reference (optional)</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. Genesis 1:3-5"
              className="input"
            />
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="btn-primary btn-block btn-save"
        >
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Question'}
        </button>
      </div>
    </div>
  );
}
