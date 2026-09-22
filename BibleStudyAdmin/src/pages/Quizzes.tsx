import { useEffect, useState, useCallback } from 'react';
import { Plus, X, HelpCircle, ChevronDown, ChevronRight, Trash2, BookOpen, Check, AlertCircle } from 'lucide-react';
import type { QuizQuestion } from '@/lib/types';

const BIBLE_BOOKS: Record<string, number> = {
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

export default function Quizzes() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedBook, setExpandedBook] = useState<string | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<{book: string, chapter: number} | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('dummy_quizzes');
      const data: QuizQuestion[] = stored ? JSON.parse(stored) : [];
      // Sort descending by created_at
      data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setQuestions(data);
    } catch (err) {
      console.error(err);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const grouped = new Map<string, Map<number, QuizQuestion[]>>();
  
  // Initialize grouped with all books and chapters
  Object.entries(BIBLE_BOOKS).forEach(([book, totalChapters]) => {
    const chaptersMap = new Map<number, QuizQuestion[]>();
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
    const bookMap = grouped.get(book)!;
    
    if (!bookMap.has(chapter)) {
      bookMap.set(chapter, []);
    }
    bookMap.get(chapter)!.push(q);
  });

  function deleteQuestion(id: string) {
    const updated = questions.filter(q => q.id !== id);
    localStorage.setItem('dummy_quizzes', JSON.stringify(updated));
    load();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-5 py-5 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-serif text-ink-100">Quiz Questions</h2>
          <p className="text-xs text-ink-400">{questions.length} questions across {grouped.size} books</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-1.5 px-4 py-2.5 text-sm"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Add
        </button>
      </div>

      {/* Questions grouped by book and chapter */}
      {grouped.size === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-ink-800 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-ink-400" />
          </div>
          <p className="text-ink-300 text-sm font-medium">No quiz questions yet</p>
          <p className="text-ink-400 text-xs mt-1">Tap Add to create your first question</p>
        </div>
      ) : (
        <div className="space-y-2.5">
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
                    className="w-full p-3.5 flex items-center gap-3 hover:bg-ink-800/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-400/10 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-primary-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-bold text-ink-100">{book}</p>
                      <p className="text-xs text-ink-400">
                        {chaptersMap.size} chapter{chaptersMap.size !== 1 ? 's' : ''} · {totalQuestions} question{totalQuestions !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {isBookExpanded ? (
                      <ChevronDown className="w-4 h-4 text-ink-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-ink-400" />
                    )}
                  </button>

                  {isBookExpanded && (
                    <div className="border-t border-ink-700/50">
                      {Array.from(chaptersMap.entries())
                        .sort((a, b) => a[0] - b[0])
                        .map(([chapter, qs]) => {
                          const isChapterExpanded = expandedChapter?.book === book && expandedChapter?.chapter === chapter;
                          
                          return (
                            <div key={chapter} className="border-b border-ink-700/30 last:border-0">
                              <button
                                onClick={() => setExpandedChapter(isChapterExpanded ? null : { book, chapter })}
                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-ink-800/30 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-ink-200">Chapter {chapter}</span>
                                  <span className="text-xs text-ink-400">({qs.length})</span>
                                </div>
                                {isChapterExpanded ? (
                                  <ChevronDown className="w-3.5 h-3.5 text-ink-400" />
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5 text-ink-400" />
                                )}
                              </button>
                              
                              {isChapterExpanded && (
                                <div className="px-4 pb-4 pt-1 space-y-2.5">
                                  {qs.length === 0 ? (
                                    <div className="bg-ink-800/50 rounded-xl p-6 text-center border border-ink-700/50 border-dashed">
                                      <p className="text-sm text-ink-300 font-medium">No questions yet</p>
                                      <p className="text-xs text-ink-400 mt-1">Click Add to create the first question for this chapter</p>
                                    </div>
                                  ) : qs.map((q) => (
                                    <div key={q.id} className="bg-ink-800 rounded-xl p-3.5">
                                      <div className="flex items-start justify-between gap-2">
                                        <p className="text-sm font-semibold text-ink-100 flex-1">{q.question_text}</p>
                                        <button
                                          onClick={() => deleteQuestion(q.id)}
                                          className="p-1.5 rounded-lg hover:bg-danger-500/10 text-ink-400 hover:text-danger-500 shrink-0"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                      <div className="mt-2.5 space-y-1.5">
                                        {(['a', 'b', 'c', 'd'] as const).map((opt) => {
                                          const text = q[`option_${opt}` as keyof QuizQuestion] as string;
                                          const isCorrect = q.correct_option === opt;
                                          return (
                                            <div
                                              key={opt}
                                              className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
                                                isCorrect
                                                  ? 'bg-success-500/10 text-success-600 font-semibold'
                                                  : 'bg-ink-850 text-ink-400'
                                              }`}
                                            >
                                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                                isCorrect ? 'bg-success-500 text-white' : 'bg-ink-700 text-ink-400'
                                              }`}>
                                                {opt.toUpperCase()}
                                              </span>
                                              <span className="flex-1">{text}</span>
                                              {isCorrect && <Check className="w-3.5 h-3.5 text-success-600" />}
                                            </div>
                                          );
                                        })}
                                      </div>
                                      {q.bible_reference && (
                                        <div className="mt-2 flex items-center gap-1.5 text-xs text-ink-500">
                                          <BookOpen className="w-3 h-3" />
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
    </div>
  );
}

function QuestionForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [book, setBook] = useState('Genesis');
  const [chapter, setChapter] = useState(1);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState({ a: '', b: '', c: '', d: '' });
  const [correct, setCorrect] = useState<'a' | 'b' | 'c' | 'd'>('a');
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
      const currentQuestions: QuizQuestion[] = stored ? JSON.parse(stored) : [];
      
      const newQuestion: QuizQuestion = {
        id: crypto.randomUUID(),
        book: book.trim(),
        chapter: chapter,
        week_number: 1, // keeping dummy value
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-50/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-ink-900 w-full max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto border border-ink-700/50 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold font-serif text-ink-100">New Quiz Question</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-ink-800 text-ink-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-danger-500/10 text-danger-500 text-xs font-medium px-3 py-2.5 rounded-xl mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs font-semibold text-ink-400 mb-1.5 block">Book *</label>
              <select
                value={book}
                onChange={(e) => {
                  setBook(e.target.value);
                  setChapter(1);
                }}
                className="w-full bg-ink-850 border border-ink-700/50 rounded-xl px-4 py-3 text-sm text-ink-100 focus:outline-none focus:ring-2 focus:ring-primary-400/50"
              >
                {Object.keys(BIBLE_BOOKS).map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div className="w-32 shrink-0">
              <label className="text-xs font-semibold text-ink-400 mb-1.5 block">Chapter *</label>
              <select
                value={chapter}
                onChange={(e) => setChapter(Number(e.target.value))}
                className="w-full bg-ink-850 border border-ink-700/50 rounded-xl px-4 py-3 text-sm text-ink-100 focus:outline-none focus:ring-2 focus:ring-primary-400/50"
              >
                {Array.from({ length: BIBLE_BOOKS[book] || 1 }, (_, i) => i + 1).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-400 mb-1.5 block">Question *</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What did God create on the first day?"
              rows={2}
              className="w-full bg-ink-850 border border-ink-700/50 rounded-xl px-4 py-3 text-sm text-ink-100 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-400 mb-2 block">Answer Options * (tap circle to mark correct)</label>
            <div className="space-y-2">
              {(['a', 'b', 'c', 'd'] as const).map((opt) => (
                <div key={opt} className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCorrect(opt)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                      correct === opt
                        ? 'bg-success-500 text-white ring-4 ring-success-500/20'
                        : 'bg-ink-700 text-ink-400'
                    }`}
                  >
                    {correct === opt && <Check className="w-4 h-4" />}
                    {correct !== opt && opt.toUpperCase()}
                  </button>
                  <input
                    type="text"
                    value={options[opt]}
                    onChange={(e) => setOptions({ ...options, [opt]: e.target.value })}
                    placeholder={`Option ${opt.toUpperCase()}`}
                    className="flex-1 bg-ink-850 border border-ink-700/50 rounded-xl px-3.5 py-2.5 text-sm text-ink-100 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-400 mb-1.5 block">Bible Reference (optional)</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. Genesis 1:3-5"
              className="w-full bg-ink-850 border border-ink-700/50 rounded-xl px-4 py-3 text-sm text-ink-100 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="w-full mt-6 btn-primary py-3.5 text-sm disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Add Question'}
        </button>
      </div>
    </div>
  );
}
