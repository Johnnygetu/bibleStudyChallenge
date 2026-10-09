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
  const { user, clearUser } = useUserContext();
  const { buildUrl } = useDateOverride();

  const [readings, setReadings] = useState([]);
  const [apiMetadata, setApiMetadata] = useState(null);
  const [completedLabels, setCompletedLabels] = useState(() => new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  // Set the moment a save succeeds, and only then — the reading card swaps the
  // checklist for the completion message in response to the click, not because
  // an earlier visit had already finished the day.
  const [savedToday, setSavedToday] = useState(false);
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

        // A database reset can leave a valid-looking reader ID in this
        // browser's local storage. Only clear it when the reader endpoint
        // confirms that the account itself is gone; a missing plan or route
        // should remain a visible API error instead of forcing registration.
        if (res.status === 404) {
          const readerResponse = await fetch(`${apiUrl}/readers/${user.id}`, {
            headers: { Accept: "application/json" },
          });

          if (readerResponse.status === 404) {
            clearUser();
            setApiMetadata(null);
            setReadings([]);
            setCompletedLabels(new Set());
            setError(null);
            return;
          }
        }

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
  }, [user, apiUrl, buildUrl, reloadToken, clearUser]);

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

  // What the last fetch said the server already has stored for today. Kept
  // apart from the local ticks so "the day is already saved" can be told from
  // "every box is ticked but nothing has been sent yet" — the second still
  // needs saving, the first does not.
  const savedLabels = useMemo(
    () =>
      new Set(
        (apiMetadata?.readings ?? [])
          .filter((reading) => reading.is_completed)
          .map(chapterLabel)
      ),
    [apiMetadata]
  );

  // Chapters unlock in reading order: the first chapter is always clickable and
  // each one after it unlocks once the chapter above it is ticked. A chapter
  // that is already ticked stays clickable so it can be un-ticked — unless the
  // server has it stored, in which case it is fixed and only counts towards
  // unlocking the chapters below it.
  const enabledLabels = useMemo(() => {
    const enabled = new Set();
    allTodayChapters.forEach((label, index) => {
      if (savedLabels.has(label)) return;
      const previous = allTodayChapters[index - 1];
      if (index === 0 || completedLabels.has(label) || completedLabels.has(previous)) {
        enabled.add(label);
      }
    });
    return enabled;
  }, [allTodayChapters, completedLabels, savedLabels]);

  const todayGroups = useMemo(() => {
    const groups = [];
    readings.forEach((reading, index) => {
      const label = chapterLabel(reading);
      let group = groups[groups.length - 1];
      if (!group || group.book !== reading.book) {
        group = {
          // Include the position so a book that appears again later gets its
          // own section and a distinct React key.
          id: `${reading.book.toLowerCase().replace(/\s+/g, "-")}-${index}`,
          book: reading.book,
          chapters: [],
        };
        groups.push(group);
      }
      const isSaved = savedLabels.has(label);
      group.chapters.push({
        label,
        chapterNum: reading.chapter_number,
        done: completedLabels.has(label),
        // Saved chapters stay ticked but stop responding: the server already
        // has them, so a tick taken back here would put the screen out of step
        // with the stored progress.
        saved: isSaved,
        locked: !enabledLabels.has(label) && !isSaved,
      });
    });
    return groups;
  }, [readings, completedLabels, enabledLabels, savedLabels]);

  const todayCompletedCount = allTodayChapters.filter((label) => completedLabels.has(label)).length;
  const todayTotal = allTodayChapters.length;
  const allDone = todayTotal > 0 && todayCompletedCount === todayTotal;

  const hasUnsavedChanges = useMemo(() => {
    if (completedLabels.size !== savedLabels.size) return true;
    for (const label of completedLabels) {
      if (!savedLabels.has(label)) return true;
    }
    return false;
  }, [completedLabels, savedLabels]);

  const daysUntilStart = apiMetadata?.days_until_start ?? 0;
  const notStarted = daysUntilStart > 0;
  // True once today's quiz has been handed in, whether that happened in this
  // session or on an earlier visit.
  const quizDoneToday = apiMetadata?.has_submitted_quiz_today ?? false;
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
        const finishedToday = readings.length > 0 && checkedChapters.length === readings.length;
        if (finishedToday) {
          // Only replace the checklist after every assigned chapter is checked.
          setSavedToday(true);
          setSaveMessage(null);
        } else {
          setSavedToday(false);
          setSaveMessage({
            type: "success",
            text: "Progress saved. Finish the remaining chapters to complete today's reading.",
          });
        }
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

  // Hidden entirely when the ticked chapters already match what the server
  // stored, so being caught up never invites a save that would change nothing.
  const canSave =
    !!apiMetadata && completedLabels.size > 0 && hasUnsavedChanges && !isSaving;

  const value = {
    apiMetadata,
    todayGroups,
    todayCompletedCount,
    todayTotal,
    allDone,
    savedToday,
    notStarted,
    quizDoneToday,
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
