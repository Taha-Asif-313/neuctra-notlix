import React from "react";
import { ReactUserSignUp } from "@neuctra/authix";
import toast, { ToastBar } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const theme = localStorage.getItem("neuctra-dark-mode");
  const isDark = theme === "true" || theme === "dark";

  return (
    <div
      className={`w-full h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark ? "bg-zinc-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <ReactUserSignUp
        darkMode={isDark}
        loginUrl={"/login"}
        logoUrl={isDark ? "/logo-dark.png" : "/logo-white.png"}
        onSuccess={() => {
          toast.success("Register Successfully");
          navigate("/notes");
        }}
        onError={(err) => {
          toast.error(err.message);
        }}
      />
    </div>
  );
};

export default SignupPage;
