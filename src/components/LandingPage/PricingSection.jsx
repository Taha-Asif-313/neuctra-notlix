import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Crown, Rocket, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Free",
    icon: <Star className="w-8 h-8 text-primary" />,
    price: 0,
    period: "Forever",
    features: [
      "Unlimited notes",
      "Basic formatting tools",
      "Cloud backup",
      "Single device access",
    ],
    color: "from-emerald-400 to-green-500",
    highlight: false,
  },
  {
    name: "Pro",
    icon: <Rocket className="w-8 h-8 text-white" />,
    price: 9,
    period: "per month",
    features: [
      "AI writing assistance",
      "Smart organization",
      "Real-time collaboration",
      "Advanced search & insights",
      "Priority cloud sync",
    ],
    color: "from-green-500 to-emerald-600",
    highlight: true,
  },
  {
    name: "Team",
    icon: <Crown className="w-8 h-8 text-yellow-400" />,
    price: 19,
    period: "per month",
    features: [
      "Everything in Pro",
      "Team dashboards",
      "Role-based permissions",
      "Version control",
      "Priority support",
    ],
    color: "from-lime-400 to-primary",
    highlight: false,
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section
      id="pricing"
      className="py-20 px-6 sm:px-10 bg-gradient-to-b from-white to-emerald-50 dark:from-zinc-950 dark:to-green-950/30"
    >
      <div className="max-w-6xl mx-auto text-center">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
        >
          Simple, Transparent <span className="text-primary">Pricing</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-14"
        >
          Choose a plan that fits your needs. Upgrade anytime — your data and
          settings stay perfectly synced.
        </motion.p>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className={`relative p-8 rounded-3xl border backdrop-blur-md shadow-md transition-all 
                ${
                  plan.highlight
                    ? "scale-105 bg-gradient-to-br from-primary to-green-700 text-white border-green-600 shadow-xl"
                    : "bg-white/80 dark:bg-zinc-900/60 border-gray-200 dark:border-zinc-800"
                }`}
            >
              {/* Plan Icon */}
              <div className="flex justify-center mb-5">{plan.icon}</div>

              {/* Plan Name */}
              <h3
                className={`text-2xl font-bold mb-2 ${
                  plan.highlight
                    ? "text-white"
                    : "text-gray-900 dark:text-gray-100"
                }`}
              >
                {plan.name}
              </h3>

              {/* Plan Price */}
              <div
                className={`text-4xl font-extrabold mb-2 ${
                  plan.highlight ? "text-white" : "text-primary"
                }`}
              >
                {plan.price === 0 ? "Free" : `$${plan.price}`}
              </div>
              <p
                className={`text-sm mb-6 ${
                  plan.highlight
                    ? "text-emerald-100"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {plan.price === 0 ? "Forever" : plan.period}
              </p>

              {/* Features */}
              <ul className="space-y-3 text-left mb-8">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 justify-center md:justify-start"
                  >
                    <CheckCircle2
                      className={`w-5 h-5 ${
                        plan.highlight ? "text-white" : "text-primary "
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        plan.highlight
                          ? "text-emerald-50"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button
                onClick={() => navigate("/signup")}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  plan.highlight
                    ? "bg-white text-primary hover:bg-emerald-50"
                    : "bg-gradient-to-r from-primary to-green-600 text-white hover:opacity-90"
                }`}
              >
                {plan.highlight
                  ? "Get Pro"
                  : plan.price === 0
                  ? "Start Free"
                  : "Choose Plan"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
