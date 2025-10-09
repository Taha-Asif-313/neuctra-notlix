import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/notes/Home";
import CreateNote from "./pages/notes/CreateNote";
import { useLocalStorage } from "./hooks/useLocalStorage";
import LandingPage from "./pages/LandingPage";
import NotesLayout from "./pages/notes/NotesLayout";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import { setSdkConfig } from "@neuctra/authix";
import ProfilePage from "./pages/auth/ProfilePage";

function App() {
  // Configure once at app startup
setSdkConfig({
  baseUrl: "https://server.authix.neuctra.com/api",
  apiKey: "850a8c32c35f008d28295f065526825a656af0a784ea7b0910fc2a1f748adda3",
  appId: "ba73c20458ba4be9f11dab081550a960"
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
    <Router>
      <div>
        <main>
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
                <NotesLayout
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                  notes={notes}
                  setNotes={setNotes}
                />
              }
            >
              <Route index element={<Home />} />
              <Route path="create" element={<CreateNote />} />
              <Route path="edit/:id" element={<CreateNote />} />
            </Route>
              <Route path="/login" element={<LoginPage/>} />
                  <Route path="/signup" element={<SignupPage/>} />
                  <Route path="/profile" element={<ProfilePage/>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
