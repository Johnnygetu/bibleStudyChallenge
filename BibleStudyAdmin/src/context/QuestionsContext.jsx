import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const LETTERS = ['a', 'b', 'c', 'd'];

// The API nests the chapter and answers; flatten them into the shape the
// book/chapter grouping and option rendering already expect.
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

// Owns everything about the question list: the fetch, its loading/error
// states, and the create/update/delete mutations the Quizzes page performs.
export const QuestionsContext = createContext(null);

export function QuestionsProvider({ children }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const reload = useCallback(async () => {
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
    reload();
  }, [reload]);

  function buildPayload({ book, chapter, questionText, options, correctOption, reference }) {
    return JSON.stringify({
      book: book.trim(),
      chapter,
      question_text: questionText.trim(),
      options: {
        a: options.a.trim(),
        b: options.b.trim(),
        c: options.c.trim(),
        d: options.d.trim(),
      },
      correct_option: correctOption,
      bible_reference: reference.trim() || null,
    });
  }

  async function request(url, method, payload) {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: payload,
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.message || `The server responded with ${response.status}.`);
    }
  }

  // Create a question with its four choices. Throws so the form can show why.
  const addQuestion = useCallback(async (input) => {
    await request(`${API_URL}/questions`, 'POST', buildPayload(input));
    await reload();
  }, [reload]);

  const updateQuestion = useCallback(async (id, input) => {
    await request(`${API_URL}/questions/${id}`, 'PUT', buildPayload(input));
    await reload();
  }, [reload]);

  // Delete one question. The id is exposed as `deletingId` so the row can
  // show a pending state until the server confirms and the list refetches.
  const deleteQuestion = useCallback(async (id) => {
    if (deletingId !== null) return;
    setDeletingId(id);
    try {
      const response = await fetch(`${API_URL}/questions/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`The server responded with ${response.status}.`);
      }
      await reload();
    } catch (err) {
      console.error('Failed to delete question:', err);
    } finally {
      setDeletingId(null);
    }
  }, [reload, deletingId]);

  const value = { questions, loading, error, deletingId, reload, addQuestion, updateQuestion, deleteQuestion };

  return <QuestionsContext.Provider value={value}>{children}</QuestionsContext.Provider>;
}

export function useQuestionsContext() {
  const ctx = useContext(QuestionsContext);
  if (!ctx) throw new Error('useQuestionsContext must be used within QuestionsProvider');
  return ctx;
}
