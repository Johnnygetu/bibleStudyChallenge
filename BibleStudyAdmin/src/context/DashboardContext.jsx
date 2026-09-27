import { createContext, useContext, useEffect, useState } from 'react';
import { dummyReaders, getDummyQuestions } from '@/lib/dummy';

// Owns the dashboard's data: current week, stat card figures, and the
// recently-joined readers (currently derived from the dummy data sources).
export const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [stats, setStats] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [recentReaders, setRecentReaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Simulate network delay
      await new Promise(r => setTimeout(r, 500));
      const readers = dummyReaders;
      const questions = getDummyQuestions();

      const today = new Date();
      const startDate = new Date('2026-09-21');
      const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const week = Math.max(1, Math.min(26, Math.floor(daysDiff / 7) + 1));
      setCurrentWeek(week);

      const allReaders = readers || [];
      const active = allReaders.filter((r) => r.status === 'active');
      const onTrack = active.filter((r) => r.current_streak >= 3).length;
      const fallingBehind = active.filter((r) => r.current_streak === 0).length;
      const avgStreak =
        active.length > 0
          ? Math.round((active.reduce((s, r) => s + r.current_streak, 0) / active.length) * 10) / 10
          : 0;

      setStats({
        totalReaders: allReaders.length,
        activeReaders: active.length,
        totalQuestions: questions.length,
        onTrack,
        fallingBehind,
        avgStreak,
      });

      setRecentReaders(
        [...allReaders].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5),
      );
      setLoading(false);
    }
    load();
  }, []);

  const value = { stats, currentWeek, recentReaders, loading };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboardContext() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboardContext must be used within DashboardProvider');
  return ctx;
}
