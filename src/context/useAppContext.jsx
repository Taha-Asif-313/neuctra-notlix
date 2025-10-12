import React, { createContext, useContext, useEffect, useState } from "react";

// ---------- Custom hook for localStorage ----------
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// ---------- Context ----------
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useLocalStorage("neuctra-dark-mode", false);
  const [notes, setNotes] = useLocalStorage("neuctra-notes", []);
  const [userInfo, setUserInfo] = useLocalStorage("userInfo", null);

  // Derived state: is user logged in
  const user = userInfo && typeof userInfo === "object" ? userInfo : null;
  const isUserSignedIn = Boolean(user);

  // Optional: Automatically apply dark mode class to <html>
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [darkMode]);

  const value = {
    darkMode,
    setDarkMode,
    notes,
    setNotes,
    user,
    setUserInfo,
    isUserSignedIn,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ---------- Hook to use the context ----------
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
