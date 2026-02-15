import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Menu, X, MoveRight } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

const LandingPageNav = () => {
  const { darkMode, toggleTheme, user } = useAppContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = ["Features", "Testimonials", "Pricing", "FAQ"];
  const ctaLabel = user ? "Go to Notes" : "Get Started";
  const ctaLink = user ? "/notes" : "/login";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen
          ? "py-3 bg-white/90 dark:bg-black backdrop-blur-md shadow-md"
          : "py-4 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 items-center justify-between">
          {/* 🔹 Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={darkMode ? "/logo-dark.png" : "/logo-white.png"}
              alt="Neuctra Notlix"
              className="h-10 w-10 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-[10px] leading-[10px] text-primary font-semibold">
                Neuctra
              </span>
              <span className="text-lg leading-[18px] font-bold">Notlix</span>
            </div>
          </Link>

          {/* 🔸 Desktop Menu */}
          <nav className="hidden lg:flex items-center justify-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item}
                to={`/#${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* 🔸 Right Side (Theme + CTA + Mobile Button) */}
          <div className="flex items-center justify-end space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={22} className="text-primary" />
              ) : (
                <Moon size={22} className="text-primary" />
              )}
            </button>

            {/* CTA (hidden on very small screens) */}
            <Link
              to={ctaLink}
              className="hidden lg:flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-primary to-green-600 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all"
            >
              <span>{ctaLabel}</span>
              <MoveRight size={16} />
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
              onClick={() => setMobileMenuOpen((p) => !p)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* 🔸 Mobile Menu (Animated) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-black shadow-lg border-t border-gray-200 dark:border-zinc-800 backdrop-blur-lg"
          >
            <div className="px-5 py-4 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item}
                  to={`/#${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-primary transition-all"
                >
                  {item}
                </Link>
              ))}

              {/* CTA Button */}
              <Link
                to={ctaLink}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-3 bg-gradient-to-r from-primary to-green-600 text-white rounded-lg font-medium mt-3"
              >
                {ctaLabel}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default LandingPageNav;
