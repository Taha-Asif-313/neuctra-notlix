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
        title="Login – Neuctra Notlix | Smart Cloud Notes with AI Collaboration"
        description="Sign in to Neuctra Notlix — your AI-powered cloud workspace for effortless note creation, real-time collaboration, and secure organization in the cloud. Fast, reliable, and beautifully simple."
        keywords="Neuctra login, Notlix login, AI notes app, cloud note platform, collaborative notes, secure workspace, Neuctra cloud, AI productivity tool, note creation app"
        ogTitle="Login to Neuctra Notlix | AI-Powered Cloud Notes"
        ogDescription="Access your Neuctra Notlix account to collaborate, create, and organize smarter with AI-driven cloud notes — built for speed and security."
        twitterTitle="Login – Neuctra Notlix"
        twitterDescription="Sign in to Neuctra Notlix, the next-gen AI note platform for collaboration and creativity in the cloud."
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
