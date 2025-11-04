import React from "react";
import HeroSection from "../components/LandingPage/HeroSection";
import FeaturesSection from "../components/LandingPage/FeaturesSection";
import TestimonialsSection from "../components/LandingPage/TestimonialsSection";
import PricingSection from "../components/LandingPage/PricingSection";
import FAQSection from "../components/LandingPage/FaqSection";
import FinalCTA from "../components/LandingPage/CTASection";
import Metadata from "../MetaData";

// 🧩 Lucide Icons
import {
  Lock,
  Brain,
  Globe,
  PenTool,
  GraduationCap,
  Users,
  ShieldCheck,
} from "lucide-react";

const LandingPage = () => {
  return (
    <>
      {/* 🧠 SEO Metadata */}
      <Metadata
        title="Neuctra Notes – AI-Powered Smart Note-Taking & Collaboration"
        description="Neuctra Notes helps creators, teams, and professionals write smarter with AI assistance, collaborate securely, and sync everything across devices — in one modern workspace."
        keywords="Neuctra Notes, AI note app, collaborative workspace, encrypted notes, cloud notes, productivity, team notes"
      />

      <div
        className={`min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950 text-gray-900 dark:text-white transition-all duration-300`}
      >
        {/* Background Glow */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 dark:bg-primary rounded-full blur-3xl opacity-20 animate-pulse-slow delay-1000"></div>
        </div>

        <HeroSection />
        <FeaturesSection />

        {/* 🔥 Why Neuctra Section – SEO + Icon Enhanced */}
        <section
          id="why-neuctra"
          className="py-20 px-6 sm:px-10 bg-white dark:bg-zinc-950"
        >
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Why Choose <span className="text-primary">Neuctra Notes?</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10 text-lg">
              Neuctra Notes isn’t just another note-taking app — it’s an
              intelligent workspace built for clarity, creativity, and privacy.
              Crafted for students, writers, and professionals who value both
              speed and security.
            </p>

            <div className="grid md:grid-cols-3 gap-8 text-left">
              {/* Card 1 */}
              <div className="p-6 rounded-2xl bg-emerald-50/40 dark:bg-zinc-900/40 backdrop-blur border border-emerald-200/10 shadow-md hover:shadow-lg transition-all">
                <Lock className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold text-xl mb-2 text-primary">
                  End-to-End Security
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Every note is encrypted before it leaves your device. Your
                  data stays 100% private — no tracking, no reading, no compromise.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-6 rounded-2xl bg-emerald-50/40 dark:bg-zinc-900/40 backdrop-blur border border-emerald-200/10 shadow-md hover:shadow-lg transition-all">
                <Brain className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold text-xl mb-2 text-primary">
                  Built with AI Intelligence
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Neuctra’s AI helps you write smarter — summarize, outline,
                  and refine content instantly, keeping your tone consistent.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-6 rounded-2xl bg-emerald-50/40 dark:bg-zinc-900/40 backdrop-blur border border-emerald-200/10 shadow-md hover:shadow-lg transition-all">
                <Globe className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold text-xl mb-2 text-primary">
                  Work Anywhere
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Instantly sync across desktop, tablet, and mobile. Keep your
                  notes accessible and secure wherever inspiration strikes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🧩 Use Cases Section */}
        <section
          id="use-cases"
          className="py-20 px-6 sm:px-10 bg-emerald-50/50 dark:bg-zinc-900"
        >
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Perfect for Every <span className="text-primary">Creator</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 text-lg">
              From personal notes to professional documentation — Neuctra adapts
              to your creative flow and helps you work smarter every day.
            </p>

            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="p-6 rounded-2xl bg-white/60 dark:bg-zinc-800/50 shadow-md hover:shadow-lg transition-all border border-emerald-200/10">
                <PenTool className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold text-xl mb-2 text-primary">
                  Writers & Bloggers
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Craft better articles faster with AI-driven grammar, tone, and
                  clarity suggestions that adapt to your writing style.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/60 dark:bg-zinc-800/50 shadow-md hover:shadow-lg transition-all border border-emerald-200/10">
                <GraduationCap className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold text-xl mb-2 text-primary">
                  Students & Researchers
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Capture lectures, summarize long readings, and organize study
                  material with AI summaries and topic grouping.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/60 dark:bg-zinc-800/50 shadow-md hover:shadow-lg transition-all border border-emerald-200/10">
                <Users className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold text-xl mb-2 text-primary">
                  Teams & Professionals
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Collaborate in real time, share notes securely, and assign
                  tasks with context — all in one encrypted workspace.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ Optional Extra Trust Section */}
        <section className="py-16 bg-white dark:bg-zinc-950 border-t border-zinc-200/10 text-center">
          <div className="max-w-5xl mx-auto px-6">
            <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-3">
              Trusted by Modern Thinkers
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Neuctra Notes empowers creators, startups, and educators to
              capture ideas securely, work together seamlessly, and focus on what matters most.
            </p>
          </div>
        </section>

        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <FinalCTA />
      </div>
    </>
  );
};

export default LandingPage;
