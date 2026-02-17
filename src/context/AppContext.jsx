"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authix, getAllNotes } from "../utils/authixInit"; // ✅ import authix properly
import CustomLoader from "../components/CustomLoader";

/* ----------------------------------------
   🧠 Custom Hook: Local Storage Sync
---------------------------------------- */
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
      console.error("LocalStorage Error:", error);
    }
  };

  return [storedValue, setValue];
}

/* ----------------------------------------
   🌍 Global Context
---------------------------------------- */
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useLocalStorage("neuctra-dark-mode", false);
  const [notes, setNotes] = useLocalStorage("neuctra-notes", []);
  const [userInfo, setUserInfo] = useState(null);

  const [loading, setLoading] = useState(true);

  const user = userInfo && typeof userInfo === "object" ? userInfo : null;
  const isUserSignedIn = Boolean(user);

  /* ----------------------------------------
     🔐 INIT USER (UPGRADED)
  ---------------------------------------- */
  useEffect(() => {
    const initUser = async () => {
      try {
        setLoading(true);

        // 1️⃣ Check session
        const sessionRes = await authix.checkUserSession();

        if (!sessionRes?.user?.id) {
          throw new Error("No active session");
        }

        const userId = sessionRes.user.id;

        // 2️⃣ Fetch full profile
        const profileRes = await authix.getUserProfile({ userId });

        if (!profileRes?.user) {
          throw new Error("User profile not found");
        }

        // 3️⃣ Save user to localStorage
        setUserInfo(profileRes.user);
      } catch (err) {
        console.warn("Auth init failed:", err);
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, [setUserInfo]);

  useEffect(() => {
    if (user?.id) {
      fetchNotes(user.id);
    }
  }, [user?.id]);

  /* ----------------------------------------
     🌓 Dark Mode Handling
  ---------------------------------------- */
  useEffect(() => {
    const root = document.documentElement;

    if (darkMode === "system") {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      root.classList.toggle("dark", systemPrefersDark);
    } else {
      root.classList.toggle("dark", !!darkMode);
    }
  }, [darkMode]);

  useEffect(() => {
    if (localStorage.getItem("neuctra-dark-mode") === null) {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setDarkMode(systemPrefersDark);
    }
  }, [setDarkMode]);

  const fetchNotes = async (userId) => {
    if (!userId) return;

    try {
      const fetchedNotes = await getAllNotes(userId);
      setNotes(Array.isArray(fetchedNotes) ? fetchedNotes : []);
    } catch (error) {
      console.error("❌ Failed to fetch notes:", error);
      setNotes([]);
    }
  };

  const toggleTheme = () => {
    if (darkMode === "system") {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setDarkMode(!systemPrefersDark);
    } else {
      setDarkMode((prev) => !prev);
    }
  };

  const logoutUser = async () => {
    try {
      await authix.logoutUser();
      setUserInfo(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  /* ----------------------------------------
     🎯 Context Value
  ---------------------------------------- */
  const value = {
    darkMode,
    setDarkMode,
    toggleTheme,
    notes,
    setNotes,
    user,
    setUserInfo,
    isUserSignedIn,
    logoutUser,
    loading, // ✅ added loading state
  };

  return (
    <AppContext.Provider value={value}>
      {loading ? <CustomLoader message="Getting user session..." /> : children}
    </AppContext.Provider>
  );
};

/* ----------------------------------------
   🧩 Custom Hook
---------------------------------------- */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
