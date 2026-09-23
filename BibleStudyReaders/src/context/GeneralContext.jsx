import { createContext, useContext, useState } from "react";
import { PROFILE } from "@/lib/data";

export const GeneralContext = createContext(null);

export function GeneralProvider({ children }) {
  // The provider owns the app-wide value; swap PROFILE for fetched data at integration.
  const [profile, setProfile] = useState(PROFILE);
  const apiUrl = 'http://127.0.0.1:8000/api'

  const value = { profile, setProfile, apiUrl };

  return <GeneralContext.Provider value={value}>{children}</GeneralContext.Provider>;
}

export function useGeneralContext() {
  const ctx = useContext(GeneralContext);
  if (!ctx) throw new Error("useGeneralContext must be used within GeneralProvider");
  return ctx;
}
