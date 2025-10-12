import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/notes/Home";
import { useLocalStorage } from "./hooks/useLocalStorage";
import LandingPage from "./pages/LandingPage";
import NotesLayout from "./pages/notes/NotesLayout";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import { ReactSignedIn, setSdkConfig } from "@neuctra/authix";
import ProfilePage from "./pages/auth/ProfilePage";
import CreateEditNote from "./pages/notes/CreateEditNote";
import { Toaster } from "react-hot-toast";

function App() {
  // Configure once at app startup
  setSdkConfig({
    baseUrl: "https://server.authix.neuctra.com/api",
    apiKey: "850a8c32c35f008d28295f065526825a656af0a784ea7b0910fc2a1f748adda3",
    appId: "ba73c20458ba4be9f11dab081550a960",
  });
  const [darkMode, setDarkMode] = useLocalStorage("neuctra-dark-mode", false);
  const [notes, setNotes] = useLocalStorage("neuctra-notes", []);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            }
          />
          <Route
            path="/notes"
            element={
              <ReactSignedIn fallback={<Navigate to={"/login"} />}>
                <NotesLayout
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                  notes={notes}
                  setNotes={setNotes}
                />
              </ReactSignedIn>
            }
          >
            <Route index element={<Home />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="create" element={<CreateEditNote />} />
            <Route path="edit/:id" element={<CreateEditNote />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
