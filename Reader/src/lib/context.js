import React, { createContext, useContext } from "react";
const AppContext = createContext(null);
function AppProvider({ children, value }) {
  return /* @__PURE__ */ React.createElement(AppContext.Provider, { value }, children);
}
function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
export {
  AppProvider,
  useApp
};
