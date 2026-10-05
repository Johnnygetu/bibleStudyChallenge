import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useGeneralContext } from "@/context/GeneralContext";
import { useUserContext } from "@/context/UserContext";
import { useDateOverride } from "@/context/DateOverrideContext";
import { getApiErrorMessage, readJsonResponse } from "@/lib/api";
import { hapticImpact, hapticNotification } from "@/lib/telegram";

// Owns today's reading: the daily-readings fetch, the chapter tick state, the
// sequential unlock rule and save-progress. The Today screen only renders what
// this exposes.
export const ReadingContext = createContext(null);

const chapterLabel = (reading) => `${reading.book} ${reading.chapter_number}`;

export function ReadingProvider({ children }) {
  const { apiUrl } = useGeneralContext();
  const { user } = useUserContext();
  const { buildUrl } = useDateOverride();

  const [readings, setReadings] = useState([]);
  const [apiMetadata, setApiMetadata] = useState(null);
  const [completedLabels, setCompletedLabels] = useState(() => new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [error, setError] = useState(null);
  // Bumped by reload(); re-runs the fetch and, through it, the quiz fetch.
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    // If local storage has a user but is missing the ID (from before we updated
    // the code) clear it and force a reload to show the registration screen.
    if (user && !user.id) {
      localStorage.removeItem("bible_challenge_user_details");
      window.location.reload();
      return;
    }

    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    async function fetchReadings() {
      if (!apiUrl) {
        setError(getApiErrorMessage(null, apiUrl));
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(buildUrl(`${apiUrl}/readers/${user.id}/plans/1/daily-readings`), {
          headers: { Accept: "application/json" },
        });
        const data = await readJsonResponse(res, "Today's reading");
        if (!Array.isArray(data?.readings)) {
          throw new Error("The server returned an invalid daily reading response.");
        }

        setApiMetadata(data);

        // The plan's start date hasn't arrived yet — clear the readings so the
        // screen shows the "X days left" countdown instead.
        if ((data.days_until_start ?? 0) > 0) {
          setReadings([]);
          setCompletedLabels(new Set());
          return;
        }

        setReadings(data.readings);
        const completed = new Set();
        data.readings.forEach((reading) => {
          if (reading.is_completed) completed.add(chapterLabel(reading));
        });
        setCompletedLabels(completed);
      } catch (err) {
        if (!cancelled) {
          setApiMetadata(null);
          setReadings([]);
          setCompletedLabels(new Set());
          setError(getApiErrorMessage(err, apiUrl));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchReadings();
    return () => {
      cancelled = true;
    };
  }, [user, apiUrl, buildUrl, reloadToken]);

  // The success/error message clears itself after a few seconds.
  useEffect(() => {
    if (!saveMessage) return;
    const timer = setTimeout(() => setSaveMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [saveMessage]);

  const allTodayChapters = useMemo(() => readings.map(chapterLabel), [readings]);

  const chapterIds = useMemo(() => readings.map((reading) => reading.chapter_id), [readings]);
  // A stable key for the quiz fetch, so it re-runs when the chapters change
  // rather than on every render.
  const chapterKey = useMemo(() => chapterIds.join(","), [chapterIds]);

  // Chapters unlock in reading order: the first chapter is always clickable and
  // each one after it unlocks once the chapter above it is ticked. A chapter
  // that is already ticked stays clickable so it can be un-ticked.
  const enabledLabels = useMemo(() => {
    const enabled = new Set();
    allTodayChapters.forEach((label, index) => {
      const previous = allTodayChapters[index - 1];
      if (index === 0 || completedLabels.has(label) || completedLabels.has(previous)) {
        enabled.add(label);
      }
    });
    return enabled;
  }, [allTodayChapters, completedLabels]);

  const todayGroups = useMemo(() => {
    const groups = new Map();
    readings.forEach((reading) => {
      const label = chapterLabel(reading);
      if (!groups.has(reading.book)) {
        groups.set(reading.book, {
          id: reading.book.toLowerCase().replace(/\s+/g, "-"),
          book: reading.book,
          chapters: [],
        });
      }
      groups.get(reading.book).chapters.push({
        label,
        chapterNum: reading.chapter_number,
        done: completedLabels.has(label),
        locked: !enabledLabels.has(label),
      });
    });
    return [...groups.values()];
  }, [readings, completedLabels, enabledLabels]);

  const todayCompletedCount = allTodayChapters.filter((label) => completedLabels.has(label)).length;
  const todayTotal = allTodayChapters.length;
  const allDone = todayTotal > 0 && todayCompletedCount === todayTotal;

  const daysUntilStart = apiMetadata?.days_until_start ?? 0;
  const notStarted = daysUntilStart > 0;
  const startDateLabel = apiMetadata?.starting_day
    ? new Date(`${apiMetadata.starting_day}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  const toggleChapter = useCallback(
    (label) => {
      if (!enabledLabels.has(label)) return;
      hapticImpact("light");
      setCompletedLabels((prev) => {
        const next = new Set(prev);
        if (next.has(label)) {
          // Un-ticking a chapter locks the chapters below it again, so clear
          // them too rather than leaving them ticked behind a locked chapter.
          const index = allTodayChapters.indexOf(label);
          if (index === -1) next.delete(label);
          else allTodayChapters.slice(index).forEach((item) => next.delete(item));
        } else {
          next.add(label);
        }
        return next;
      });
    },
    [allTodayChapters, enabledLabels]
  );

  // Save the furthest chapter into the plan's progress; the server derives the
  // rest of the day from it.
  const saveProgress = useCallback(async () => {
    if (!user?.id || completedLabels.size === 0 || !apiMetadata) return;

    const checkedChapters = readings.filter((reading) => completedLabels.has(chapterLabel(reading)));
    if (checkedChapters.length === 0) return;

    const lastChapter = checkedChapters.reduce((prev, current) =>
      prev.order_id > current.order_id ? prev : current
    );

    setIsSaving(true);
    try {
      hapticImpact("medium");
      const res = await fetch(buildUrl(`${apiUrl}/readers/${user.id}/plans/1/save-progress`), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ chapter_id: lastChapter.chapter_id }),
      });
      if (res.ok) {
        hapticNotification("success");
        setSaveMessage({ type: "success", text: "Progress saved successfully!" });
        // Re-fetch daily readings so the UI reflects the newly saved progress.
        reload();
      } else {
        hapticNotification("error");
        setSaveMessage({ type: "error", text: "Failed to save progress." });
      }
    } catch (err) {
      console.error("Failed to save progress", err);
      hapticNotification("error");
      setSaveMessage({ type: "error", text: "Network error while saving." });
    } finally {
      setIsSaving(false);
    }
  }, [apiUrl, apiMetadata, buildUrl, completedLabels, readings, reload, user]);

  const canSave = !!apiMetadata && completedLabels.size > 0 && !isSaving;

  const value = {
    apiMetadata,
    todayGroups,
    todayCompletedCount,
    todayTotal,
    allDone,
    notStarted,
    daysUntilStart,
    startDateLabel,
    chapterIds,
    chapterKey,
    isLoading,
    isSaving,
    canSave,
    saveMessage,
    error,
    reloadToken,
    reload,
    toggleChapter,
    saveProgress,
  };

  return <ReadingContext.Provider value={value}>{children}</ReadingContext.Provider>;
}

export function useReadingContext() {
  const ctx = useContext(ReadingContext);
  if (!ctx) throw new Error("useReadingContext must be used within ReadingProvider");
  return ctx;
}
