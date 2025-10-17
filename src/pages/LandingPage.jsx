import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Notebook,
  MoveRight,
  Brain,
  Zap,
  Shield,
  Star,
  ChevronDown,
  Leaf,
  Sprout,
  Trees,
  Palette,
  Search,
  Users,
  CheckCircle,
  ArrowRight,
  Play,
  BrainCircuit,
  BookHeart,
  Rocket,
  Crown,
} from "lucide-react";
import LandingPageNav from "../components/LandingPage/LandingPageNav";
import LandingPageFooter from "../components/LandingPage/LandingPageFooter";
import { useAppContext } from "../context/useAppContext";

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const { darkMode } = useAppContext();
  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Brain className="w-12 h-12" />,
      title: "AI-Powered Insights",
      description:
        "Get intelligent suggestions and content enhancements powered by advanced AI algorithms that learn your writing style.",
      highlights: [
        "Smart content suggestions",
        "Auto-completion",
        "Style analysis",
      ],
      image: "/ai-brain-illustration.svg",
      color: "from-purple-500 to-blue-600",
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Lightning Fast Sync",
      description:
        "Experience blazing fast note creation and retrieval with our cloud-optimized architecture and real-time synchronization.",
      highlights: ["Instant sync", "Offline access", "Quick search"],
      image: "/sync-illustration.svg",
      color: "from-yellow-500 to-orange-600",
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Military-Grade Security",
      description:
        "Your notes are encrypted end-to-end with AES-256 encryption. Your privacy and data security are our top priority.",
      highlights: ["End-to-end encryption", "Two-factor auth", "Privacy first"],
      image: "/security-illustration.svg",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: <Palette className="w-12 h-12" />,
      title: "Beautiful Customization",
      description:
        "Personalize your writing experience with themes, fonts, and layouts that inspire creativity and focus.",
      highlights: ["Multiple themes", "Custom fonts", "Flexible layouts"],
      image: "/customization-illustration.svg",
      color: "from-pink-500 to-rose-600",
    },
    {
      icon: <Search className="w-12 h-12" />,
      title: "Smart Search & Organization",
      description:
        "Find anything instantly with AI-powered search that understands context and relationships between your notes.",
      highlights: ["AI search", "Smart tags", "Quick filters"],
      image: "/search-illustration.svg",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Collaborative Editing",
      description:
        "Work together seamlessly with real-time collaboration, comments, and version history for team projects.",
      highlights: ["Real-time collaboration", "Comments", "Version history"],
      image: "/collaboration-illustration.svg",
      color: "from-indigo-500 to-purple-600",
    },
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Product Designer",
      content:
        "Neuctra Notes has transformed how I organize my thoughts. The AI features are incredibly useful for brainstorming and content creation!",
      avatar: "/avatar-1.jpg",
      rating: 5,
      company: "TechInnovate",
    },
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      content:
        "I've tried dozens of note apps, but none combine simplicity and power like Neuctra Notes. The sync is flawless across all my devices.",
      avatar: "/avatar-2.jpg",
      rating: 5,
      company: "CodeCraft",
    },
    {
      name: "Michael Torres",
      role: "Research Scientist",
      content:
        "The dark mode is perfect for my late-night writing sessions. My productivity has doubled since switching to Neuctra Notes!",
      avatar: "/avatar-3.jpg",
      rating: 5,
      company: "BioResearch Labs",
    },
    {
      name: "Emily Davis",
      role: "Content Creator",
      content:
        "The AI writing assistant has saved me hours of work. It's like having a creative partner that never gets tired.",
      avatar: "/avatar-4.jpg",
      rating: 5,
      company: "CreativeFlow",
    },
  ];

  const faqs = [
    {
      question: "How does the AI writing assistant work?",
      answer:
        "Our AI analyzes your writing style and content to provide relevant suggestions, completions, and improvements in real-time.",
    },
    {
      question: "Is my data secure and private?",
      answer:
        "Yes, all your notes are encrypted end-to-end. We never access your content and adhere to strict privacy standards.",
    },
    {
      question: "Can I use Neuctra Notes offline?",
      answer:
        "Absolutely! All notes are available offline and automatically sync when you're back online.",
    },
    {
      question: "What platforms are supported?",
      answer:
        "Neuctra Notes is available on Web, iOS, Android, Windows, and macOS with seamless sync across all devices.",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      description: "Perfect for personal note-taking and light AI use.",
      price: "Free",
      period: "Forever",
      features: [
        "Up to 150 notes",
        "5x AI prompts per month",
        "10x Collaborative links per month",
        "Text editing & formatting",
        "Community support",
      ],
      links: [
        { name: "Docs", url: "/docs" },
        { name: "Community", url: "/community" },
        { name: "Learn AI Writing", url: "/learn-ai" },
      ],
      cta: "Get Started Free",
      icon: Rocket,
    },
    {
      name: "Pro",
      description: "Best for creators & professionals needing more AI power.",
      price: "$5",
      period: "per month",
      features: [
        "Unlimited notes",
        "Unlimited AI prompts",
        "Unlimited Collaborative note links",
        "Text formatting & styles",
        "Smart note summarization",
        "Cloud backup & sync",
        "Early access to new AI tools",
      ],
      cta: "Upgrade to Pro",
      popular: true,
      icon: Sparkles,
    },
    {
      name: "Enterprise",
      description:
        "Tailored for teams and organizations with large-scale needs.",
      price: "$25",
      period: "per month",
      features: [
        "Team collaboration & shared workspaces",
        "Custom AI integrations",
        "Admin dashboard & user roles",
        "Detailed analytics & audit logs",
        "Dedicated account manager",
        "24/7 premium support",
      ],
      cta: "Contact Sales",
      icon: Crown,
    },
  ];

  return (
    <>
      <div className="min-h-screen flex flex-col  bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950 text-gray-900 dark:text-white transition-all duration-300">
        {/* Enhanced Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 dark:bg-primary rounded-full blur-3xl opacity-20 animate-pulse-slow delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary rounded-full blur-3xl opacity-10 animate-pulse-slow delay-500"></div>
        </div>

        {/* Modern Simplified Navbar */}
        <LandingPageNav />
        <div className="lg:px-10">
          {/* Hero Section with Image */}
          <section className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-32 pb-20">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-left">
                {/* Badge */}
                <div className="inline-flex items-center text-xs space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-3 font-semibold border border-emerald-200 dark:border-emerald-800">
                  <BrainCircuit className="w-4 h-4" />
                  <span>Introducing AI-Powered Notes</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[60px]">
                  Where Ideas{" "}
                  <span className="bg-gradient-to-r from-primary via-green-500 to-green-400 bg-clip-text text-transparent animate-gradient">
                    Grow & Flourish
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg text-black dark:text-gray-300 mb-10 leading-relaxed">
                  Neuctra Notes helps you capture, organize, and enhance your
                  ideas with built-in AI.
                  <span className="font-semibold text-primary">
                    {" "}
                    Cultivate your thoughts
                  </span>{" "}
                  and watch them transform into something extraordinary.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-16">
                  <Link
                    to="/notes/create"
                    className="group flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-primary to-green-600 text-white rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                  >
                    <Sprout size={20} />
                    <span>Start Writing with AI</span>
                    <MoveRight
                      size={18}
                      className="group-hover:translate-x-1 !transition-transform"
                    />
                  </Link>
                  <button className="group flex items-center justify-center space-x-3 px-8 py-4 border-2 border-primary rounded-2xl font-semibold hover:bg-primary/5 transition-all duration-300">
                    <Play size={18} />
                    <span>Watch Demo</span>
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    { number: "50K+", label: "Active Users" },
                    { number: "1M+", label: "Notes Created" },
                    { number: "99.9%", label: "Uptime" },
                    { number: "4.9/5", label: "Rating" },
                  ].map((stat, index) => (
                    <div key={index} className="text-left">
                      <div className="text-2xl font-bold text-primary">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 🌟 Hero Section Right Image */}
              <div className="relative">
                {/* Main Hero Image */}
                <div className="relative rounded-3xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
                  <img
                    src={darkMode ? "/logo-dark.png" : "/logo-white.png"}
                    alt="Neuctra Notes App Interface"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0"></div>
                </div>

                {/* ✨ Floating Note Preview */}
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-12 hover:rotate-6 transition-all duration-500">
                  <BookHeart
                    size={48}
                    className="text-primary drop-shadow-lg"
                  />
                </div>

                {/* 💡 Floating AI Icon */}
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-br from-primary to-green-600 rounded-2xl shadow-2xl flex items-center justify-center transform -rotate-6 hover:-rotate-3 transition-all duration-500">
                  <BrainCircuit
                    size={42}
                    className="text-white drop-shadow-md"
                  />
                </div>

                {/* 🔹 Optional Glow */}
                <div className="absolute -inset-4 bg-emerald-500/10 blur-3xl rounded-3xl"></div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="animate-bounce flex justify-center mt-16">
              <ChevronDown className="text-primary" />
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 px-4 sm:px-6 relative">
            <div className="container mx-auto max-w-7xl">
              <div className="text-center mb-20">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                  Powerful Features for{" "}
                  <span className="bg-gradient-to-r from-primary to-green-500 bg-clip-text text-transparent">
                    Modern Thinkers
                  </span>
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  Everything you need to capture, organize, and bring your ideas
                  to life
                </p>
              </div>

              {/* Featured Feature Showcase */}
              <div className="bg-white dark:bg-zinc-800/50 rounded-3xl p-8 mb-16 shadow-2xl border border-emerald-100 dark:border-emerald-800/50 transition-all duration-700 ease-in-out">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div
                    key={activeFeature}
                    className="transition-all duration-700 ease-in-out"
                  >
                    <div className="bg-emerald-100 dark:bg-emerald-900/50 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-primary dark:text-emerald-400 transition-all duration-700 ease-in-out">
                      {features[activeFeature].icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 transition-all duration-700 ease-in-out">
                      {features[activeFeature].title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg transition-all duration-700 ease-in-out">
                      {features[activeFeature].description}
                    </p>
                    <ul className="space-y-3">
                      {features[activeFeature].highlights.map(
                        (highlight, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 transition-all duration-500 ease-in-out"
                          >
                            <CheckCircle
                              size={16}
                              className="text-primary flex-shrink-0 transition-transform duration-300 ease-in-out"
                            />
                            <span>{highlight}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="relative transition-all duration-700 ease-in-out">
                    <div
                      className={`bg-gradient-to-br ${features[activeFeature].color} rounded-2xl h-80 flex items-center justify-center text-white transition-all duration-700 ease-in-out hover:scale-[1.02] relative overflow-hidden`}
                    >
                      <img
                        src={features[activeFeature].image}
                        alt={features[activeFeature].title}
                        className="w-4/5 h-4/5 object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* All Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`bg-white dark:bg-zinc-800/50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-emerald-100 dark:border-emerald-800/50 hover:-translate-y-2 cursor-pointer group ${
                      activeFeature === index ? "ring-2 ring-primary" : ""
                    }`}
                    onMouseEnter={() => setActiveFeature(index)}
                  >
                    <div className="relative mb-6">
                      <div className="bg-emerald-100 dark:bg-primary/10 w-12 h-12 p-2 rounded-lg flex items-center justify-center text-primary dark:text-primary group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section
            id="testimonials"
            className="py-20 px-4 sm:px-6 bg-emerald-50 dark:bg-emerald-900/10"
          >
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                  Loved by{" "}
                  <span className="bg-gradient-to-r from-primary to-green-500 bg-clip-text text-transparent">
                    Thousands
                  </span>
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Join our community of productive users who trust Neuctra Notes
                  with their ideas
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-zinc-800/50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100 dark:border-emerald-800/50 hover:-translate-y-2"
                  >
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 italic leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-green-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.role}
                        </p>
                        <p className="text-xs text-primary dark:text-emerald-400">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trusted Companies */}
              <div className="mt-20 text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                  Trusted by teams at
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                  <img
                    src="/company-logo-1.svg"
                    alt="Company 1"
                    className="h-8 dark:invert"
                  />
                  <img
                    src="/company-logo-2.svg"
                    alt="Company 2"
                    className="h-8 dark:invert"
                  />
                  <img
                    src="/company-logo-3.svg"
                    alt="Company 3"
                    className="h-8 dark:invert"
                  />
                  <img
                    src="/company-logo-4.svg"
                    alt="Company 4"
                    className="h-8 dark:invert"
                  />
                  <img
                    src="/company-logo-5.svg"
                    alt="Company 5"
                    className="h-8 dark:invert"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section
            id="pricing"
            className="py-20 px-4 sm:px-6 bg-white dark:bg-zinc-900"
          >
            <div className="container mx-auto max-w-6xl text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Simple, Transparent{" "}
                <span className="bg-gradient-to-r from-primary to-green-500 bg-clip-text text-transparent">
                  Pricing
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-16 max-w-3xl mx-auto">
                Choose the plan that fits your goals — no hidden fees, cancel
                anytime.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {pricingPlans.map((plan, index) => (
                  <div
                    key={index}
                    className={`relative bg-white dark:bg-zinc-800/50 p-8 rounded-3xl border shadow-lg hover:shadow-2xl transition-all duration-300 ${
                      plan.popular
                        ? "border-emerald-400 ring-2 ring-primary scale-[1.02]"
                        : "border-emerald-100 dark:border-emerald-800/50"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                        Most Popular
                      </div>
                    )}

                    <div className="mb-6 flex flex-col items-center">
                      <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-primary/5 text-primary mb-4">
                        <plan.icon size={40} />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {plan.description}
                      </p>
                    </div>

                    <div className="text-4xl font-bold text-primary mb-2">
                      {plan.price}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                      {plan.period}
                    </div>

                    <ul className="text-left space-y-3 text-sm mb-10">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <CheckCircle
                            size={16}
                            className="text-primary flex-shrink-0"
                          />
                          <span className="text-gray-600 dark:text-gray-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                        plan.popular
                          ? "bg-gradient-to-r from-primary to-green-600 text-white hover:scale-105"
                          : "border-2 border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-800/30"
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section
            id="faq"
            className="py-20 px-4 sm:px-6 bg-emerald-50 dark:bg-zinc-900/30"
          >
            <div className="container mx-auto max-w-4xl">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                  Frequently Asked{" "}
                  <span className="bg-gradient-to-r from-primary to-green-500 bg-clip-text text-transparent">
                    Questions
                  </span>
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Everything you need to know about Neuctra Notes.
                </p>
              </div>

              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="group bg-white dark:bg-zinc-800/50 rounded-2xl shadow-md hover:shadow-lg border border-emerald-100 dark:border-emerald-800/50 transition-all duration-300"
                  >
                    <summary className="flex justify-between items-center cursor-pointer p-6 text-lg font-medium text-gray-900 dark:text-white">
                      {faq.question}
                      <ChevronDown className="text-primary transform group-open:rotate-180 transition-transform duration-300" />
                    </summary>
                    <div className="p-6 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="py-20 px-4 sm:px-6 relative">
            <div className="container mx-auto max-w-4xl text-center">
              <div className="bg-gradient-to-br from-primary via-green-600 to-primary rounded-3xl p-12 sm:p-16 shadow-2xl relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="relative z-10">
                  <img
                    src="/logo-dark.png"
                    alt="Get Started"
                    className="w-32 h-32 mx-auto mb-8"
                  />
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                    Ready to Transform Your Ideas?
                  </h2>
                  <p className="text-emerald-100 text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                    Join thousands of productive users growing their ideas with
                    AI-powered Neuctra Notes
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/notes"
                      className="inline-flex items-center justify-center space-x-3 px-8 py-4 bg-white text-primary rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
                    >
                      <span>Start Free Trial</span>
                      <ArrowRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                    <button className="inline-flex items-center justify-center space-x-3 px-8 py-4 bg-transparent border-2 border-white text-white rounded-2xl font-semibold hover:bg-white hover:text-primary transition-all duration-300">
                      <span>Schedule Demo</span>
                      <Play size={18} />
                    </button>
                  </div>
                  <p className="text-emerald-200 text-sm mt-6">
                    No credit card required • 14-day free trial • Cancel anytime
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <LandingPageFooter />
      </div>
    </>
  );
};

export default LandingPage;
