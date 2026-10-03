import { createContext, useContext, useState } from "react";
import { PROFILE } from "@/lib/data";

// The single source for the backend URL across the reader app — provided to
// every consumer through this context. Swap in a tunnel URL (e.g. ngrok) or
// set VITE_API_URL per environment; otherwise it points at the local server.
export const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
// export const apiUrl = import.meta.env.VITE_API_URL || 'https://bibleapi.pharmasoft-et.com/api';

export const GeneralContext = createContext(null);

export function GeneralProvider({ children }) {
  // The provider owns the app-wide value; swap PROFILE for fetched data at integration.
  const [profile, setProfile] = useState(PROFILE);

  const value = { profile, setProfile, apiUrl };

  return <GeneralContext.Provider value={value}>{children}</GeneralContext.Provider>;
}

export function useGeneralContext() {
  const ctx = useContext(GeneralContext);
  if (!ctx) throw new Error("useGeneralContext must be used within GeneralProvider");
  return ctx;
}
