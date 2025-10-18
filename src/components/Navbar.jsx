import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Moon,
  Sun,
  Menu,
  X,
  Plus,
  BookHeart,
  Home,
  User,
  BookOpen,
} from "lucide-react";
import { ReactSignedIn, ReactUserButton } from "@neuctra/authix";
import { useAppContext } from "../context/useAppContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const location = useLocation();
  const { darkMode, toggleTheme } = useAppContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isActive = (path) => location.pathname === path;
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  const navItems = [
    { path: "/notes", label: "Notes", icon: BookOpen },
    { path: "/notes/create", label: "New Note", icon: Plus },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black shadow shadow-gray-200 dark:shadow-zinc-900`}
    >
      {/* Main Navigation Bar */}
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 transition-all duration-300 `}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="relative">
                <img
                  src={"/logo-dark.png"}
                  alt="Neuctra Notes"
                  className="h-10 w-10 object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-primary leading-3">
                Neuctra
              </span>
              <span className="text-lg dark:text-white text-black font-bold leading-3">
                Notexa
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.path}
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                >
                  <Link
                    to={item.path}
                    className={`relative px-4 py-2.5 rounded-t-xl text-xs font-medium flex items-center gap-2 transition-all duration-200 group ${
                      isActive(item.path)
                        ? "text-white bg-primary shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                    }`}
                  >
                    <Icon
                      size={15}
                      className={`transition-colors duration-200 ${
                        isActive(item.path)
                          ? "text-white"
                          : "text-gray-500 dark:text-gray-400 group-hover:text-primary"
                      }`}
                    />
                    {item.label}

                    {isActive(item.path) && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-[2px] w-full bg-white/70 dark:bg-primary rounded-full"
                        layoutId="activeIndicator"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="m-2.5 rounded-xl transition-all duration-200 shadow-sm ml-2"
              aria-label="Toggle dark mode"
            >
              <motion.div
                initial={false}
                animate={{ rotate: darkMode ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {darkMode ? (
                  <Sun size={20} className="text-primary" />
                ) : (
                  <Moon size={20} className="text-primary" />
                )}
              </motion.div>
            </motion.button>

            {/* User Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="ml-2"
            >
              <ReactSignedIn>
                <ReactUserButton
                  darkMode={darkMode}
                  profileUrl="/notes/profile"
                  onLogout={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                />
              </ReactSignedIn>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Theme Toggle Mobile */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={18} className="text-primary" />
              ) : (
                <Moon size={18} className="text-primary" />
              )}
            </motion.button>

            {/* User Button Mobile */}
            <ReactSignedIn>
              <ReactUserButton
                darkMode={darkMode}
                profileUrl="/profile"
                onLogout={() => {
                  localStorage.removeItem("neuctra-dark-mode");
                  localStorage.removeItem("neuctra-notes");
                  localStorage.removeItem("theme");
                  localStorage.removeItem("userInfo");
                }}
              />
            </ReactSignedIn>

            {/* Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDrawer}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleDrawer}
            />

            {/* Drawer Panel */}
            <motion.div
              className="fixed top-0 right-0 w-80 h-full bg-white dark:bg-zinc-950 border-l border-gray-200 dark:border-zinc-800 shadow-2xl z-50 flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img
                      src="/logo-dark.png"
                      alt="Logo"
                      className="h-12 w-12 object-cover rounded-xl shadow-lg"
                    />
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        Neuctra
                      </span>
                      <span className="text-sm font-semibold text-primary">
                        Notexa
                      </span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleDrawer}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all duration-200"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 p-6 space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        onClick={toggleDrawer}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                          isActive(item.path)
                            ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <Icon
                          size={20}
                          className={isActive(item.path) ? "text-primary" : ""}
                        />
                        <span className="font-medium">{item.label}</span>
                        {isActive(item.path) && (
                          <motion.div
                            className="w-2 h-2 bg-primary rounded-full ml-auto"
                            layoutId="mobileActiveIndicator"
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Theme Toggle in Drawer */}
                <motion.button
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => {
                    toggleTheme();
                    toggleDrawer();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-200"
                >
                  {darkMode ? (
                    <>
                      <Sun size={20} className="text-amber-500" />
                      <span className="font-medium">Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon size={20} className="text-indigo-600" />
                      <span className="font-medium">Dark Mode</span>
                    </>
                  )}
                </motion.button>
              </nav>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-zinc-800">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <ReactSignedIn>
                    <ReactUserButton
                      darkMode={darkMode}
                      profileUrl="/profile"
                    />
                  </ReactSignedIn>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
