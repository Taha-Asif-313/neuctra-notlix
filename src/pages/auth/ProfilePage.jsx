import React, { useEffect, useState } from "react";
import { ReactUserProfile } from "@neuctra/authix";
import { useNavigate } from "react-router-dom";
import { createPackage, getPackage, authix } from "../../authix/authixinit";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../../context/useAppContext";
import Metadata from "../../MetaData";
import { AlertTriangle } from "lucide-react";
import CustomLoader from "../../components/CustomLoader";
import PlanInfo from "../../components/TextEditor/PlanInfo";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { darkMode, user } = useAppContext();
  const [userPackage, setUserPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  console.log(user);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        console.log("🔄 Starting package fetch...");

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

        console.log("📦 Checking if user already has a package...");
        const res = await getPackage(userId);
        console.log("📦 getPackage() result:", res);

        // 🧩 Create a variable to store package info
        let pkg = res; // ✅ FIXED — declare pkg

        // 🆕 Create Free plan if none found
        if (!pkg) {
          console.log("🆕 No package found — creating default Free plan...");
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
            usage: {
              notesUsed: 0,
              aiPromptsUsed: 0,
            },
            category: "package",
            createdAt: new Date().toISOString(),
          });

          if (pkg) toast.success("Default Free plan activated!");
        } else {
          console.log("📦 Package exists:", pkg);
        }

        // ✅ Format final package data
        const packageData = {
          id: pkg?.id,
          name: pkg?.name || "Free",
          price: pkg?.price || 0,
          period: pkg?.period || pkg?.billingPeriod || "Forever",
          aiPromptsPerMonth: pkg?.aiPromptsPerMonth || 5,
          usage: pkg?.usage || { notesUsed: 0, aiPromptsUsed: 0 },
          features: pkg?.features || [],
        };

        console.log("✅ Final package data:", packageData);
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
  }, [navigate, user]);

  // 🎨 Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, duration: 0.3 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
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
    {/* 🧠 Metadata for SEO & Social */}
<Metadata
  title="Profile – Manage Your Account | Neuctra Notlix"
  description="Manage your Neuctra Notlix profile and account settings with ease. Update your personal details, control preferences, and oversee your AI-powered note workspace — securely and seamlessly."
  keywords="Neuctra profile, Notlix account, manage account, profile settings, subscription management, Neuctra Notes profile, AI notes, secure workspace, account preferences"
  image="https://yourdomain.com/assets/og-profile.png"
  ogTitle="Profile – Manage Your Account | Neuctra Notlix"
  ogDescription="Access and manage your Neuctra Notlix profile, update preferences, and control your AI-powered cloud workspace securely anytime."
  twitterTitle="Profile – Manage Your Account | Neuctra Notlix"
  twitterDescription="View and manage your Neuctra Notlix profile and account settings — secure, smart, and cloud-powered."
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
                className={`w-full text-xs flex gap-2 justify-center items-center text-center py-3 px-4 rounded-lg border shadow-sm ${
                  darkMode
                    ? "bg-red-500/5 border-red-500 text-red-500"
                    : "bg-red-50 border-red-300 text-red-700"
                }`}
              >
                <AlertTriangle size={20} /> Please verify your account
              </motion.div>
            )}
          </AnimatePresence>

          {/* 🌿 Package Info Banner */}
          {isVerified && (
            <AnimatePresence mode="wait">
              {loading ? (
                <CustomLoader message="Profile is loading" />
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
                    {isFreePlan() ? (
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
                        Free Forever
                      </span>
                    ) : (
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
                        (${userPackage.price} / {userPackage.period})
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
              primaryColor="#00d616"
              homeUrl={"/notes"}
              onVerify={() => {
                window.location.reload();
              }}
              onLogout={() => {
                localStorage.clear();
                navigate("/");
                toast.success("Logged out successfully");
              }}
              darkMode={darkMode}
            />
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className={`h-px w-full my-4 max-w-2xl ${
              darkMode
                ? "bg-gradient-to-r from-transparent via-zinc-700 to-transparent"
                : "bg-gradient-to-r from-transparent via-gray-200 to-transparent"
            }`}
          />

          <PlanInfo pkg={userPackage} loading={loading} />
        </motion.div>
      </div>
    </>
  );
};

export default ProfilePage;
