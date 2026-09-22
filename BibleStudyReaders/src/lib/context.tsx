import { createContext, useContext, type ReactNode } from "react";
import type { Profile } from "./types";

interface AppContextValue {
  profile: Profile;
  refreshProfile: () => Promise<void>;
  challengeStartDate: Date;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children, value }: { children: ReactNode; value: AppContextValue }) {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
