import React, { useEffect, useState } from "react";
import { ReactUserProfile } from "@neuctra/authix";
import { useNavigate } from "react-router-dom";
import { createPackage, checkPackage } from "../../authix/authixinit";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../../context/useAppContext";
import Metadata from "../../MetaData";
import { AlertTriangle } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { darkMode } = useAppContext();
  const [userPackage, setUserPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
useEffect(() => {
  const fetchPackage = async () => {
    try {
      console.log("🔄 Starting package fetch...");

      const storedUser = JSON.parse(localStorage.getItem("userInfo"));
      console.log("📋 Stored user:", storedUser);

      const user = storedUser?.user || storedUser;
      const userId = user?.id;

      if (!userId) {
        toast.error("User not found. Please log in again.");
        navigate("/login");
        return;
      }

      // ✅ Check user verification
      const verified = user?.verified || user?.isVerified || false;
      setIsVerified(verified);

      if (!verified) {
        console.warn("⚠️ User not verified.");
        setLoading(false);
        return;
      }

      console.log("🧩 Checking if user already has a package...");
      const hasPackage = await checkPackage(userId);

      let pkg = null;

      if (!hasPackage) {
        console.log("⚙️ No package found — creating default starter plan...");
        pkg = await createPackage(userId, {
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
          category: "package",
          createdAt: new Date().toISOString(),
        });

        if (pkg) toast.success("🎉 Default Free plan activated!");
      } else {
        console.log("📦 Package exists — fetching current plan...");
       
      }

      // ✅ Format final package data
      const packageData = {
        name: pkg?.name || "Free",
        price: pkg?.price || 0,
        period: pkg?.period || pkg?.billingPeriod || "Forever",
      };

      console.log("🎯 Final package data:", packageData);
      setUserPackage(packageData);
    } catch (err) {
      console.error("❌ Package fetch error:", err);
      toast.error("Failed to load package info.");
      setUserPackage({ name: "Free", price: "0", period: "Forever" });
    } finally {
      setLoading(false);
    }
  };

  fetchPackage();
}, [navigate]);


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const isFreePlan = () => {
    if (!userPackage) return true;
    const planName = userPackage.name?.toLowerCase() || "";
    const price = userPackage.price?.toString() || "0";
    return planName.includes("free") || price === "0" || price === "0.00";
  };

  return (
    <>
      {/* 🧠 Dynamic Metadata for SEO */}
      <Metadata
        title="Profile – Manage Your Account | Neuctra Notes"
        description="View and manage your Neuctra Notes profile, subscription plan, and account settings. Update your information and securely control your preferences anytime."
        keywords="Neuctra profile, account settings, manage plan, AI notes account, subscription management, secure profile, Neuctra Notes"
        image="https://yourdomain.com/assets/og-profile.png"
      />

      <div
        className={`min-h-screen p-4 w-full flex items-center justify-center transition-colors duration-500 ${
          darkMode
            ? "bg-black text-white"
            : "bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900"
        }`}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-6xl flex flex-col items-center"
        >
          {/* 🚨 Banner: Unverified User */}
          <AnimatePresence>
            {!isVerified && !loading && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`w-full text-sm flex gap-2 justify-center items-center text-center py-3 px-4 rounded-lg border shadow-sm ${
                  darkMode
                    ? "bg-red-500/5 border-red-500 text-red-500"
                    : "bg-red-50 border-red-300 text-red-700"
                }`}
              >
                <AlertTriangle size={20}/> Please verify your account to access your plan and features.
              </motion.div>
            )}
          </AnimatePresence>

          {/* 🌿 Package Info Banner (only if verified) */}
          {isVerified && (
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full flex items-center justify-center py-3"
                >
                  <div className="flex items-center space-x-3 text-sm">
                    <div
                      className={`w-4 h-4 border-2 rounded-full animate-spin ${
                        darkMode
                          ? "border-green-700 border-t-white"
                          : "border-green-300 border-t-green-600"
                      }`}
                    />
                    <p
                      className={`${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Loading your plan...
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="package-banner"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`w-full rounded-lg px-3 sm:px-6 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border shadow-sm text-xs sm:text-sm md:text-base 
              ${
                darkMode
                  ? "bg-gradient-to-r from-green-950 via-green-900 to-emerald-900 border-green-800 text-emerald-100"
                  : "bg-gradient-to-r from-emerald-50 via-green-50 to-lime-50 border-emerald-200 text-emerald-800"
              }`}
                >
                  {/* Left Side — Plan Info */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-3 text-center sm:text-left">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap ${
                        isFreePlan()
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-green-600 text-white"
                      }`}
                    >
                      {userPackage?.name || "Free"}
                    </span>
                    <span className="whitespace-nowrap">
                      {isFreePlan()
                        ? "You’re using the Free plan."
                        : "You have an active plan."}
                    </span>
                    {userPackage?.price &&
                    userPackage.price !== "0" &&
                    userPackage.price !== "0.00" ? (
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
                        (${userPackage.price} / {userPackage.period})
                      </span>
                    ) : (
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
                        Free Forever
                      </span>
                    )}
                  </div>

                  {/* Right Side — Action */}
                  <div className="flex items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
                    {isFreePlan() ? (
                      <button
                        onClick={() => navigate("/#pricing")}
                        className="px-4 py-1 rounded-md bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:opacity-90 transition-all text-xs sm:text-sm"
                      >
                        Upgrade
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate("/pricing")}
                        className={`px-4 py-1 rounded-md border transition-colors text-xs sm:text-sm ${
                          darkMode
                            ? "border-green-700 text-green-300 hover:bg-green-950"
                            : "border-green-300 text-green-700 hover:bg-green-100"
                        }`}
                      >
                        Manage
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className={`h-px w-full my-4 max-w-2xl ${
              darkMode
                ? "bg-gradient-to-r from-transparent via-zinc-700 to-transparent"
                : "bg-gradient-to-r from-transparent via-gray-200 to-transparent"
            }`}
          />

          {/* Profile Section */}
          <motion.div variants={itemVariants} className="w-full">
            <ReactUserProfile
              primaryColor="var(--primary)"
              homeUrl={"/notes"}
              onLogout={() => {
                localStorage.clear();
                navigate("/");
                toast.success("Logged out successfully");
              }}
              darkMode={darkMode}
            />
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default ProfilePage;
