import { createContext, useContext, useState } from "react";
import { PROFILE } from "@/lib/data";

// Local development can use the Laravel server on this machine. Production
// builds must be configured with the publicly reachable API URL.
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const localApiUrl = import.meta.env.DEV ? 'http://127.0.0.1:8000/api' : '';
export const apiUrl = (configuredApiUrl || localApiUrl).replace(/\/+$/, '');

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
