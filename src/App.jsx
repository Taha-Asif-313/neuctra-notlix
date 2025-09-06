import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/notes/Home";
import CreateNote from "./pages/notes/CreateNote";
import { useLocalStorage } from "./hooks/useLocalStorage";
import LandingPage from "./pages/LandingPage";
import NotesLayout from "./pages/notes/NotesLayout";

function App() {
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
              <Route
                index
                element={<Home />}
              />
              <Route
                path="create"
                element={<CreateNote />}
              />
              <Route
                path="edit/:id"
                element={<CreateNote />}
              />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
