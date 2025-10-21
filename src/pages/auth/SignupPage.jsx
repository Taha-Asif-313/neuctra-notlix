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
        title="Sign Up – Neuctra Notes"
        description="Create your Neuctra Notes account to start writing, organizing, and collaborating with smart AI-powered notes. Join for free and sync your ideas anywhere."
        keywords="Neuctra signup, create account, Neuctra Notes, register, AI note app, free note taking, collaborative notes"
        image="https://yourdomain.com/assets/og-signup.png"
      />

      <div
        className={`w-full h-screen flex items-center justify-center transition-colors duration-300 ${
          darkMode ? "bg-black text-white" : "bg-white text-gray-900"
        }`}
      >
        <ReactUserSignUp
          darkMode={darkMode}
          loginUrl={"/login"}
          logoUrl={darkMode ? "/logo-dark.png" : "/logo-white.png"}
          onSuccess={async (user) => {
            const userId = user?.id;

            // ⚙️ Activate default free plan
            await updatePackage(userId, {
              name: "Free",
              tier: "starter",
              price: 0,
              aiPromptsPerMonth: 5,
              collaborativeLinks: true,
              features: [
                "Up to 100 notes",
                "Basic AI prompts (5/month)",
                "Collaborative note links",
                "Sync across devices",
              ],
              createdAt: new Date().toISOString(),
            });

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
