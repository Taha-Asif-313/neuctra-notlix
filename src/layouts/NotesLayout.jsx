import React from "react";

import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const NotesLayout = ({ darkMode, toggleDarkMode, notes, setNotes }) => {
  return (
    <div
      className={`min-h-screen w-full pt-20 flex flex-col transition-colors duration-500 ${
        darkMode ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-1">
        <Outlet context={{ notes, setNotes }} />
      </main>
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default NotesLayout;
