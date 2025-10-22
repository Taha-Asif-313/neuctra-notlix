import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MessageSquare,
  User,
  Send,
  Github,
  Twitter,
  ExternalLink,
} from "lucide-react";
import { useAppContext } from "../../context/useAppContext";
import Metadata from "../../MetaData";

const ContactPage = () => {
  const { darkMode } = useAppContext();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate sending message
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSubmitted(true);
    setIsLoading(false);
    setForm({ name: "", email: "", message: "" });

    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactLinks = [
    {
      icon: Mail,
      label: "Email",
      value: "support@notexa.app",
      href: "mailto:support@notexa.app",
    },
    {
      icon: Twitter,
      label: "Twitter",
      value: "@Notexa",
      href: "https://twitter.com/notexa",
    },
    {
      icon: Github,
      label: "GitHub",
      value: "github.com/notexa",
      href: "https://github.com/notexa",
    },
  ];

  return (
    <div
      className={`min-h-screen px-4 sm:px-6 py-16 lg:py-32 flex flex-col items-center justify-start transition-colors duration-500 ${
        darkMode ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      <Metadata
        title="Contact Us | Notexa"
        description="Have questions or feedback? Contact the Notexa team — we'd love to hear from you."
        keywords="contact, support, Notexa, feedback, help center"
        image="/og/contact.png"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-5xl w-full space-y-10"
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl sm:text-6xl font-bold text-primary">
            Get in Touch
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            We're always happy to hear from you. Whether it’s feedback, support,
            or collaboration ideas — reach out and let’s connect!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          {/* Contact Info */}
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {contactLinks.map((link, i) => (
              <motion.a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center p-5 rounded-2xl border hover:shadow-md transition-all duration-300 ${
                  darkMode
                    ? "bg-zinc-900 border-zinc-700 hover:border-primary"
                    : "bg-white border-gray-200 hover:border-primary"
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className={`p-3 rounded-xl ${
                    darkMode ? "bg-zinc-800" : "bg-gray-100"
                  }`}
                >
                  <link.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4 flex-1 text-left">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {link.label}
                  </p>
                  <p className="font-semibold">{link.value}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </motion.a>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div
              className={`p-8 rounded-3xl border shadow-sm ${
                darkMode
                  ? "bg-zinc-900 border-zinc-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-8 space-y-4"
                  >
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                      <Send className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary">
                      Message Sent!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Thanks for reaching out — we’ll get back to you shortly.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6 text-left"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Name Field */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Your Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-transparent focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 ${
                              darkMode
                                ? "border-zinc-700"
                                : "border-gray-200"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Email Field */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="john@example.com"
                            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-transparent focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 ${
                              darkMode
                                ? "border-zinc-700"
                                : "border-gray-200"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Message Field */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Your Message
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-4 text-primary w-5 h-5" />
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          placeholder="Tell us about your inquiry..."
                          className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 bg-transparent focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none ${
                            darkMode ? "border-zinc-700" : "border-gray-200"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-xl bg-primary text-white font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;
