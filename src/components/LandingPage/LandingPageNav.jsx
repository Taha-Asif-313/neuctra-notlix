// src/components/Header.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Menu, X, MoveRight } from "lucide-react";
import { useAppContext } from "../../context/useAppContext";

const LandingPageNav = () => {
  const { darkMode, toggleTheme } = useAppContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = ["Features", "Testimonials", "Pricing", "FAQ"];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "py-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800"
          : "py-4 bg-transparent"
      }`}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
        <div className="grid lg:grid-cols-3 grid-cols-2 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">

              <div className="relative">
                <img
                  src={darkMode?"/logo-dark.png":"/logo-white.png"}
                  alt="Neuctra Notes"
                  className="h-10 w-10 object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-primary leading-3">
                Neuctra
              </span>
              <span className="text-lg font-bold leading-3">Notexa</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center justify-center space-x-6">
            {menuItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={toggleTheme}
              className="mx-4 lg:mx-6 transition-all"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={24} className="text-primary" />
              ) : (
                <Moon size={24} className="text-primary" />
              )}
            </button>

            {/* Mobile Menu */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>

            {/* CTA */}
            <Link
              to="/notes"
              className="hidden sm:flex text-sm items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-primary to-green-600 text-white rounded-lg font-medium shadow hover:shadow-md transition-all"
            >
              <span>Get Started</span>
              <MoveRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-emerald-400 transition-colors py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <Link
                to="/notes"
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-green-600 text-white rounded-lg font-medium mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Get Started</span>
                <MoveRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingPageNav;
