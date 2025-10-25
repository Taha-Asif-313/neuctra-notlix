import React, { useEffect } from "react";
import { ReactUserSignUp } from "@neuctra/authix";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getPackage, updatePackage } from "../../authix/authixinit";
import { useAppContext } from "../../context/useAppContext";
import Metadata from "../../MetaData";

const SignupPage = () => {
  const navigate = useNavigate();
  const { darkMode, user } = useAppContext();

  // 🧭 Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/notes");
  }, [user, navigate]);

  return (
    <>
 {/* 🧠 Metadata for SEO & Social */}
<Metadata
  title="Sign Up – Neuctra Notlix | Create Your AI-Powered Cloud Notes Account"
  description="Join Neuctra Notlix today — the AI-powered cloud note platform for creating, organizing, and collaborating effortlessly. Sign up for free and sync your ideas anywhere, anytime."
  keywords="Neuctra signup, Notlix register, create account, AI note app, cloud notes, collaborative notes, free note taking, Neuctra Notes, smart workspace"
  image="https://yourdomain.com/assets/og-signup.png"
  ogTitle="Sign Up for Neuctra Notlix | AI-Powered Cloud Notes"
  ogDescription="Create your Neuctra Notlix account to start writing, collaborating, and organizing smarter with AI-driven cloud notes."
  twitterTitle="Sign Up – Neuctra Notlix"
  twitterDescription="Join Neuctra Notlix — the AI-powered cloud note app for creativity, collaboration, and productivity. Sign up free today."
/>


      <div
        className={`w-full min-h-screen py-20 flex items-center justify-center transition-colors duration-300 ${
          darkMode ? "bg-black text-white" : "bg-white text-gray-900"
        }`}
      >
        <ReactUserSignUp
          darkMode={darkMode}
          loginUrl={"/login"}
          logoUrl={darkMode ? "/logo-dark.png" : "/logo-white.png"}
          onSuccess={async (user) => {
            const userId = user?.id;


            toast.success("Registered successfully! Free plan activated.");
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

export default SignupPage;
