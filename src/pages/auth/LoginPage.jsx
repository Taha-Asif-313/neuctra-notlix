import React from "react";
import toast from "react-hot-toast";
import { ReactUserLogin } from "@neuctra/authix";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/useAppContext";
import Metadata from "../../MetaData";

const LoginPage = () => {
  const navigate = useNavigate();
  const { darkMode } = useAppContext();

  return (
    <>
      {/* 🧠 Metadata for SEO & Social */}
      <Metadata
        title="Login – Neuctra Notes"
        description="Access your Neuctra Notes account to continue creating, organizing, and collaborating with AI-powered smart notes — secure, fast, and simple."
        keywords="Neuctra login, Neuctra Notes login, sign in, secure note app, AI notes, encrypted notes, collaborative notes"
        image="https://yourdomain.com/assets/og-login.png" // 🔗 Replace with your actual Open Graph image URL
      />
    <div
      className={`w-full h-screen flex items-center justify-center transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      <ReactUserLogin
        darkMode={darkMode}
        signupUrl={"/signup"}
        logoUrl={darkMode ? "/logo-dark.png" : "/logo-white.png"}
        onSuccess={async (user) => {
          toast.success("Login Successfully");
          navigate("/notes");
        }}
        onError={(err) => {
          toast.error(err.message);
        }}
      />
    </div>
    </>
  );
};

export default LoginPage;
