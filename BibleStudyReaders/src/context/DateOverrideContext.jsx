import { createContext, useContext } from "react";

// The "processing date override" testing element is disabled for now: the app
// always uses today's real date. The original override implementation is kept
// in the comment block at the bottom of this file so it can be restored later.
//
// This provider is a passthrough so the consumers below (GeneralContext,
// LeaderboardContext, QuizContext, ReadingContext) keep working unchanged:
// there is no override, and buildUrl returns the URL untouched.
const DateOverrideContext = createContext(null);

const STORAGE_KEY = "bible_challenge_processing_date_override";

export function DateOverrideProvider({ children }) {
  // Stale overrides from earlier sessions must not survive: clear any value
  // the test bar persisted so the real clock is used.
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage may be unavailable; nothing to clear in that case.
  }

  const value = {
    overrideDate: null,
    setOverrideDate: () => {},
    buildUrl: (baseUrl) => baseUrl,
    isBarExpanded: false,
    openBar: () => {},
    closeBar: () => {},
    dateInputValue: "",
    setDateInputValue: () => {},
    applyOverride: () => {},
    resetOverride: () => {},
    stepDay: () => {},
  };

  return (
    <DateOverrideContext.Provider value={value}>
      {children}
    </DateOverrideContext.Provider>
  );
}

export function useDateOverride() {
  const ctx = useContext(DateOverrideContext);
  if (!ctx)
    throw new Error(
      "useDateOverride must be used within DateOverrideProvider"
    );
  return ctx;
}

// Original processing-date override (temporarily commented out):
//
// import { createContext, useContext, useState, useCallback } from "react";
//
// const STORAGE_KEY = "bible_challenge_processing_date_override";
//
// /**
//  * Centralises the "processing date override" for testing.
//  *
//  * When `overrideDate` is set (YYYY-MM-DD string), every API call in the app
//  * should append `?processing_date=<date>` so the backend behaves as though
//  * it is that calendar day. When `null`, the real server clock is used.
//  *
//  * The value is persisted in localStorage so it survives page reloads
//  * (the test bar triggers a reload on Apply).
//  *
//  * `buildUrl(baseUrl)` is a convenience that does the append for you.
//  */
// const DateOverrideContext = createContext(null);
//
// function loadStored() {
//   try {
//     return localStorage.getItem(STORAGE_KEY) || null;
//   } catch {
//     return null;
//   }
// }
//
// function todayInputValue() {
//   return new Date().toISOString().slice(0, 10);
// }
//
// export function DateOverrideProvider({ children }) {
//   const [overrideDate, setOverrideDateRaw] = useState(loadStored);
//
//   // The test bar's own UI state lives here too, so the bar itself only renders.
//   const [isBarExpanded, setBarExpanded] = useState(false);
//   const [dateInputValue, setDateInputValue] = useState(() => overrideDate || todayInputValue());
//
//   const setOverrideDate = useCallback((date) => {
//     if (date) {
//       localStorage.setItem(STORAGE_KEY, date);
//     } else {
//       localStorage.removeItem(STORAGE_KEY);
//     }
//     setOverrideDateRaw(date);
//   }, []);
//   const buildUrl = useCallback(
//     (baseUrl) => {
//       if (!overrideDate) return baseUrl;
//       const sep = baseUrl.includes("?") ? "&" : "?";
//       return `${baseUrl}${sep}processing_date=${overrideDate}`;
//     },
//     [overrideDate]
//   );
//
//   const openBar = useCallback(() => setBarExpanded(true), []);
//   const closeBar = useCallback(() => setBarExpanded(false), []);
//
//   // Applying, resetting and stepping all reload the window, so every screen
//   // re-fetches against the new day.
//   const applyOverride = useCallback(() => {
//     setOverrideDate(dateInputValue);
//     setBarExpanded(false);
//     window.location.reload();
//   }, [dateInputValue, setOverrideDate]);
//
//   const resetOverride = useCallback(() => {
//     setOverrideDate(null);
//     setDateInputValue(todayInputValue());
//     setBarExpanded(false);
//     window.location.reload();
//   }, [setOverrideDate]);
//
//   const stepDay = useCallback(
//     (delta) => {
//       const date = new Date(dateInputValue);
//       date.setDate(date.getDate() + delta);
//       const next = date.toISOString().slice(0, 10);
//       setDateInputValue(next);
//       setOverrideDate(next);
//       window.location.reload();
//     },
//     [dateInputValue, setOverrideDate]
//   );
//
//   const value = {
//     overrideDate,
//     setOverrideDate,
//     buildUrl,
//     isBarExpanded,
//     openBar,
//     closeBar,
//     dateInputValue,
//     setDateInputValue,
//     applyOverride,
//     resetOverride,
//     stepDay,
//   };
//
//   return (
//     <DateOverrideContext.Provider value={value}>
//       {children}
//     </DateOverrideContext.Provider>
//   );
// }
//
// export function useDateOverride() {
//   const ctx = useContext(DateOverrideContext);
//   if (!ctx)
//     throw new Error(
//       "useDateOverride must be used within DateOverrideProvider"
//     );
//   return ctx;
// }