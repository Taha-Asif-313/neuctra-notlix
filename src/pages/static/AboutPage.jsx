import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, Users2, Rocket, Globe2 } from "lucide-react";
import { useAppContext } from "../../context/useAppContext";
import Metadata from "../../MetaData";

const AboutPage = () => {
  const { darkMode } = useAppContext();

  return (
    <div
      className={`min-h-screen px-6 md:px-12 py-20 transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      <Metadata
        title="About Notexa | Smart Notes for Everyone"
        description="Learn about Notexa — a modern, AI-powered note app designed for productivity, creativity, and collaboration."
        keywords="about, Notexa, AI notes, productivity, collaboration, modern note app"
        image="/og/about.png"
      />

      {/* 🌟 Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center space-y-6"
      >
        <img src="/logo-dark.png" alt="logo" className="w-24 h-24" />
        <h1 className="text-5xl font-bold tracking-tight">
          About <span className="text-primary">Neuctra</span> Notexa
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
          Notexa is your intelligent workspace — where notes meet creativity,
          structure meets simplicity, and AI helps you think better.
        </p>
      </motion.div>

      {/* 🚀 Mission Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="max-w-4xl mx-auto mt-20 space-y-5 text-center"
      >
        <Rocket className="w-10 h-10 mx-auto text-primary" />
        <h2 className="text-3xl font-semibold mb-2">Our Mission</h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
          We believe note-taking should feel effortless and inspiring.
          That’s why Notexa blends AI assistance with a beautifully simple
          interface — so you can capture, organize, and expand your ideas
          without friction.
        </p>
      </motion.div>

      {/* 💡 What Makes Us Different */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="max-w-5xl mx-auto mt-20 grid md:grid-cols-3 gap-10 text-center"
      >
        {[
          {
            icon: <Sparkles className="w-8 h-8 mx-auto text-primary" />,
            title: "AI-Powered Notes",
            desc: "Transform rough ideas into structured notes using smart AI assistance built directly into your workspace.",
          },
          {
            icon: <Users2 className="w-8 h-8 mx-auto text-primary" />,
            title: "Collaboration Simplified",
            desc: "Work together in real-time, leave comments, and share instantly — all from one unified place.",
          },
          {
            icon: <Brain className="w-8 h-8 mx-auto text-primary" />,
            title: "Think Smarter, Not Harder",
            desc: "Leverage intelligent insights, summaries, and reminders that keep your projects organized effortlessly.",
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`p-6 rounded-2xl shadow-lg border ${
              darkMode
                ? "bg-zinc-900 border-zinc-800"
                : "bg-white border-gray-100"
            }`}
          >
            {feature.icon}
            <h3 className="text-xl font-semibold mt-3 mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* 🕓 Our Journey Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="max-w-3xl mx-auto mt-24 text-center"
      >
        <h2 className="text-3xl font-semibold mb-4">Our Journey</h2>
        <div
          className={`relative mt-10 border-l-2 ${
            darkMode ? "border-zinc-700" : "border-gray-200"
          } pl-8 space-y-10`}
        >
          {[
            {
              year: "2023",
              title: "The Idea Was Born",
              desc: "A vision to create an AI-driven note-taking experience that combines creativity with structure.",
            },
            {
              year: "2024",
              title: "Launch of Notexa Beta",
              desc: "The first users joined, shaping Notexa into a refined and community-driven product.",
            },
            {
              year: "2025",
              title: "Global Expansion",
              desc: "Today, Notexa empowers thousands worldwide to take notes that truly inspire progress.",
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              <h3 className="font-semibold text-xl">{step.year}</h3>
              <p className="text-primary font-medium">{step.title}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mt-1">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 👥 Our Team */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="max-w-5xl mx-auto mt-24 text-center"
      >
        <h2 className="text-3xl font-semibold mb-8">Meet the Team</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {[
            { name: "Huzaifa Khan", role: "Founder & Developer", img: "/team/huzaifa.jpg" },
            { name: "Aisha Malik", role: "Product Designer", img: "/team/aisha.jpg" },
            { name: "Omar Farooq", role: "AI Engineer", img: "/team/omar.jpg" },
          ].map((member, i) => (
            <div
              key={i}
              className={`rounded-2xl border p-6 ${
                darkMode
                  ? "bg-zinc-900 border-zinc-800"
                  : "bg-white border-gray-100"
              } shadow-md`}
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-20 h-20 rounded-full mx-auto object-cover mb-4"
              />
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-gray-500 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 🌈 Footer Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-24 text-center text-sm text-gray-500 dark:text-gray-500"
      >
        © {new Date().getFullYear()} Notexa — Built with ❤️ to empower thinkers worldwide.
      </motion.div>
    </div>
  );
};

export default AboutPage;
