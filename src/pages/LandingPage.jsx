import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Notebook,
  Moon,
  Sun,
  MoveRight,
  Brain,
  Zap,
  Shield,
  Star,
  ChevronDown,
  Leaf,
  Sprout,
  Trees,
  Menu,
  X,
  Cloud,
  Lock,
  Palette,
  Search,
  Users,
  Globe,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Play,
  Download,
  Smartphone,
  Laptop,
  Tablet,
} from "lucide-react";

const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Lightning Fast Sync",
      description:
        "Experience blazing fast note creation and retrieval with our cloud-optimized architecture and real-time synchronization.",
      highlights: ["Instant sync", "Offline access", "Quick search"],
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Military-Grade Security",
      description:
        "Your notes are encrypted end-to-end with AES-256 encryption. Your privacy and data security are our top priority.",
      highlights: ["End-to-end encryption", "Two-factor auth", "Privacy first"],
    },
    {
      icon: <Palette className="w-12 h-12" />,
      title: "Beautiful Customization",
      description:
        "Personalize your writing experience with themes, fonts, and layouts that inspire creativity and focus.",
      highlights: ["Multiple themes", "Custom fonts", "Flexible layouts"],
    },
    {
      icon: <Search className="w-12 h-12" />,
      title: "Smart Search & Organization",
      description:
        "Find anything instantly with AI-powered search that understands context and relationships between your notes.",
      highlights: ["AI search", "Smart tags", "Quick filters"],
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Collaborative Editing",
      description:
        "Work together seamlessly with real-time collaboration, comments, and version history for team projects.",
      highlights: ["Real-time collaboration", "Comments", "Version history"],
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
    },
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      content:
        "I've tried dozens of note apps, but none combine simplicity and power like Neuctra Notes. The sync is flawless across all my devices.",
      avatar: "/avatar-2.jpg",
      rating: 5,
    },
    {
      name: "Michael Torres",
      role: "Research Scientist",
      content:
        "The dark mode is perfect for my late-night writing sessions. My productivity has doubled since switching to Neuctra Notes!",
      avatar: "/avatar-3.jpg",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "Content Creator",
      content:
        "The AI writing assistant has saved me hours of work. It's like having a creative partner that never gets tired.",
      avatar: "/avatar-4.jpg",
      rating: 5,
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
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Up to 100 notes",
        "Basic AI features",
        "1GB storage",
        "Web & mobile apps",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      description: "For power users and professionals",
      features: [
        "Unlimited notes",
        "Advanced AI features",
        "50GB storage",
        "All platforms",
        "Priority support",
        "Custom themes",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Team",
      price: "$15",
      period: "per user/month",
      description: "Collaborative workspace for teams",
      features: [
        "Everything in Pro",
        "Team workspaces",
        "Admin controls",
        "Advanced analytics",
        "SSO integration",
        "99.9% uptime SLA",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950 text-gray-900 dark:text-white transition-all duration-300">
        {/* Enhanced Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 dark:bg-emerald-900 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 dark:bg-primary rounded-full blur-3xl opacity-20 animate-pulse-slow delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl opacity-10 animate-pulse-slow delay-500"></div>
        </div>

        {/* Modern Navbar */}
        <header
          className={`fixed w-full z-50 transition-all duration-500 ${
            isScrolled
              ? "py-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-lg border-b border-emerald-100/50 dark:border-emerald-800/50"
              : "py-5 bg-transparent"
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl blur group-hover:blur-md transition-all duration-300 opacity-70"></div>
                  <div className="relative">
                    <img
                      src={"/logo-dark.png"}
                      alt="Neuctra Notes - AI-Powered Note Taking"
                      className="h-8 w-8 object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    Neuctra
                  </span>
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 -mt-1">
                    Notes
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                {["Features", "Testimonials", "Pricing", "FAQ"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 relative group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></span>
                  </a>
                ))}
              </nav>

              {/* CTA Buttons */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-emerald-100 dark:border-emerald-800"
                  aria-label="Toggle dark mode"
                >
                  <div className="relative">
                    {darkMode ? (
                      <Sun size={18} className="text-amber-400" />
                    ) : (
                      <Moon size={18} className="text-indigo-600" />
                    )}
                  </div>
                </button>

                {/* Mobile Menu Button */}
                <button
                  className="lg:hidden p-2.5 rounded-xl bg-white dark:bg-zinc-800 shadow-lg border border-emerald-100 dark:border-emerald-800"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>

                <Link
                  to="/notes"
                  className="hidden sm:flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                >
                  <span>Get Started</span>
                  <MoveRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-t border-emerald-100 dark:border-emerald-800 shadow-xl">
              <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col space-y-4">
                  {["Features", "Testimonials", "Pricing", "FAQ"].map(
                    (item) => (
                      <a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-3 border-b border-emerald-50 dark:border-emerald-800/50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item}
                      </a>
                    )
                  )}
                  <Link
                    to="/notes"
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold mt-4"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Get Started</span>
                    <MoveRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-32 pb-20">
          <div className="max-w-6xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-full mb-8 text-sm font-semibold border border-emerald-200 dark:border-emerald-800">
              <Sparkles className="w-4 h-4" />
              <span>Introducing AI-Powered Notes</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Where Ideas{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 bg-clip-text text-transparent animate-gradient">
                Grow & Flourish
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Neuctra Notes helps you capture, organize, and enhance your ideas
              with built-in AI.
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {" "}
                Cultivate your thoughts
              </span>{" "}
              and watch them transform into something extraordinary.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/notes/create"
                className="group flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              >
                <Sprout size={20} />
                <span>Start Writing with AI</span>
                <MoveRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <button className="group flex items-center justify-center space-x-3 px-8 py-4 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all duration-300">
                <Play size={18} />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {[
                { number: "50K+", label: "Active Users" },
                { number: "1M+", label: "Notes Created" },
                { number: "99.9%", label: "Uptime" },
                { number: "4.9/5", label: "Rating" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="animate-bounce flex justify-center mt-16">
              <ChevronDown className="text-emerald-500" />
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute bottom-10 left-10 opacity-10">
            <Trees size={120} className="text-emerald-400" />
          </div>
          <div className="absolute top-20 right-10 opacity-10">
            <Leaf size={100} className="text-green-400" />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 sm:px-6 relative">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Powerful Features for{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                  Modern Thinkers
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Everything you need to capture, organize, and bring your ideas
                to life
              </p>
            </div>

            {/* Featured Feature Showcase */}
            <div className="bg-white dark:bg-zinc-800/50 rounded-3xl p-8 mb-16 shadow-2xl border border-emerald-100 dark:border-emerald-800/50">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="bg-emerald-100 dark:bg-emerald-900/50 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
                    {features[activeFeature].icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    {features[activeFeature].title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                    {features[activeFeature].description}
                  </p>
                  <ul className="space-y-3">
                    {features[activeFeature].highlights.map(
                      (highlight, index) => (
                        <li
                          key={index}
                          className="flex items-center space-x-3 text-gray-600 dark:text-gray-400"
                        >
                          <CheckCircle
                            size={16}
                            className="text-emerald-500 flex-shrink-0"
                          />
                          <span>{highlight}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="relative">
                  {/* Feature visualization would go here */}
                  <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl h-80 flex items-center justify-center text-white">
                    <div className="text-center">
                      <Notebook size={64} className="mx-auto mb-4 opacity-80" />
                      <p className="text-lg font-semibold">Feature Preview</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* All Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`bg-white dark:bg-zinc-800/50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-emerald-100 dark:border-emerald-800/50 hover:-translate-y-2 cursor-pointer ${
                    activeFeature === index ? "ring-2 ring-emerald-500" : ""
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className="bg-emerald-100 dark:bg-emerald-900/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
                    {feature.icon}
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
                <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                  Thousands
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Join our community of productive users who trust Neuctra Notes
                with their ideas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
              <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
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
                      ? "border-emerald-400 ring-2 ring-emerald-500 scale-[1.02]"
                      : "border-emerald-100 dark:border-emerald-800/50"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  )}

                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {plan.description}
                  </p>
                  <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                    {plan.price}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                    {plan.period}
                  </div>

                  <ul className="text-left space-y-3 mb-10">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <CheckCircle
                          size={16}
                          className="text-emerald-500 flex-shrink-0"
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
                        ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:scale-105"
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
                <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
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
                    <ChevronDown className="text-emerald-500 transform group-open:rotate-180 transition-transform duration-300" />
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
            <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-500 rounded-3xl p-12 sm:p-16 shadow-2xl relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
              </div>

              <div className="relative z-10">
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
                    className="inline-flex items-center justify-center space-x-3 px-8 py-4 bg-white text-emerald-600 rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
                  >
                    <span>Start Free Trial</span>
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                  <button className="inline-flex items-center justify-center space-x-3 px-8 py-4 bg-transparent border-2 border-white text-white rounded-2xl font-semibold hover:bg-white hover:text-emerald-600 transition-all duration-300">
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

        {/* Footer */}
        <footer className="bg-white dark:bg-zinc-900 border-t border-emerald-100 dark:border-emerald-800">
          <div className="container mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <Link to="/" className="flex items-center space-x-3 mb-6">
                  <img
                    src={darkMode ? "/logo-dark.png" : "/logo-white.png"}
                    alt="Neuctra Notes"
                    className="h-10 w-10 object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                      Neuctra
                    </span>
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Notes
                    </span>
                  </div>
                </Link>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                  The intelligent note-taking app that helps you capture,
                  organize, and bring your ideas to life with AI assistance.
                </p>
                <div className="flex space-x-4">
                  {[Globe, MessageCircle, Users].map((Icon, index) => (
                    <button
                      key={index}
                      className="p-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors"
                    >
                      <Icon size={18} />
                    </button>
                  ))}
                </div>
              </div>

              {[
                {
                  title: "Product",
                  links: ["Features", "Pricing", "Use Cases", "Integrations"],
                },
                {
                  title: "Company",
                  links: ["About", "Blog", "Careers", "Contact"],
                },
                {
                  title: "Legal",
                  links: ["Privacy", "Terms", "Security", "Compliance"],
                },
              ].map((column, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    {column.title}
                  </h3>
                  <ul className="space-y-3">
                    {column.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href="#"
                          className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-emerald-100 dark:border-emerald-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-500 dark:text-gray-400 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} Neuctra Notes. Cultivate your ideas
                🌱
              </div>
              <div className="flex space-x-6 text-sm">
                <a
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
