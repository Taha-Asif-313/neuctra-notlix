import React from "react";
import { ReactUserProfile } from "@neuctra/authix";

const ProfilePage = () => {
  const theme = localStorage.getItem("neuctra-dark-mode");
  const isDark = theme === "true" || theme === "dark";

  return (
    <div
      className={`w-full h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark ? "bg-zinc-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <ReactUserProfile darkMode={isDark} />
    </div>
  );
};

export default ProfilePage;
