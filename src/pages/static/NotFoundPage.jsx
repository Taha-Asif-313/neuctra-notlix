import React from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center dark:bg-zinc-950 bg-slate-100 px-6">
      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-xl mx-auto text-center"
      >
        {/* Glow Background */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/20 blur-3xl rounded-full opacity-50" />

        {/* 404 Text */}
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative text-7xl sm:text-8xl font-extrabold text-primary"
        >
          404
        </motion.h1>

        <h2 className="mt-4 text-xl sm:text-2xl font-semibold text-zinc-800 dark:text-white">
          Page Not Found
        </h2>

        <p className="mt-3 text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          The page you’re looking for doesn’t exist or has been moved. Don’t
          worry, let’s get you back on track.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium shadow-lg hover:opacity-90 transition"
          >
            <Home size={18} />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
