import React from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Ali Raza",
    role: "Entrepreneur",
    feedback:
      "Neuctra has completely streamlined how I manage my business notes and documents. The AI feels natural and saves me hours every week.",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    rating: 5,
  },
  {
    name: "Usman Tariq",
    role: "Software Engineer",
    feedback:
      "The collaboration tools are top-notch — feels like Google Docs but smoother and more secure. Perfect for remote teamwork.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
  },
  {
    name: "Hamza Iqbal",
    role: "Product Designer",
    feedback:
      "The design and speed are incredible. Neuctra helps me organize project ideas quickly without any clutter. Definitely my favorite productivity app.",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
    rating: 5,
  },
];


const TestimonialsSection = () => {
  return (
    <section
      id="testimonials"
      className="py-20 px-6 sm:px-10 bg-gradient-to-b from-white to-emerald-50 dark:from-zinc-950 dark:to-green-950/40"
    >
      <div className="max-w-6xl mx-auto text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex justify-center mb-4">
            <Quote className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            What Our{" "}
            <span className="text-primary">
              Users Say
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            See how Neuctra helps creators, professionals, and teams stay
            organized, inspired, and productive.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full border border-primary/40"
                />
                <div className="ml-3 text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t.role}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-4">
                “{t.feedback}”
              </p>

              <div className="flex justify-center sm:justify-start text-primary">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
