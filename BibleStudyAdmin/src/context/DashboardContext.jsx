import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { dummyReaders } from '@/lib/dummy';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Owns the dashboard's data. Totals and recent readers come from the
// server; the consistency stats (streak / on track / falling behind)
// still come from the dummy sources until the server records them.
export const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [stats, setStats] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [totalWeeks, setTotalWeeks] = useState(26);
  const [recentReaders, setRecentReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/dashboard`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`The server responded with ${response.status}.`);
      }
      const data = await response.json();

      // Track stats (on track / falling behind) aren't recorded by the
      // server yet — derive them from the dummy readers for now.
      const active = dummyReaders.filter((r) => r.status === 'active');
      const onTrack = active.filter((r) => r.current_streak >= 3).length;
      const fallingBehind = active.filter((r) => r.current_streak === 0).length;

      // The week banner comes from the reading plan on the server; fall
      // back to the old date-based estimate when no plan exists yet.
      if (data.total_weeks) {
        setCurrentWeek(data.current_week);
        setTotalWeeks(data.total_weeks);
      } else {
        const today = new Date();
        const startDate = new Date('2026-09-21');
        const daysDiff = Math.floor(
          (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        setCurrentWeek(Math.max(1, Math.min(26, Math.floor(daysDiff / 7) + 1)));
        setTotalWeeks(26);
      }

      setStats({
        totalReaders: data.total_readers,
        totalQuestions: data.total_questions,
        totalGroups: data.total_groups,
        onTrack,
        fallingBehind,
      });
      setRecentReaders(data.recent_readers || []);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('We could not reach the server. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const value = { stats, currentWeek, totalWeeks, recentReaders, loading, error, reload };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboardContext() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboardContext must be used within DashboardProvider');
  return ctx;
}
