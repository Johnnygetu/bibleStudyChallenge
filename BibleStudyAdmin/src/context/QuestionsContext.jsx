import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { apiUrl } from '@/context/AppProviders';

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
      const response = await fetch(`${apiUrl}/questions`, {
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
    await request(`${apiUrl}/questions`, 'POST', buildPayload(input));
    await reload();
  }, [reload]);

  const updateQuestion = useCallback(async (id, input) => {
    await request(`${apiUrl}/questions/${id}`, 'PUT', buildPayload(input));
    await reload();
  }, [reload]);

  // Import many questions from a JSON file in one request. The server validates
  // every row before writing any, so a failure means nothing was imported — the
  // thrown error carries the per-row field errors so the page can list them.
  const bulkUpload = useCallback(async (file) => {
    const url = `${apiUrl}/questions/bulk`;
    const form = new FormData();
    form.append('file', file);

    let response;
    try {
      response = await fetch(url, {
        method: 'POST',
        // No Content-Type header: the browser has to set the multipart boundary.
        headers: { Accept: 'application/json' },
        body: form,
      });
    } catch (cause) {
      // The request never reached the server — offline, DNS, CORS, or a
      // refused connection. Keep the original error so the console shows
      // which of those it was; `fetch` only says "Failed to fetch".
      const error = new Error(`Could not reach ${url}. Check your connection and try again.`);
      error.cause = cause;
      error.url = url;
      error.networkFailure = true;
      throw error;
    }

    // Read the body as text first, then parse it. A failing request can answer
    // with an HTML error page — a proxy, a PHP fatal, a WAF — and calling
    // .json() straight on that throws, discarding the only clue about what
    // actually happened. The text is kept either way.
    const rawBody = await response.text().catch(() => '');
    const contentType = response.headers.get('content-type') ?? '';

    let body = null;
    let parseError = null;
    try {
      body = rawBody ? JSON.parse(rawBody) : null;
    } catch (cause) {
      parseError = cause; // Not JSON. rawBody still carries it to the console.
    }

    if (!response.ok) {
      const error = new Error(body?.message || `The server responded with ${response.status}.`);
      error.status = response.status;
      error.statusText = response.statusText;
      error.url = url;
      error.contentType = contentType;
      error.rawBody = rawBody;
      error.body = body;
      error.cause = parseError;
      error.fieldErrors = body?.errors ?? null; // { file: [...], 'questions.3.correct_option': [...] }
      throw error;
    }

    if (!body) {
      // The rows were written, but we cannot tell the page how many.
      const error = new Error('The upload succeeded but the server sent back a reply that is not JSON.');
      error.status = response.status;
      error.url = url;
      error.contentType = contentType;
      error.rawBody = rawBody;
      error.cause = parseError;
      error.writtenButUnconfirmed = true;
      throw error;
    }

    await reload();
    return body;
  }, [reload]);

  // Delete one question. The id is exposed as `deletingId` so the row can
  // show a pending state until the server confirms and the list refetches.
  const deleteQuestion = useCallback(async (id) => {
    if (deletingId !== null) return;
    setDeletingId(id);
    try {
      const response = await fetch(`${apiUrl}/questions/${id}`, {
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

  const value = { questions, loading, error, deletingId, reload, addQuestion, updateQuestion, deleteQuestion, bulkUpload };

  return <QuestionsContext.Provider value={value}>{children}</QuestionsContext.Provider>;
}

export function useQuestionsContext() {
  const ctx = useContext(QuestionsContext);
  if (!ctx) throw new Error('useQuestionsContext must be used within QuestionsProvider');
  return ctx;
}
