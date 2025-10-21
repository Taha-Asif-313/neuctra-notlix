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

/* ----------------------------------------
   🌀 Session Loading Screen
---------------------------------------- */
const SessionLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-zinc-900">
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-700 dark:text-gray-300 font-medium">
        Checking your session...
      </p>
    </div>
  </div>
);

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
        position="top-right"
        containerClassName="text-xs"
        toastOptions={{
          className:
            "!bg-primary !text-white !rounded-xl !shadow-lg !px-4 !py-3 !backdrop-blur-md !bg-opacity-90",
          style: { fontWeight: 500, letterSpacing: "0.3px" },
          success: { iconTheme: { primary: "#fff", secondary: "#22c55e" } },
          error: { iconTheme: { primary: "#fff", secondary: "#ef4444" } },
        }}
      />
    </>
  );
}

export default App;
