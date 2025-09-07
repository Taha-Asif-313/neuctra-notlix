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
} from "lucide-react";

const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [isScrolled, setIsScrolled] = useState(false);
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Add this line

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

  const features = [
    {
      icon: <Brain className="w-10 h-10" />,
      title: "AI-Powered Insights",
      description:
        "Get intelligent suggestions and content enhancements powered by advanced AI algorithms.",
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: "Lightning Fast",
      description:
        "Experience blazing fast note creation and retrieval with our optimized architecture.",
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Secure & Private",
      description:
        "Your notes are encrypted and stored securely. Your privacy is our top priority.",
    },
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Product Designer",
      content:
        "Neuctra Notes has transformed how I organize my thoughts. The AI features are incredibly useful!",
      avatar: "/avatar-1.jpg",
    },
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      content:
        "I've tried dozens of note apps, but none combine simplicity and power like Neuctra Notes.",
      avatar: "/avatar-2.jpg",
    },
    {
      name: "Michael Torres",
      role: "Research Scientist",
      content:
        "The dark mode is perfect for my late-night writing sessions. My productivity has doubled!",
      avatar: "/avatar-3.jpg",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 to-green-50 dark:from-zinc-900 dark:to-emerald-950 text-gray-900 dark:text-white !!transition-all duration-300">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 dark:bg-emerald-900 rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-lime-200 dark:bg-primary rounded-full blur-3xl opacity-30 animate-pulse-slow delay-1000"></div>
      </div>

      {/* Navbar */}
   <header
  className={`fixed w-full z-50 !transition-all duration-300 ${
    isScrolled || mobileMenuOpen
      ? "py-2 bg-white/80 dark:bg-black backdrop-blur-md shadow-sm"
      : "py-4 bg-transparent"
  }`}
>
  <div className="container mx-auto px-6 flex justify-between items-center">
    <Link to="/" className="flex-shrink-0 flex items-center z-10">
      <div className="mr-2 bg-gradient-to-r from-emerald-600 to-primary p-2 rounded-lg">
        <Leaf className="text-white w-6 h-6" />
      </div>
      {/* Hide text on mobile, show from sm breakpoint */}
      <span className="hidden sm:block text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-primary">
        Neuctra<span className="font-extrabold">Notes</span>
      </span>
    </Link>

    <nav className="hidden md:flex items-center gap-8">
      <a
        href="#features"
        className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 !transition-colors"
      >
        Features
      </a>
      <a
        href="#testimonials"
        className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 !transition-colors"
      >
        Testimonials
      </a>
      <a
        href="#faq"
        className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 !transition-colors"
      >
        FAQ
      </a>
    </nav>

    <div className="flex items-center gap-4">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 rounded-full bg-white dark:bg-emerald-800 shadow-md hover:shadow-lg !transition-all hover:scale-110"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>
       {/* Mobile menu button for smaller screens */}
      <button
        className="md:hidden p-2 rounded-full bg-white dark:bg-emerald-800 shadow-md"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
      </button>
      <Link
        to="/notes"
        className="px-4 py-2 flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-primary text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg !transition-all hover:scale-105 group"
      >
        {/* Hide "Get Started" text on mobile, show from sm breakpoint */}
        <span className="hidden sm:block">Get Started</span>
        <MoveRight
          size={16}
          className="group-hover:translate-x-1 !transition-transform"
        />
      </Link>
      
     
    </div>
  </div>
  
  {/* Mobile menu dropdown */}
  {mobileMenuOpen && (
    <div className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-black/95 backdrop-blur-lg border-t border-emerald-100 dark:border-emerald-800">
      <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
        <a
          href="#features"
          className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 !transition-colors py-2"
          onClick={() => setMobileMenuOpen(false)}
        >
          Features
        </a>
        <a
          href="#testimonials"
          className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 !transition-colors py-2"
          onClick={() => setMobileMenuOpen(false)}
        >
          Testimonials
        </a>
        <a
          href="#faq"
          className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 !transition-colors py-2"
          onClick={() => setMobileMenuOpen(false)}
        >
          FAQ
        </a>
        <Link
          to="/notes"
          className="px-4 py-2 flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-primary text-white rounded-lg text-sm font-medium mt-2"
          onClick={() => setMobileMenuOpen(false)}
        >
          Get Started
          <MoveRight size={16} />
        </Link>
      </div>
    </div>
  )}
</header>

      {/* Hero Section */}
      <main className="relative flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full mb-6 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Introducing AI-Powered Notes</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Grow Your Ideas with{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-primary">
              AI Assistance
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Neuctra Notes helps you capture, organize, and enhance your ideas
            with built-in AI. Cultivate your thoughts and watch them grow with
            our intelligent writing assistant.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/create"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-primary text-white rounded-xl shadow-lg hover:shadow-xl !transition-all hover:scale-105 group"
            >
              <Sprout size={20} />
              Try AI Note
              <MoveRight
                size={18}
                className="group-hover:translate-x-1 !transition-transform"
              />
            </Link>
            <Link
              to="/home"
              className="px-8 py-4 border border-gray-300 dark:border-emerald-700 rounded-xl hover:bg-white dark:hover:bg-emerald-800/50 !transition-all"
            >
              View Notes
            </Link>
          </div>

          <div className="animate-bounce flex justify-center mt-8">
            <ChevronDown className="text-emerald-400 dark:text-emerald-500" />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-10 left-10 opacity-20">
          <Trees size={100} className="text-emerald-400" />
        </div>
        <div className="absolute top-20 right-10 opacity-20">
          <Leaf size={80} className="text-green-400" />
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 relative">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cultivate Your Ideas
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Designed to help your ideas grow and flourish with intelligent
              tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-emerald-900/30 p-6 rounded-2xl shadow-md hover:shadow-lg !transition-all duration-300 border border-emerald-100 dark:border-emerald-700 hover:-translate-y-2"
              >
                <div className="bg-emerald-100 dark:bg-emerald-900/50 w-16 h-16 rounded-xl flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
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
        className="py-16 px-6 bg-emerald-50 dark:bg-emerald-900/20"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by Users
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover what our users are saying about their experience with
              Neuctra Notes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-emerald-900/30 p-6 rounded-2xl shadow-md border border-emerald-100 dark:border-emerald-700"
              >
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-300 font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
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

      {/* CTA Section */}
      <section className="py-20 px-6 relative">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="bg-gradient-to-r from-emerald-600 to-primary rounded-3xl p-12 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Cultivate Your Ideas?
            </h2>
            <p className="text-emerald-100 mb-8 text-lg">
              Join thousands of productive users growing their ideas with
              Neuctra Notes
            </p>
            <Link
              to="/notes"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold shadow-md hover:shadow-lg !!transition-all hover:scale-105 group"
            >
              Get Started Now
              <MoveRight
                size={20}
                className="group-hover:translate-x-1 !transition-transform"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-gray-500 dark:text-gray-400 border-t border-emerald-100 dark:border-emerald-800 bg-white dark:bg-emerald-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              © {new Date().getFullYear()} Neuctra Notes. Cultivate your ideas
              🌱
            </div>
            <div className="flex gap-6">
              <a
                href="#"
                className="hover:text-emerald-600 dark:hover:text-emerald-400 !transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-emerald-600 dark:hover:text-emerald-400 !transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="hover:text-emerald-600 dark:hover:text-emerald-400 !transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
