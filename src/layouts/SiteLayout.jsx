import React from "react";
import { Outlet } from "react-router-dom";
import LandingPageNav from "../components/LandingPage/LandingPageNav";
import LandingPageFooter from "../components/LandingPage/LandingPageFooter";
import { useAppContext } from "../context/AppContext";

const SiteLayout = () => {
  const { darkMode } = useAppContext();

  return (
    <div
      className={`min-h-screen flex flex-col transition-all duration-500 ${
        darkMode
          ? "bg-zinc-950 text-white"
          : "bg-gradient-to-br from-emerald-50 via-white to-green-50 text-gray-900"
      }`}
    >
      {/* 🌈 Optional Glow Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 dark:bg-primary rounded-full blur-3xl opacity-20 animate-pulse-slow delay-1000"></div>
      </div>

      <LandingPageNav />
      <main className="flex-1 z-10 relative">
        <Outlet />
      </main>
      <LandingPageFooter />
    </div>
  );
};

export default SiteLayout;
