import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";
import CustomLoader from "./CustomLoader";

const AIModal = ({
  show,
  onClose,
  aiPrompt,
  setAiPrompt,
  quickPrompts,
  handleAIGenerate,
  loading,
}) => {
    
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col justify-end"
        >
          {/* Overlay */}
          <div
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 22 }}
            className="relative w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border-t border-gray-200/50 dark:border-zinc-700/50 shadow-2xl rounded-t-3xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/60 dark:border-zinc-700/60">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-green-500 shadow-md">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    AI Note Assistant
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Generate ideas, summaries, or outlines instantly.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Prompt Input */}
            <div className="p-6 flex-1 max-h-80 overflow-y-auto">
              <textarea
                rows={4}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ask AI to write meeting notes, summaries, ideas..."
                className="w-full p-4 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/70 outline-none resize-none text-sm sm:text-base focus:ring-2 focus:ring-amber-500 transition"
              />

              {/* Quick Prompts */}
              <div className="mt-6">
                <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                  Quick Prompts
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt.key}
                      onClick={() => setAiPrompt(prompt.value)}
                      className="p-3 text-left text-sm rounded-xl bg-gray-100/70 dark:bg-zinc-800/70 hover:bg-amber-100/60 dark:hover:bg-amber-500/10 transition border border-transparent hover:border-amber-300 dark:hover:border-amber-500"
                    >
                      {prompt.key
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-200 dark:border-zinc-700 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-4 rounded-xl border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAIGenerate}
                  disabled={loading || !aiPrompt.trim()}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" /> Generate with AI
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIModal;
