import React from "react";
import {
  Loader2,
  Check,
  Crown,
  Zap,
  FileText,
  Calendar,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

/**
 * 🚀 ModernPlanInfo (Landscape Layout)
 * Two-column layout — left for plan info, right for usage stats
 */
const PlanInfo = ({ pkg, loading = false, onUsageUpdate, className = "" }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Loading your plan...
          </p>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Active Plan
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
          Get started with a plan to unlock all features
        </p>
      </div>
    );
  }

  const isPro =
    pkg?.name?.toLowerCase().includes("pro") ||
    pkg?.name?.toLowerCase().includes("premium");
  const notesUsed = pkg?.usage?.notesUsed || 0;
  const notesLimit = pkg?.notesLimit || 100;
  const aiPromptsUsed = pkg?.usage?.aiPromptsUsed || 0;
  const aiPromptsLimit = pkg?.aiPromptsPerMonth || 5;

  const notesPercentage = Math.min((notesUsed / notesLimit) * 100, 100);
  const aiPromptsPercentage = Math.min((aiPromptsUsed / aiPromptsLimit) * 100, 100);

  return (
    <div
      className={`flex w-full flex-col lg:flex-row gap-10 bg-gradient-to-br from-white to-gray-50 dark:from-zinc-950 dark:to-black rounded-3xl p-8 shadow-xl border border-gray-200/60 dark:border-zinc-700/50 backdrop-blur-sm ${className}`}
    >
      {/* LEFT SIDE — Plan Overview & Features */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {isPro && (
                <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  <Crown className="w-3 h-3" />
                  PRO
                </div>
              )}
              <span className="text-sm font-medium text-primary/80 bg-primary/10 px-2 py-1 rounded-md">
                {pkg?.period === "Forever" ? "Lifetime" : pkg?.period}
              </span>
            </div>
            {isPro && <Sparkles className="w-6 h-6 text-amber-500" />}
          </div>

          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {pkg?.name || "Free"} Plan
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {pkg?.period === "Forever"
              ? "Free forever — enjoy your basic access"
              : `Billed ${pkg.period.toLowerCase()}`}
          </p>
        </div>

        {/* Features */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            What's Included
          </h3>
          <ul className="space-y-2">
            {pkg?.features?.map((feature, index) => (
              <li
                key={index}
                className="flex items-center gap-3 text-gray-700 dark:text-gray-300 group"
              >
                <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                </div>
                <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RIGHT SIDE — Usage Stats & Actions */}
      <div className="flex-1 flex flex-col justify-between bg-white/60 dark:bg-zinc-800/40 p-6 rounded-2xl backdrop-blur-sm border border-gray-100 dark:border-zinc-700">
        {/* Usage */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Monthly Usage
          </h3>

          {/* Notes Usage */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <FileText className="w-4 h-4" />
                <span>Notes</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {notesUsed}/{notesLimit}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${notesPercentage}%` }}
              />
            </div>
          </div>

          {/* AI Prompts Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Zap className="w-4 h-4" />
                <span>AI Prompts</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {aiPromptsUsed}/{aiPromptsLimit}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${aiPromptsPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        {onUsageUpdate && (
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-zinc-700">
            <button
              onClick={() => onUsageUpdate("note")}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95"
            >
              <FileText className="w-4 h-4" />
              Add Note
            </button>
            <button
              onClick={() => onUsageUpdate("ai")}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 active:scale-95"
            >
              <Zap className="w-4 h-4" />
              Use AI
            </button>
          </div>
        )}

        {/* Upgrade Banner */}
        {!isPro && (
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl border border-amber-200 dark:border-amber-800/50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                  Ready for more?
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                  Upgrade to unlock premium features
                </p>
              </div>
              <button className="flex items-center gap-1 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors">
                Upgrade
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanInfo;
