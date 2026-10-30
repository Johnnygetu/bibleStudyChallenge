import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { BookOpen, Trophy, MessageSquare } from "lucide-react";
import { useUserContext } from "@/context/UserContext";

// Owns the bottom-nav tab, so App and the screens stay free of state. Each tab
// carries its own select handler and active flag, which lets the nav button
// wire `onClick` and `className` straight to the tab object. The leaderboard is
// shown to church members only; `lib/canTestFeature.js` is kept around for
// gating future in-development features.
export const NavigationContext = createContext(null);

export function NavigationProvider({ children }) {
  const [activeTab, setActiveTab] = useState("today");
  const { isChurchMember } = useUserContext();

  const navigate = useCallback((tab) => setActiveTab(tab), []);

  const tabs = useMemo(() => {
    const allTabs = [
      {
        id: "today",
        label: "Today",
        icon: BookOpen,
        isActive: activeTab === "today",
        onSelect: () => setActiveTab("today"),
      },
      {
        id: "leaderboard",
        label: "Leaderboard",
        icon: Trophy,
        isActive: activeTab === "leaderboard",
        onSelect: () => setActiveTab("leaderboard"),
      },
      {
        id: "community",
        label: "Community",
        icon: MessageSquare,
        isActive: activeTab === "community",
        onSelect: () => setActiveTab("community"),
      },
    ];

    // The leaderboard is for church members alone: a null answer (not asked
    // yet) and a false answer both keep the tab hidden.
    return isChurchMember === true
      ? allTabs
      : allTabs.filter((tab) => tab.id !== "leaderboard");
  }, [activeTab, isChurchMember]);

  const value = { activeTab, navigate, tabs };

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNavigationContext() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigationContext must be used within NavigationProvider");
  return ctx;
}
