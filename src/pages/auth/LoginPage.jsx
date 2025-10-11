import React from "react";
import { ReactUserLogin } from "@neuctra/authix";

const LoginPage = () => {
  const theme = localStorage.getItem("neuctra-dark-mode");
  const isDark = theme === "true" || theme === "dark";

  return (
    <div
      className={`w-full h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark ? "bg-zinc-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <ReactUserLogin
        darkMode={isDark}
        signupUrl={"/signup"}
        logoUrl={isDark ? "/logo-dark.png" : "/logo-light.png"}
      />
    </div>
  );
};

export default LoginPage;
