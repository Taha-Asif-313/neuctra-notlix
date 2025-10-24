import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ReactSignedIn, setSdkConfig } from "@neuctra/authix";

// 🧩 Layouts
import SiteLayout from "./layouts/SiteLayout";
import NotesLayout from "./layouts/NotesLayout";

// 🧭 Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ProfilePage from "./pages/auth/ProfilePage";
import EditNote from "./pages/notes/EditNote";
import CreateNote from "./pages/notes/CreateNote";
import CollaborateNote from "./pages/notes/CollaborateNote";
import SharedNotePreview from "./pages/notes/SharedNotePreview";
import AllNotes from "./pages/notes/AllNotes";

// ⚖️ Static Pages
import AboutPage from "./pages/static/AboutPage";
import ContactPage from "./pages/static/ContactPage";
import TermsPage from "./pages/static/TermsPage";
import PrivacyPolicyPage from "./pages/static/PrivacyPolicyPage";

// ⚙️ Context
import { useAppContext } from "./context/useAppContext";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react"; // fallback icon (if no logo)
import ScrollToHashElement from "./components/ScrollToHashElement";

/* ----------------------------------------
   🌀 Session Loading Screen (Modern)
---------------------------------------- */
const SessionLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-zinc-900 z-[9999]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative flex flex-col items-center gap-6"
      >
        {/* Outer Circular Ring */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500/30 border-t-primary animate-spin-slow" />

          {/* Logo in center */}
          <img
            src={"/logo-dark.png"}
            alt="Logo"
            className="w-14 h-14 rounded-full object-contain drop-shadow-md"
          />
        </div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-700 dark:text-gray-300 font-medium tracking-wide"
        >
          Checking your session...
        </motion.p>
      </motion.div>
    </div>
  );
};

function App() {
  const { darkMode, setDarkMode, notes, setNotes, user, isUserSignedIn } =
    useAppContext();

  const [appReady, setAppReady] = useState(false);
  const [localCheckDone, setLocalCheckDone] = useState(false);

  // 🌙 Toggle dark/light theme
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  /* ----------------------------------------
     1️⃣ Check localStorage session first
  ---------------------------------------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.id) {
          // user is available from localstorage
          console.log("✅ Local session found:", parsed.email);
        }
      } catch (err) {
        console.warn("⚠️ Invalid local user data:", err);
      }
    }
    setLocalCheckDone(true);
  }, []);

  /* ----------------------------------------
     2️⃣ Configure Authix SDK
  ---------------------------------------- */
  useEffect(() => {
    if (!localCheckDone) return;
    setSdkConfig({
      baseUrl: "https://server.authix.neuctra.com/api",
      apiKey:
        "850a8c32c35f008d28295f065526825a656af0a784ea7b0910fc2a1f748adda3",
      appId: "ba73c20458ba4be9f11dab081550a960",
    });
    setAppReady(true);
  }, [localCheckDone]);

  // ⏳ Wait until both local check + SDK setup done
  if (!localCheckDone || !appReady) return <SessionLoader />;

  return (
    <>
      <Router>
        <ScrollToHashElement/>
        <Routes>
          {/* 🌐 Public Pages */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          {/* 🤝 Shared Notes */}
          <Route path="/collab/:token" element={<CollaborateNote />} />
          <Route path="/preview/:token" element={<SharedNotePreview />} />

          {/* 🗒️ Notes (Protected) */}
          <Route
            path="/notes"
            element={
              <ReactSignedIn
                height="100%"
                width="100%"
                fallback={<Navigate to="/login" replace />}
              >
                <NotesLayout
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                  notes={notes}
                  setNotes={setNotes}
                />
              </ReactSignedIn>
            }
          >
            <Route index element={<AllNotes />} />
            <Route path="create" element={<CreateNote />} />
            <Route path="edit/:id" element={<EditNote />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* 🚫 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      {/* 🔔 Toast Notifications */}
      <Toaster
        position="top-center"
        containerClassName="!text-xs !flex !justify-center"
        toastOptions={{
          className:
            "!bg-primary !text-white !rounded-md !shadow-2xl !px-5 !py-2 " +
            "!flex !items-center !justify-center" + // ✅ Centers content
            "!w-fit !max-w-[90%] !mx-auto !text-center !backdrop-blur-md !bg-opacity-90",
          style: { fontWeight: 500, letterSpacing: "0.3px" },
          success: {
            iconTheme: { primary: "#22c55e", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />
    </>
  );
}

export default App;
