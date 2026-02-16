import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ReactSignedIn } from "@neuctra/authix";

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
import { useAppContext } from "./context/AppContext";
import ScrollToHashElement from "./components/ScrollToHashElement";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const { darkMode, setDarkMode, notes, setNotes } = useAppContext();

  // 🌙 Toggle dark/light theme
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <>
      <Router>
        <ScrollToTop />
        <ScrollToHashElement />
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
              <ReactSignedIn fallback={<Navigate to="/login" replace />}>
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

          <Route path="/note/edit/:id" element={<EditNote />} />

          <Route
            path="/note/create"
            element={
              <ReactSignedIn fallback={<Navigate to="/login" replace />}>
                <CreateNote />
              </ReactSignedIn>
            }
          />

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
