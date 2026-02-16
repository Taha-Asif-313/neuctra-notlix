import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Menu, X, Plus, BookOpen } from "lucide-react";
import { ReactSignedIn, ReactUserButton } from "@neuctra/authix";
import { useAppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const location = useLocation();
  const { darkMode, toggleTheme, logoutUser } = useAppContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  const navItems = [
    { path: "/notes", label: "Notes", icon: BookOpen },
    { path: "/note/create", label: "New Note", icon: Plus },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-zinc-800">
      <motion.div
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between"
      >
        {/* Logo */}
        <Link to="/notes" className="flex items-center gap-1">
          <img
            src="/logo-dark.png"
            alt="Neuctra Notes"
            className="h-10 w-10 object-cover"
          />

     <span className="flex flex-col">
  <span className="text-[11px] font-medium text-primary">
    Neuctra
  </span>
  <span className="text-xl leading-4 font-black text-black/70 dark:text-white">
    Notlix
  </span>
</span>

        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition ${
                  active
                    ? "bg-primary text-white"
                    : "text-gray-600 dark:text-gray-300 hover:text-primary"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="h-5 w-px bg-gray-300 dark:bg-zinc-700 mx-2" />

          {/* Theme */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
          >
            {darkMode ? (
              <Sun size={18} className="text-primary" />
            ) : (
              <Moon size={18} className="text-primary" />
            )}
          </button>

          {/* User */}
          <ReactSignedIn>
            <ReactUserButton
              darkMode={darkMode}
              profileUrl="/notes/profile"
              onLogout={logoutUser}
            />
          </ReactSignedIn>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggleTheme}>
            {darkMode ? (
              <Sun size={18} className="text-primary" />
            ) : (
              <Moon size={18} className="text-primary" />
            )}
          </button>

          <button onClick={toggleDrawer}>
            {isDrawerOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleDrawer}
            />

            <motion.div
              className="fixed top-0 right-0 w-72 h-full bg-white dark:bg-zinc-950 border-l border-gray-200 dark:border-zinc-800 shadow-xl z-50 p-6 space-y-4"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={toggleDrawer}
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-primary"
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
