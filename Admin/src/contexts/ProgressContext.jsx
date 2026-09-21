import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dummyReaders, dummySchedule, dummyProgress } from '../lib/dummy';

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 500));
    
    const allReaders = dummyReaders;
    const allSchedule = dummySchedule;
    const allProgress = dummyProgress;

    const scheduleByDay = new Map(allSchedule.map((s) => [s.id, s.day_number]));
    const progressByReader = new Map();
    allProgress.forEach((p) => {
      const arr = progressByReader.get(p.reader_id) || [];
      arr.push(p);
      progressByReader.set(p.reader_id, arr);
    });

    const today = new Date();
    const startDate = new Date('2026-09-21');
    const daysElapsed = Math.max(0, Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    const result = allReaders.map((reader) => {
      const readerProgress = progressByReader.get(reader.id) || [];
      const completedCount = readerProgress.filter((p) => p.completed).length;
      const completedDayNumbers = readerProgress
        .filter((p) => p.completed)
        .map((p) => scheduleByDay.get(p.schedule_id))
        .filter((d) => d !== undefined)
        .sort((a, b) => a - b);
      const lastCompletedDay = completedDayNumbers.length > 0 ? completedDayNumbers[completedDayNumbers.length - 1] : null;
      const expectedCount = Math.min(daysElapsed, allSchedule.length);
      const missedDays = Math.max(0, expectedCount - completedCount);

      return {
        reader,
        completedCount,
        totalCount: allSchedule.length,
        lastCompletedDay,
        missedDays,
      };
    });

    setData(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ProgressContext.Provider value={{ data, loading }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}
