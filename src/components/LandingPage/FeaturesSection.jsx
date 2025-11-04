import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Zap,
  Shield,
  Palette,
  Search,
  Users,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: <Brain className="w-12 h-12 text-primary drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />,
    title: "AI-Powered Insights",
    description:
      "Leverage adaptive AI to enhance your writing with context-aware suggestions and seamless improvements.",
    highlights: ["Smart suggestions", "Auto-completion", "Style analysis"],
    color: "from-primary/10 to-emerald-400/10",
  },
  {
    icon: <Zap className="w-12 h-12 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />,
    title: "Lightning-Fast Sync",
    description:
      "Instantly sync notes across all your devices — optimized for speed, offline support, and reliability.",
    highlights: ["Real-time sync", "Offline access", "Quick search"],
    color: "from-amber-400/10 to-orange-500/10",
  },
  {
    icon: <Shield className="w-12 h-12 text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]" />,
    title: "Military-Grade Security",
    description:
      "Your privacy is protected with AES-256 encryption and zero-knowledge architecture.",
    highlights: ["End-to-end encryption", "2FA security", "Privacy first"],
    color: "from-green-500/10 to-emerald-600/10",
  },
  {
    icon: <Palette className="w-12 h-12 text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.6)]" />,
    title: "Beautiful Customization",
    description:
      "Express yourself with personalized themes, fonts, and layouts that inspire clarity and creativity.",
    highlights: ["Multiple themes", "Custom fonts", "Flexible layouts"],
    color: "from-pink-500/10 to-rose-500/10",
  },
  {
    icon: <Search className="w-12 h-12 text-sky-500 drop-shadow-[0_0_10px_rgba(56,189,248,0.6)]" />,
    title: "Smart Search & Organization",
    description:
      "Find anything instantly with AI-driven contextual search and intelligent note grouping.",
    highlights: ["AI search", "Smart tags", "Quick filters"],
    color: "from-blue-500/10 to-cyan-500/10",
  },
  {
    icon: <Users className="w-12 h-12 text-indigo-500 drop-shadow-[0_0_10px_rgba(99,102,241,0.6)]" />,
    title: "Collaborative Editing",
    description:
      "Co-create effortlessly with live collaboration, inline comments, and real-time version tracking.",
    highlights: ["Real-time collab", "Comments", "Version history"],
    color: "from-indigo-500/10 to-purple-500/10",
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative py-24 px-6 sm:px-10 bg-gradient-to-b from-white via-primary/5 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 transition-colors">
      <div className="max-w-6xl mx-auto text-center">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl font-extrabold mb-6"
        >
          Intelligent Tools for Modern Creators
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-14 text-base sm:text-lg"
        >
          Designed for focus, collaboration, and creativity — every Neuctra feature is crafted for
          a seamless, inspiring writing experience.
        </motion.p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              viewport={{ once: true }}
              className={`p-8 rounded-3xl border border-white/10 dark:border-zinc-800 bg-gradient-to-br ${feature.color} backdrop-blur-xl shadow-md hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.6 } }}
                  className="mb-5"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  {feature.description}
                </p>
             
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
