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
  const [darkMode, setDarkMode] = useLocalStorage("neuctra-dark-mode", false);
  const [notes, setNotes] = useLocalStorage("neuctra-notes", []);
  const [userInfo, setUserInfo] = useLocalStorage("userInfo", null);

  const user = userInfo && typeof userInfo === "object" ? userInfo : null;
  const isUserSignedIn = Boolean(user);

  // Apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // 🔹 Auto-load notes when user logs in
  useEffect(() => {
    const loadNotes = async () => {
      if (!isUserSignedIn) return;
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

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
