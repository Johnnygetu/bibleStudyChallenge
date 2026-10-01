import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useGeneralContext } from "@/context/GeneralContext";

// Owns the reader-facing leaderboard. The server returns the personal board
// already sorted (score desc, name breaks ties) with one `reader_name` per
// row; we map it into the shape the Today and Leaderboard screens render.
export const LeaderboardContext = createContext(null);

function splitName(name) {
  const parts = String(name ?? "").trim().split(/\s+/).filter(Boolean);
  return { first_name: parts[0] ?? "", last_name: parts.slice(1).join(" ") };
}

export function LeaderboardProvider({ children }) {
  const { apiUrl } = useGeneralContext();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/leaderboard`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        throw new Error(`The server responded with ${res.status}.`);
      }
      const data = await res.json();

      setEntries(
        (data.personal ?? []).map((row) => {
          const { first_name, last_name } = splitName(row.reader_name);
          const total = Number(row.total_score ?? 0);
          return {
            id: row.reader_id,
            first_name,
            last_name,
            photo_url: null,
            current_streak: Number(row.current_streak ?? 0),
            total_quiz_correct: total,
            score: total,
          };
        })
      );
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
      setError("We could not reach the server. Check your connection and try again.");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    reload();
  }, [reload]);

  const value = { entries, loading, error, reload };

  return <LeaderboardContext.Provider value={value}>{children}</LeaderboardContext.Provider>;
}

export function useLeaderboardContext() {
  const ctx = useContext(LeaderboardContext);
  if (!ctx) throw new Error("useLeaderboardContext must be used inside LeaderboardProvider");
  return ctx;
}
