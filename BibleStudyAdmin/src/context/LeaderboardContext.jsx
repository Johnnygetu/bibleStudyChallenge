import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { apiUrl } from '@/context/apiUrl';

// Owns the leaderboard: personal rankings (sum of the reader's scores)
// and group rankings (sum of each group's members' scores), fetched from
// the server. The server sorts both boards — score desc, name breaks ties.
export const LeaderboardContext = createContext(null);

export function LeaderboardProvider({ children }) {
  const [entries, setEntries] = useState([]);
  const [groupEntries, setGroupEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/leaderboard`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`The server responded with ${response.status}.`);
      }
      const data = await response.json();

      setEntries(
        (data.personal || []).map((row) => ({
          reader_id: row.reader_id,
          reader_name: row.reader_name,
          total_correct: row.total_score,
          current_streak: row.current_streak,
        })),
      );
      setGroupEntries(
        (data.groups || []).map((row) => ({
          group_id: row.group_id,
          group_name: row.group_name,
          members_count: row.members_count,
          total_correct: row.total_score,
          avg_correct: row.avg_score,
          top_reader_name: row.top_reader_name,
        })),
      );
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
      setError('We could not reach the server. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const value = { entries, groupEntries, loading, error, reload };

  return <LeaderboardContext.Provider value={value}>{children}</LeaderboardContext.Provider>;
}

export function useLeaderboardContext() {
  const ctx = useContext(LeaderboardContext);
  if (!ctx) throw new Error('useLeaderboardContext must be used within LeaderboardProvider');
  return ctx;
}
