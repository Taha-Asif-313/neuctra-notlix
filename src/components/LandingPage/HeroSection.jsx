import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  NotebookText,
  Brain,
  Book,
  Lightbulb,
  CalendarCheck,
  PenTool,
  FolderKanban,
} from "lucide-react";
import { Link } from "react-router-dom";

const floatingIcons = [
  { Icon: NotebookText, className: "top-[18%] left-[14%]" },      // slightly raised, balanced left
  { Icon: Lightbulb, className: "top-[18%] right-[16%]" },       // mirrored on right
  { Icon: Book, className: "bottom-[22%] left-[10%]" },          // moved slightly up
  { Icon: FolderKanban, className: "bottom-[20%] right-[11%]" }, // balanced with book
  { Icon: CalendarCheck, className: "top-[46%] left-[7%]" },     // moved a bit inward
  { Icon: PenTool, className: "bottom-[30%] right-[14%]" },      // raised slightly for symmetry
];


const HeroSection = () => {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 sm:px-10 pt-28 pb-24 md:pt-32 md:pb-28 overflow-hidden">
      {/* Glowing gradient background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 via-emerald-400/20 to-primary/20 dark:from-primary/10 dark:via-emerald-300/10 dark:to-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, className }, i) => (
        <motion.div
          key={i}
          className={`absolute ${className} text-primary`}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Icon className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-[0_0_10px_rgba(0,0,0,0.15)]" />
        </motion.div>
      ))}

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
      >
        <Sparkles className="w-4 h-4" />
        Smarter Notes, Powered by AI
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8 }}
        className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl leading-tight"
      >
        Capture Ideas. <br className="hidden sm:block" />
        <span className="text-primary">Collaborate Intelligently.</span>
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl"
      >
        Neuctra Notes combines AI intelligence, collaboration, and
        military-grade encryption — all in a beautifully minimal interface.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
        >
          <NotebookText className="w-5 h-5" />
          Get Started Free
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
        <Link
          to="/notes"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
        >
          <Brain className="w-5 h-5" />
          Try Demo
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
      >
        {[
          { value: "10K+", label: "Active Users" },
          { value: "1M+", label: "Notes Created" },
          { value: "99.99%", label: "Data Uptime" },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="text-3xl font-bold text-primary">
              {stat.value}
            </span>
            <span className="text-gray-600 dark:text-gray-400 mt-1">
              {stat.label}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default HeroSection;
