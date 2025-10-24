import LandingPageNav from "../components/LandingPage/LandingPageNav";
import LandingPageFooter from "../components/LandingPage/LandingPageFooter";
import HeroSection from "../components/LandingPage/HeroSection";
import FeaturesSection from "../components/LandingPage/FeaturesSection";
import TestimonialsSection from "../components/LandingPage/TestimonialsSection";
import PricingSection from "../components/LandingPage/PricingSection";
import FAQSection from "../components/LandingPage/FaqSection";
import FinalCTA from "../components/LandingPage/CTASection";
import Metadata from "../MetaData";

const LandingPage = () => {
  return (
    <>
      {/* 🧠 Dynamic Metadata for SEO & Social */}
      <Metadata
        title="Neuctra Notes – Smarter, Secure, and Collaborative Note-Taking"
        description="Neuctra Notes is an AI-powered note-taking app that helps you capture ideas, collaborate in real-time, and stay productive — all with end-to-end encryption and a modern minimal design."
        keywords="AI notes, collaborative notes, secure note taking, encrypted notes, productivity app, Neuctra, Neuctra Notes"
        image="https://yourdomain.com/assets/og-preview.png" // 🔗 replace with your actual Open Graph image URL
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
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <FinalCTA />
    
      </div>
    </>
  );
};

export default LandingPage;
