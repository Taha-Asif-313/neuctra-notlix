import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How does the AI writing assistant work?",
    answer:
      "Neuctra’s AI learns from your writing patterns to offer personalized tone, grammar, and clarity suggestions in real-time. It enhances creativity while preserving your unique voice.",
  },
  {
    question: "Is my data secure and private?",
    answer:
      "Absolutely. Your notes are encrypted end-to-end using AES-256 standards. Not even our servers can read your data — your privacy is fully protected.",
  },
  {
    question: "Can I use the app offline?",
    answer:
      "Yes! You can create, view, and edit notes offline. All changes automatically sync when you reconnect to the internet.",
  },
  {
    question: "Do you offer team or enterprise plans?",
    answer:
      "We do. Our Team and Enterprise plans include real-time collaboration, version history, and secure role-based access management.",
  },
  {
    question: "Can I upgrade or downgrade my plan anytime?",
    answer:
      "Yes. You can switch between plans at any time, and your notes and settings will remain perfectly synced across all devices.",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <section
      id="faq"
      className="py-20 px-6 sm:px-10 bg-white dark:bg-zinc-950 transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="w-9 h-9 text-emerald-500 dark:text-primary animate-pulse" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Frequently Asked{" "}
            <span className="text-emerald-500 dark:text-primary">
              Questions
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
            Got questions? We’ve got clear answers. Learn everything about how
            Neuctra helps you write smarter, safer, and faster.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-4 text-left">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              className={`rounded-2xl shadow-sm border transition-all duration-300 ${
                openIndex === index
                  ? "border-primary bg-green-50/60 dark:bg-green-900/10"
                  : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
              }`}
            >
              <button
                className="w-full flex justify-between items-center px-5 sm:px-6 py-4 text-left"
                onClick={() => toggleFAQ(index)}
              >
                <span
                  className={`font-semibold text-base sm:text-lg transition-colors ${
                    openIndex === index
                      ? "text-primary dark:text-primary"
                      : "text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown
                    className={`w-5 h-5 transition-colors ${
                      openIndex === index
                        ? "text-primary"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-5 sm:px-6 pb-4 text-gray-700 dark:text-gray-400 text-sm sm:text-base leading-relaxed"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
