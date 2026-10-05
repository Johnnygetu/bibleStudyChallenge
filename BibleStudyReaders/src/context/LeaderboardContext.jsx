import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useGeneralContext } from "@/context/GeneralContext";
import { useDateOverride } from "@/context/DateOverrideContext";
import { useUserContext } from "@/context/UserContext";
import { useNavigationContext } from "@/context/NavigationContext";
import { getReaderDisplayName } from "@/lib/reader";
import { getApiErrorMessage, readJsonResponse } from "@/lib/api";

// Owns the reader-facing leaderboard — the single fetch for both the Today
// card and the Leaderboard screen. The server returns the personal board
// already sorted (score desc, name breaks ties); rows are mapped into the
// shape the screens render and decorated with each reader's rank and whether
// the row is the signed-in reader.
export const LeaderboardContext = createContext(null);

export function LeaderboardProvider({ children }) {
  const { apiUrl } = useGeneralContext();
  const { buildUrl } = useDateOverride();
  const { user } = useUserContext();
  const { activeTab } = useNavigationContext();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Attached to the signed-in reader's row so the screen can scroll to it.
  const myEntryRef = useRef(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!apiUrl) {
      setError(getApiErrorMessage(null, apiUrl));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(buildUrl(`${apiUrl}/leaderboard`), {
        headers: { Accept: "application/json" },
      });
      const data = await readJsonResponse(res, "Leaderboard");
      if (!Array.isArray(data?.personal)) {
        throw new Error("The server returned an invalid leaderboard response.");
      }

      setEntries(
        data.personal.map((row) => ({
          id: Number(row.reader_id),
          name: getReaderDisplayName(row),
          photo_url: null,
          current_streak: Number(row.current_streak ?? 0),
          score: Number(row.total_score ?? 0),
        }))
      );
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
      setEntries([]);
      setError(getApiErrorMessage(err, apiUrl));
    } finally {
      setLoading(false);
    }
  }, [apiUrl, buildUrl]);

  useEffect(() => {
    reload();
  }, [reload]);

  const myId = user?.id != null ? Number(user.id) : null;

  const ranked = useMemo(
    () =>
      entries.map((entry, index) => ({
        ...entry,
        rank: index + 1,
        isMe: myId !== null && entry.id === myId,
      })),
    [entries, myId]
  );

  const myEntry = useMemo(() => ranked.find((entry) => entry.isMe) ?? null, [ranked]);

  // Bring the reader's own row into view once the board has loaded and its tab
  // is showing — the board may well have finished loading before the tab was
  // ever opened.
  useEffect(() => {
    if (loading || activeTab !== "leaderboard") return;
    const timer = setTimeout(() => {
      myEntryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
    return () => clearTimeout(timer);
  }, [activeTab, loading]);

  const value = {
    entries: ranked,
    topFive: ranked.slice(0, 5),
    top3: ranked.slice(0, 3),
    restEntries: ranked.slice(3),
    myEntry,
    myRank: myEntry ? myEntry.rank : null,
    loading,
    error,
    reload,
    myEntryRef,
  };

  return <LeaderboardContext.Provider value={value}>{children}</LeaderboardContext.Provider>;
}

export function useLeaderboardContext() {
  const ctx = useContext(LeaderboardContext);
  if (!ctx) throw new Error("useLeaderboardContext must be used inside LeaderboardProvider");
  return ctx;
}
