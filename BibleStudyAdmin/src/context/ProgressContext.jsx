import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { apiUrl } from '@/context/apiUrl';

// Owns the reading-progress data: per-reader days done/missed and streaks,
// computed on the server from the reading plan's schedule (lag logic) and
// the reader's study days. It also exposes the plan's chapters (for the
// admin's progress override) and the call that performs the override.
export const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [data, setData] = useState([]);
  const [planId, setPlanId] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/progress`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`The server responded with ${response.status}.`);
      }
      const payload = await response.json();
      const currentPlanId = payload.plan?.id ?? null;
      setPlanId(currentPlanId);

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
          currentOrderId: row.current_order_id ?? 0,
        })),
      );

      // The chapter picker needs the plan's schedule. A failure here only
      // leaves the picker empty; the progress list still works.
      if (currentPlanId) {
        try {
          const scheduleResponse = await fetch(`${apiUrl}/plans/${currentPlanId}/schedule`, {
            headers: { Accept: 'application/json' },
          });
          if (scheduleResponse.ok) {
            const schedule = await scheduleResponse.json();
            setChapters(
              (schedule.schedule || []).flatMap((day) =>
                (day.chapters || []).map((chapter) => ({
                  orderId: chapter.order_id,
                  day: day.day,
                  label: `${chapter.book} ${chapter.chapter_number}`,
                })),
              ),
            );
          }
        } catch {
          setChapters([]);
        }
      }
    } catch (err) {
      console.error('Failed to load reading progress:', err);
      setError('We could not reach the server. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Moves a reader to a chapter the admin picked. The server records that as
  // the reader's position at the start of today, so today's reading restarts
  // from the new position.
  const setProgress = useCallback(
    async (readerId, orderId) => {
      if (!planId) {
        throw new Error('No reading plan is available.');
      }

      const response = await fetch(
        `${apiUrl}/readers/${readerId}/plans/${planId}/set-progress`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ order_id: orderId }),
        },
      );

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const firstError = payload?.errors
          ? Object.values(payload.errors)[0]?.[0]
          : null;
        throw new Error(firstError ?? payload?.message ?? 'Could not update progress.');
      }

      await reload();
    },
    [planId, reload],
  );

  // Sets the reader's streak by hand. The server adjusts the reader's newest
  // streak row, so daily reads keep counting from the corrected value; the
  // value itself cannot reach past today's plan day.
  const setStreak = useCallback(async (readerId, streak) => {
    const response = await fetch(`${apiUrl}/readers/${readerId}/set-streak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ streak }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const firstError = payload?.errors
        ? Object.values(payload.errors)[0]?.[0]
        : null;
      throw new Error(firstError ?? payload?.message ?? 'Could not update the streak.');
    }

    await reload();
  }, [reload]);

  useEffect(() => {
    reload();
  }, [reload]);

  const value = { data, loading, error, reload, planId, chapters, setProgress, setStreak };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgressContext() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgressContext must be used within ProgressProvider');
  return ctx;
}
