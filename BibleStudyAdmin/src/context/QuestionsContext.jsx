import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { apiUrl } from '@/context/apiUrl';

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

// Laravel reports validation failures as {"errors": {"0.field": ["why"]}}, where
// the leading number is the row's index in the array that was sent. Flatten that
// into the row/field/text triples the bulk upload page renders, and number the
// rows from 1 so they line up with what the admin sees in their file. A row that
// is not an array at all fails the root rule, so its key is a bare index with no
// field — that still names a row, just no particular column in it.
function toErrorItems(errors) {
  return Object.entries(errors ?? {}).flatMap(([key, messages]) => {
    const match = key.match(/^(\d+)(?:\.(.+))?$/);
    const row = match ? Number(match[1]) + 1 : null;
    const field = match ? match[2] ?? null : key;

    return (Array.isArray(messages) ? messages : [messages]).map((text) => ({ row, field, text }));
  });
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

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(body?.message || `The server responded with ${response.status}.`);
      error.status = response.status;
      error.items = toErrorItems(body?.errors);
      throw error;
    }

    return body;
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

  // Import many questions from a file the admin picked. The file is read and
  // parsed here rather than in the page, so the whole import — read, parse,
  // send, refresh — is one call. Throws so the page can show what went wrong;
  // a rejected file carries `items` for the per-row list.
  const bulkUpload = useCallback(async (file) => {
    let rows;
    try {
      rows = JSON.parse(await file.text());
    } catch (err) {
      console.error(`Bulk upload: could not parse ${file.name} as JSON:`, err);
      throw new Error(`We could not read ${file.name} as JSON. Check the file and try again.`);
    }

    // The server can't express this rule: the body is a bare array, so there is
    // no key to hang a "min:1" on and an empty array would come back as a
    // successful import of nothing.
    if (!Array.isArray(rows) || rows.length === 0) {
      const shape = Array.isArray(rows) ? 'an empty array' : `a ${typeof rows}`;
      console.warn(`Bulk upload: rejected ${file.name} — it parsed as ${shape}, not a non-empty array.`);
      throw new Error('The file must hold a JSON array of questions, like the example file.');
    }

    const result = await request(`${apiUrl}/questions/bulk`, 'POST', JSON.stringify(rows));

    // A success whose body we could not read means the server wrote something
    // ahead of the JSON. The writes may well have committed, so say so rather
    // than failing silently or inviting a retry that imports everything twice.
    if (!result) {
      throw new Error(
        'The server took the import but its reply could not be read, so we cannot confirm what was saved. Reload the question list before uploading again.'
      );
    }

    await reload();
    return result;
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

  const value = { questions, loading, error, deletingId, reload, addQuestion, updateQuestion, bulkUpload, deleteQuestion };

  return <QuestionsContext.Provider value={value}>{children}</QuestionsContext.Provider>;
}

export function useQuestionsContext() {
  const ctx = useContext(QuestionsContext);
  if (!ctx) throw new Error('useQuestionsContext must be used within QuestionsProvider');
  return ctx;
}
