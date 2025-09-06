import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Outlet } from "react-router-dom";

const NotesLayout = ({ darkMode, toggleDarkMode , notes, setNotes }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-black dark:to-black transition-colors duration-300 flex flex-col">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="flex-1 py-6 px-4">
      <Outlet context={{ notes, setNotes }} />

      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
};

export default NotesLayout;
