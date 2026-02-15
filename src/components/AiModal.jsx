import React, { useEffect } from "react";
import { X, Send, Sparkles } from "lucide-react";

const AIModal = ({
  show,
  onClose,
  aiPrompt,
  setAiPrompt,
  quickPrompts,
  handleAIGenerate,
  loading,
}) => {
  // Prevent body scroll when drawer open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  return (
    <div
      className={`fixed inset-0 z-50 ${
        show ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
          show ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        className={`absolute bottom-0 left-0 w-full bg-white dark:bg-zinc-900 
        rounded-t-3xl shadow-xl border-t border-gray-200 dark:border-zinc-700
        transform transition-transform duration-300 ease-out
        ${show ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-zinc-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-green-500">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                AI Note Assistant
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Generate ideas instantly
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          <textarea
            rows={4}
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Ask AI to write notes, summaries..."
            className="w-full p-3 rounded-xl border border-gray-200 
            dark:border-zinc-700 bg-white dark:bg-zinc-800 
            outline-none resize-none text-sm focus:ring-2 focus:ring-amber-500"
          />

          {/* Quick Prompts */}
          <div className="mt-5">
            <h3 className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Quick Prompts
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt.key}
                  onClick={() => setAiPrompt(prompt.value)}
                  className="p-2 text-xs text-left rounded-lg 
                  bg-gray-100 dark:bg-zinc-800 
                  hover:bg-gray-200 dark:hover:bg-zinc-700"
                >
                  {prompt.key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-200 dark:border-zinc-700">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg border border-gray-300 
              dark:border-zinc-600 text-sm"
            >
              Cancel
            </button>

            <button
              onClick={handleAIGenerate}
              disabled={loading || !aiPrompt.trim()}
              className="flex-1 flex items-center justify-center gap-2 
              py-3 rounded-lg bg-amber-500 text-white text-sm 
              disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModal;
