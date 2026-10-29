import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { isFallingBehind, isOnTrack } from '@/lib/progress';

import { apiUrl } from '@/context/apiUrl';

// Owns the dashboard's data: totals and recent readers come from the dashboard
// endpoint, while on track / falling behind is derived from the same per-reader
// progress the Progress page shows.
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
      const [dashboardResponse, progressResponse] = await Promise.all([
        fetch(`${apiUrl}/dashboard`, {
          headers: { Accept: 'application/json' },
        }),
        fetch(`${apiUrl}/progress`, {
          headers: { Accept: 'application/json' },
        }),
      ]);
      if (!dashboardResponse.ok) {
        throw new Error(`The server responded with ${dashboardResponse.status}.`);
      }
      if (!progressResponse.ok) {
        throw new Error(`The server responded with ${progressResponse.status}.`);
      }
      const data = await dashboardResponse.json();
      const progress = await progressResponse.json();

      // Counts come from the readers' real progress, using the same split as
      // the Progress page so the cards and its filter tabs always agree.
      const readers = progress.readers || [];
      const onTrack = readers.filter((r) => isOnTrack(r.days_missed)).length;
      const fallingBehind = readers.filter((r) => isFallingBehind(r.days_missed)).length;

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
        churchMembers: data.church_members,
        nonChurchMembers: data.non_church_members,
        unknownChurchMembers: data.unknown_church_members,
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
