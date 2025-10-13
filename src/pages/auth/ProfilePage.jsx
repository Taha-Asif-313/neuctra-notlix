import React from "react";
import { ReactUserProfile } from "@neuctra/authix";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const theme = localStorage.getItem("neuctra-dark-mode");
  const isDark = theme === "true" || theme === "dark";
  const navigate = useNavigate();
  return (
    <div
      className={`w-full flex items-center justify-center transition-colors duration-300 ${
        isDark ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      <ReactUserProfile
        homeUrl={"/notes"}
        onLogout={() => {
          localStorage.clear();
          navigate("/");
        }}
        darkMode={isDark}
      />
    </div>
  );
};

export default ProfilePage;
