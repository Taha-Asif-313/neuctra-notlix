import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Menu, X, Plus, Home, BookHeart } from "lucide-react";
import {
  ReactSignedIn,
  ReactUserButton,
  ReactUserProfile,
} from "@neuctra/authix";

const Navbar = ({ darkMode, toggleDarkMode }) => {
    const theme = localStorage.getItem("neuctra-dark-mode");
  const isDark = theme === "true" || theme === "dark";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white dark:bg-zinc-950 shadow-md border-b border-gray-200 dark:border-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="mr-1">
                <img
                  src={darkMode ? "/logo-dark.png" : "/logo-white.png"}
                  height={38}
                  width={38}
                  alt="Logo"
                  className="object-cover"
                />
              </div>
              <span className="text-sm text-gray-800 dark:text-white">
                Neuctra <span className="text-primary font-bold">Notexa</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center  space-x-4">
            <Link
              to="/notes"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                isActive("/notes")
                  ? "text-primary dark:text-primary bg-primary/15 dark:bg-primary/5"
                  : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
              }`}
            >
              <BookHeart size={18} className="mr-1" />
              Notes
            </Link>
            <Link
              to="/notes/create"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                isActive("/notes/create")
                  ? "text-primary dark:text-primary bg-primary/5 dark:bg-primary/5"
                  : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
              }`}
            >
              <Plus size={18} className="mr-1" />
              New Note
            </Link>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-black text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <ReactSignedIn>
              <ReactUserButton darkMode={isDark} profileUrl={"/notes/profile"} />
            </ReactSignedIn>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              
            </button>
            <ReactSignedIn>
              <ReactUserButton profileUrl={"/profile"} />
            </ReactSignedIn>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden text-sm bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/notes"
              className={` px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center ${
                isActive("/notes")
                  ? "text-primary dark:text-primary bg-blue-100 dark:bg-primary/10"
                  : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <BookHeart size={18} className="mr-2" />
              Notes
            </Link>
            <Link
              to="/notes/create"
              className={` px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center ${
                isActive("/notes/create")
                  ? "text-primary dark:text-primary bg-blue-100 dark:bg-primary/10"
                  : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Plus size={18} className="mr-2" />
              New Note
            </Link>
            <button
              onClick={toggleDarkMode}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-200 flex items-center"
            >
              {darkMode ? (
                <>
                  <Sun size={18} className="mr-2" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon size={18} className="mr-2" />
                  Dark Mode
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
