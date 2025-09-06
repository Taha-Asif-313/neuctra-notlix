import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Notebook, Moon, Sun } from "lucide-react";

const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 shadow-sm border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Notebook className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">Necutra Note</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-zinc-800 hover:scale-110 transition"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link
            to="/notes"
            className="px-4 py-2 bg-primary text-white rounded-xl font-medium shadow-md hover:shadow-lg transition"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Write Smarter Notes with{" "}
            <span className="text-primary">AI Assistance</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Necutra Note helps you capture, organize, and enhance your ideas.
            With built-in AI, you can generate, expand, and refine your notes
            effortlessly. Supports dark mode for distraction-free writing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/create"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition"
            >
              <Sparkles size={20} />
              Try AI Note
            </Link>
            <Link
              to="/home"
              className="px-6 py-3 border border-gray-300 dark:border-zinc-700 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            >
              View Notes
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-zinc-800">
        © {new Date().getFullYear()} Necutra Note. Built for smarter writing ✨
      </footer>
    </div>
  );
};

export default LandingPage;
