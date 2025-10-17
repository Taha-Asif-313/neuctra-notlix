// pages/LandingPage.jsx
import { useAppContext } from "../context/useAppContext";
import LandingPageNav from "../components/LandingPage/LandingPageNav";
import LandingPageFooter from "../components/LandingPage/LandingPageFooter";
import HeroSection from "../components/LandingPage/HeroSection";
import FeaturesSection from "../components/LandingPage/FeaturesSection";
import TestimonialsSection from "../components/LandingPage/TestimonialsSection";
import PricingSection from "../components/LandingPage/PricingSection";
import FAQSection from "../components/LandingPage/FaqSection";
import FinalCTA from "../components/LandingPage/CTASection";

const LandingPage = () => {
  const { darkMode } = useAppContext();

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950 text-gray-900 dark:text-white transition-all duration-300`}>
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 dark:bg-primary rounded-full blur-3xl opacity-20 animate-pulse-slow delay-1000"></div>
      </div>

      <LandingPageNav />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
      <LandingPageFooter />
    </div>
  );
};

export default LandingPage;
