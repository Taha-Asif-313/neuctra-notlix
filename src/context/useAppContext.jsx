import React, { createContext, useContext, useEffect, useState } from "react";
import { getAllNotes } from "../authix/authixinit";

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

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // -------------------------------
  // 🔹 Global States
  // -------------------------------
  const [darkMode, setDarkMode] = useLocalStorage("neuctra-dark-mode", false);
  const [notes, setNotes] = useLocalStorage("neuctra-notes", []);
  const [userInfo, setUserInfo] = useLocalStorage("userInfo", null);

  const user = userInfo && typeof userInfo === "object" ? userInfo : null;
  const isUserSignedIn = Boolean(user);

  // -------------------------------
  // 🔹 Dark Mode Sync + System Preference
  // -------------------------------
  useEffect(() => {
    const root = document.documentElement;

    if (darkMode === "system") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", systemPrefersDark);
    } else {
      root.classList.toggle("dark", darkMode);
    }
  }, [darkMode]);

  // Optional: auto-detect theme on first load
  useEffect(() => {
    if (localStorage.getItem("neuctra-dark-mode") === null) {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(systemPrefersDark);
    }
  }, []);

  // -------------------------------
  // 🔹 Toggle Theme Function
  // -------------------------------
  const toggleTheme = () => {
    if (darkMode === "system") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(!systemPrefersDark);
    } else {
      setDarkMode((prev) => !prev);
    }
  };

  // -------------------------------
  // 🔹 Auto-load notes when signed in
  // -------------------------------
  useEffect(() => {
    const loadNotes = async () => {
      if (!isUserSignedIn || !user?.id) return;
      try {
        const res = await getAllNotes(user.id);
        if (res && Array.isArray(res.data)) {
          setNotes(res.data);
        }
      } catch (error) {
        console.error("Failed to load notes:", error);
      }
    };

    loadNotes();
  }, [isUserSignedIn, user?.id]);

  // -------------------------------
  // 🔹 Context Value
  // -------------------------------
  const value = {
    darkMode,
    setDarkMode,
    toggleTheme,
    notes,
    setNotes,
    user,
    setUserInfo,
    isUserSignedIn,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
