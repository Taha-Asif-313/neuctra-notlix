import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { ReactSignedOut, ReactUserLogin } from "@neuctra/authix";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/useAppContext";
import Metadata from "../../MetaData";

const LoginPage = () => {
  const navigate = useNavigate();
  const { darkMode } = useAppContext();

  return (
    <ReactSignedOut
      width={"100%"}
      height={"100%"}
      fallback={<Navigate to="/notes" replace />}
    >
      {/* 🧠 Metadata for SEO & Social */}
      <Metadata
        title="Login – Neuctra Notes"
        description="Access your Neuctra Notes account to continue creating, organizing, and collaborating with AI-powered smart notes — secure, fast, and simple."
        keywords="Neuctra login, Neuctra Notes login, sign in, secure note app, AI notes, encrypted notes, collaborative notes"
        image="https://yourdomain.com/assets/og-login.png"
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
            toast.success("Login successfully!");
            navigate("/notes");
          }}
          onError={(err) => {
            toast.error(err.message);
          }}
        />
      </div>
    </ReactSignedOut>
  );
};

export default LoginPage;
