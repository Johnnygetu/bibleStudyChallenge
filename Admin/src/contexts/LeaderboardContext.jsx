import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dummyReaders, dummyQuizResponses, dummyProgress } from '../lib/dummy';

const LeaderboardContext = createContext();

export function LeaderboardProvider({ children }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 500));

    const allReaders = dummyReaders;
    const allResponses = dummyQuizResponses;
    const allProgress = dummyProgress;

    const progressByReader = new Map();
    allProgress.forEach((p) => {
      if (p.completed) {
        progressByReader.set(p.reader_id, (progressByReader.get(p.reader_id) || 0) + 1);
      }
    });

    const result = allReaders.map((reader) => {
      const readerResponses = allResponses.filter((r) => r.reader_id === reader.id);
      const totalCorrect = readerResponses.filter((r) => r.is_correct).length;
      const totalAnswered = readerResponses.length;
      return {
        reader_id: reader.id,
        reader_name: reader.name,
        total_correct: totalCorrect,
        total_answered: totalAnswered,
        current_streak: reader.current_streak,
        longest_streak: reader.longest_streak,
        days_completed: progressByReader.get(reader.id) || 0,
      };
    });

    result.sort((a, b) => {
      if (b.total_correct !== a.total_correct) return b.total_correct - a.total_correct;
      if (b.current_streak !== a.current_streak) return b.current_streak - a.current_streak;
      return b.days_completed - a.days_completed;
    });

    setEntries(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <LeaderboardContext.Provider value={{ entries, loading }}>
      {children}
    </LeaderboardContext.Provider>
  );
}

export function useLeaderboard() {
  return useContext(LeaderboardContext);
}
