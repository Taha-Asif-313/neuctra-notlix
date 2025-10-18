import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Outlet } from "react-router-dom";

const NotesLayout = ({ darkMode, toggleDarkMode, notes, setNotes }) => {
  return (
    <div
      className={`
    min-h-screen w-full pt-20 flex flex-col transition-colors duration-500
    bg-white dark:bg-black
  `}
    >
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <div className="flex-1">
        <Outlet context={{ notes, setNotes }} />
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
};

export default NotesLayout;
