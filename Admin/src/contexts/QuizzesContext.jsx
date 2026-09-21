import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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

const QuizzesContext = createContext();

export function QuizzesProvider({ children }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('dummy_quizzes');
      const data = stored ? JSON.parse(stored) : [];
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

  function deleteQuestion(id) {
    const updated = questions.filter(q => q.id !== id);
    localStorage.setItem('dummy_quizzes', JSON.stringify(updated));
    load();
  }

  return (
    <QuizzesContext.Provider value={{ questions, loading, grouped, deleteQuestion, load, BIBLE_BOOKS }}>
      {children}
    </QuizzesContext.Provider>
  );
}

export function useQuizzes() {
  return useContext(QuizzesContext);
}
