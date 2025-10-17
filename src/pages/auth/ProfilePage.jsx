import React, { useEffect, useState } from "react";
import { ReactUserProfile } from "@neuctra/authix";
import { useNavigate } from "react-router-dom";
import { getPackage } from "../../authix/authixinit";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const ProfilePage = () => {
  const theme = localStorage.getItem("neuctra-dark-mode");
  const isDark = theme === "true" || theme === "dark";
  const navigate = useNavigate();

  const [userPackage, setUserPackage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        console.log("🔄 Starting package fetch...");
        
        const storedUser = JSON.parse(localStorage.getItem("userInfo"));
        console.log("📋 Stored user:", storedUser);
        
        const userId = storedUser?.id || storedUser?.user?.id;
        console.log("👤 User ID:", userId);

        if (!userId) {
          toast.error("User not found. Please log in again.");
          navigate("/login");
          return;
        }

        console.log("📦 Fetching package for user:", userId);
        const pkg = await getPackage(userId);
        console.log("📦 Package data received:", pkg);

        // Handle different possible package data structures
        let packageData = { name: "Free", price: "0", period: "Forever" };
        
        if (pkg) {
          if (typeof pkg === 'string') {
            packageData.name = pkg;
          } else if (pkg.name || pkg.packageName || pkg.plan) {
            packageData = {
              name: pkg.name || pkg.packageName || pkg.plan || "Free",
              price: pkg.price || pkg.amount || "0",
              period: pkg.period || pkg.billingPeriod || "Forever"
            };
          }
        }

        console.log("🎯 Final package data:", packageData);
        setUserPackage(packageData);
        
      } catch (err) {
        console.error("❌ Package fetch error:", err);
        toast.error("Failed to load package info.");
        // Set default package on error
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
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Helper function to check if user is on free plan
  const isFreePlan = () => {
    if (!userPackage) return true;
    
    const planName = userPackage.name?.toLowerCase() || "";
    const price = userPackage.price?.toString() || "0";
    
    return planName.includes("free") || price === "0" || price === "0.00";
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center transition-colors duration-500 ${
        isDark 
          ? "bg-gradient-to-br from-gray-900 to-black text-white" 
          : "bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900"
      }`}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-4xl flex flex-col items-center space-y-8 px-6 py-12"
      >
        {/* Profile Section */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-2xl"
        >
          <ReactUserProfile
            homeUrl={"/notes"}
            onLogout={() => {
              localStorage.clear();
              navigate("/");
              toast.success("Logged out successfully");
            }}
            darkMode={isDark}
          />
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className={`h-px w-full max-w-2xl ${
            isDark ? "bg-gradient-to-r from-transparent via-zinc-700 to-transparent" : "bg-gradient-to-r from-transparent via-gray-200 to-transparent"
          }`}
        />

        {/* Package Section */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl flex flex-col items-center justify-center text-center py-10"
            >
              <div className="flex flex-col items-center space-y-4">
                <div
                  className={`w-8 h-8 border-3 rounded-full animate-spin ${
                    isDark
                      ? "border-zinc-600 border-t-white"
                      : "border-gray-300 border-t-blue-500"
                  }`}
                />
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Loading your plan...
                </p>
              </div>
            </motion.div>
          ) : (
            <div
              key="package-banner"
            
              className={`w-full max-w-2xl relative rounded-3xl shadow-lg border transition-all duration-300 overflow-hidden ${
                isDark
                  ? "bg-gradient-to-r from-zinc-900 to-zinc-800 border-zinc-700 text-white"
                  : "bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-gray-200 text-gray-900"
              }`}
            >
              {/* Decorative Gradient Blur */}
              <div
                className="absolute inset-0 opacity-30 blur-3xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at top left, #60a5fa, transparent 70%), radial-gradient(circle at bottom right, #c084fc, transparent 70%)",
                }}
              />

              {/* Debug info - remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <div className="absolute top-2 right-2 text-xs bg-red-500 text-white px-2 py-1 rounded opacity-70">
                  Debug: {JSON.stringify(userPackage)}
                </div>
              )}

              {/* Main Banner Content */}
              <div className="relative z-10 px-6 sm:px-10 py-10 sm:py-14 flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
                {/* Left Side: Plan Info */}
                <div className="flex-1 space-y-3">
                  <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Your Current Plan
                  </h2>
                  <p
                    className={`text-sm sm:text-base ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Manage or upgrade your subscription anytime
                  </p>

                  <div className="mt-4 sm:mt-6 space-y-2">
                    <div className="text-5xl font-extrabold text-primary">
                      {userPackage?.name || "Free"}
                    </div>
                    <div
                      className={`text-lg font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {userPackage?.price && userPackage.price !== "0" && userPackage.price !== "0.00"
                        ? `$${userPackage.price} / ${userPackage.period}`
                        : "Free Forever"}
                    </div>
                  </div>
                </div>

                {/* Right Side: Actions */}
                <div className="flex flex-col items-center sm:items-end gap-3">
                  {/* Upgrade Button for Free Users */}
                  {isFreePlan() ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate("/pricing")}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>Upgrade to Pro</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    </motion.button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="px-5 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-500 font-medium text-sm">
                        ✓ Active Plan
                      </div>
                      <button
                        onClick={() => navigate("/pricing")}
                        className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
                          isDark 
                            ? "border-zinc-600 text-zinc-300 hover:bg-zinc-800" 
                            : "border-gray-300 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        Manage Subscription
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ProfilePage;