import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Owns the reading-progress data: per-reader days done/missed and streaks,
// computed on the server from the reading plan's schedule (lag logic) and
// the reader's study days.
export const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/progress`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`The server responded with ${response.status}.`);
      }
      const payload = await response.json();

      setData(
        (payload.readers || []).map((row) => ({
          reader: {
            id: row.reader_id,
            name: row.name,
            phone: row.phone,
            status: 'active',
            current_streak: row.current_streak,
            longest_streak: row.longest_streak,
          },
          completedCount: row.days_done,
          totalCount: payload.plan?.total_days ?? 0,
          missedDays: row.days_missed,
          lastCompletedDay: row.last_read_day,
        })),
      );
    } catch (err) {
      console.error('Failed to load reading progress:', err);
      setError('We could not reach the server. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const value = { data, loading, error, reload };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgressContext() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgressContext must be used within ProgressProvider');
  return ctx;
}
