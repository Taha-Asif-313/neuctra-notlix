import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-24 px-6 bg-black text-white">
      {/* Soft glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Icon + Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-10 flex flex-col items-center"
        >
          <Sparkles className="w-10 h-10 mb-4 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
            Start Writing Smarter with{" "}
            <span className="text-primary drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]">
              Neuctra AI
            </span>
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Transform your thoughts into clear, creative, and intelligent writing — all powered by Neuctra AI.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex group flex-col sm:flex-row justify-center items-center gap-4 mt-10"
        >
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-3 rounded-full font-semibold text-lg bg-primary shadow-lg cursor-pointer hover:shadow-primary/30 transition-all flex items-center gap-2"
          >
            Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>

          <button
            onClick={() => navigate("/pricing")}
            className="px-8 py-3 rounded-full font-semibold text-lg border-2 border-white/70 text-white hover:bg-white/10 hover:border-white transition-all"
          >
            View Plans
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
