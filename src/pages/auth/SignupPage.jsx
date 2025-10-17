import React from "react";
import { ReactUserSignUp } from "@neuctra/authix";
import toast, { ToastBar } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getPackage, updatePackage } from "../../authix/authixinit";

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
        onSuccess={async (user) => {
          const userId = user?.id;
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
  );
};

export default SignupPage;
