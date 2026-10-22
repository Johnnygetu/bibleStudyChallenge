import { useEffect, useState } from 'react';
import { Plus, X, Edit2, HelpCircle, ChevronDown, ChevronRight, Trash2, BookOpen, Check, AlertCircle, CheckCircle2, Upload } from 'lucide-react';
import { ErrorState } from '@/components/ui';
import { apiUrl } from '@/context/apiUrl';
import BulkUpload from '@/pages/BulkUpload.jsx';
import { useQuestionsContext } from '@/context/QuestionsContext';

export default function Quizzes() {
  const { questions, loading, error, deletingId, reload, bulkUpload, deleteQuestion } = useQuestionsContext();
  const [view, setView] = useState('list');
  const [notice, setNotice] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [expandedBook, setExpandedBook] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [editing, setEditing] = useState(null);

  // The bulk import is a second view of this page rather than another bottom-nav
  // tab, so the shell and the highlighted "Quizzes" tab stay put while it's open.
  if (view === 'bulk') {
    return (
      <BulkUpload
        onBack={() => setView('list')}
        // Errors are left to propagate: the page catches them and renders the
        // panel, whether it is one message or a list of per-row problems.
        onImport={async (file) => {
          const result = await bulkUpload(file);
          setNotice(`Imported ${result.created} question${result.created === 1 ? '' : 's'}.`);
          setView('list');
        }}
      />
    );
  }

  // Group purely from what the questions carry — books and chapters with no
  // questions simply don't appear. Books are exactly the names stored on the
  // server (Amharic in production), never a hardcoded canon list.

  const grouped = new Map();

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

  return (
    <div className="page stack fade-in">
      {notice && (
        <div className="form-success">
          <CheckCircle2 className="icon-16 form-error-icon" />
          <span className="form-success-text">{notice}</span>
          <button onClick={() => setNotice('')} className="btn-ghost" aria-label="Dismiss">
            <X className="icon-16" />
          </button>
        </div>
      )}

      <div className="page-head">
        <div>
          <h2 className="page-title serif">Quiz Questions</h2>
          <p className="page-sub">
            {loading ? (
              <span className="sk-line sk-sub" />
            ) : (
              `${questions.length} questions across ${grouped.size} books`
            )}
          </p>
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
      {loading ? (
        <BookSkeletonList />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
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
            .sort((a, b) => a[0].localeCompare(b[0]))
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
                                  {qs.map((q) => (
                                    <div key={q.id} className={deletingId === q.id ? 'q-card is-removing' : 'q-card'}>
                                      <div className="q-head">
                                        <p className="q-text">{q.question_text}</p>
                                        <div className="q-actions">
                                          {deletingId === q.id ? (
                                            <span className="q-deleting" role="status">Deleting...</span>
                                          ) : (
                                            <>
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
                                                disabled={deletingId !== null}
                                              >
                                                <Trash2 className="icon-14" />
                                              </button>
                                            </>
                                          )}
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

      {showForm && (
        <QuestionForm
          onClose={() => setShowForm(false)}
          onBulkUpload={() => {
            setShowForm(false);
            setView('bulk');
          }}
        />
      )}
      {editing && <QuestionForm question={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function BookSkeletonList() {
  return (
    <div className="list-tight" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="card row sk-row">
          <div className="sk-square" />
          <div className="row-main">
            <div className="sk-line sk-line-name" />
            <div className="sk-line sk-line-meta" />
          </div>
          <div className="sk-badge" />
        </div>
      ))}
    </div>
  );
}

function QuestionForm({ question, onClose, onBulkUpload }) {
  const { addQuestion, updateQuestion } = useQuestionsContext();
  const isEdit = Boolean(question);
  const [book, setBook] = useState(question?.book || '');
  const [chapter, setChapter] = useState(question?.chapter || 1);
  const [questionText, setQuestionText] = useState(question?.question_text || '');
  const [options, setOptions] = useState({
    a: question?.option_a || '',
    b: question?.option_b || '',
    c: question?.option_c || '',
    d: question?.option_d || '',
  });
  const [correct, setCorrect] = useState(question?.correct_option || 'a');
  // The reference input was removed from the form. Keep any stored value so
  // editing a question doesn't wipe it; new questions save null.
  const reference = question?.bible_reference || '';
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Suggestions come from the challenge data itself (book_chapters on the
  // server), not from a hardcoded book list. They're advisory only: the admin
  // can type any book or chapter, and a failed fetch just leaves the fields
  // as plain text/number inputs.
  const [books, setBooks] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${apiUrl}/book-chapters`, { headers: { Accept: 'application/json' } })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((rows) => {
        if (!cancelled && Array.isArray(rows)) {
          setBooks(rows);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const chapterChoices = (books.find((entry) => entry.book === book)?.chapters ?? []).map((c) => c.chapter_number);

  async function save() {
    if (!book.trim() || !questionText.trim() || !options.a.trim() || !options.b.trim() || !options.c.trim() || !options.d.trim()) {
      setError('Please fill in the book, question, and all four options.');
      return;
    }
    setSaving(true);
    setError('');

    try {
      const input = { book, chapter: Number(chapter), questionText, options, correctOption: correct, reference };
      if (isEdit) {
        await updateQuestion(question.id, input);
      } else {
        await addQuestion(input);
      }
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
              <input
                type="text"
                value={book}
                onChange={(e) => setBook(e.target.value)}
                placeholder="e.g. ዘፍጥረት"
                list="quiz-book-options"
                className="input"
                disabled={isEdit}
              />
              <datalist id="quiz-book-options">
                {books.map((entry) => (
                  <option key={entry.book} value={entry.book} />
                ))}
              </datalist>
            </div>
            <div className="form-col-narrow">
              <label className="field-label">Chapter *</label>
              <input
                type="number"
                min={1}
                value={chapter}
                onChange={(e) => setChapter(Number(e.target.value))}
                list="quiz-chapter-options"
                className="input"
                disabled={isEdit}
              />
              <datalist id="quiz-chapter-options">
                {chapterChoices.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
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
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="btn-primary btn-block btn-save"
        >
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Question'}
        </button>

        {!isEdit && onBulkUpload && (
          <button onClick={onBulkUpload} className="btn-secondary btn-block btn-bulk">
            <Upload className="icon-16" />
            Bulk Upload
          </button>
        )}
      </div>
    </div>
  );
}
