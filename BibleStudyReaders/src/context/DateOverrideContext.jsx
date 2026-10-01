import { createContext, useContext, useState, useCallback } from "react";

const STORAGE_KEY = "bible_challenge_processing_date_override";

/**
 * Centralises the "processing date override" for testing.
 *
 * When `overrideDate` is set (YYYY-MM-DD string), every API call in the app
 * should append `?processing_date=<date>` so the backend behaves as though
 * it is that calendar day. When `null`, the real server clock is used.
 *
 * The value is persisted in localStorage so it survives page reloads
 * (the test bar triggers a reload on Apply).
 *
 * `buildUrl(baseUrl)` is a convenience that does the append for you.
 */
const DateOverrideContext = createContext(null);

function loadStored() {
  try {
    return localStorage.getItem(STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

export function DateOverrideProvider({ children }) {
  const [overrideDate, setOverrideDateRaw] = useState(loadStored);

  const setOverrideDate = useCallback((date) => {
    if (date) {
      localStorage.setItem(STORAGE_KEY, date);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    setOverrideDateRaw(date);
  }, []);
  const buildUrl = useCallback(
    (baseUrl) => {
      if (!overrideDate) return baseUrl;
      const sep = baseUrl.includes("?") ? "&" : "?";
      return `${baseUrl}${sep}processing_date=${overrideDate}`;
    },
    [overrideDate]
  );

  const value = { overrideDate, setOverrideDate, buildUrl };

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
