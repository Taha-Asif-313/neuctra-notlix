import React from "react";
import toast from "react-hot-toast";
import { ReactUserLogin } from "@neuctra/authix";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
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
        logoUrl={isDark ? "/logo-dark.png" : "/logo-white.png"}
        onSuccess={() => {
          toast.success("Login Successfully");
          navigate("/notes");
        }}
        onError={(err) => {
          toast.error(err.message);
        }}
      />
    </div>
  );
};

export default LoginPage;
