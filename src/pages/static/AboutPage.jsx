import React from "react";
import { useAppContext } from "../../context/useAppContext";
import Metadata from "../../MetaData";

const AboutPage = () => {
  const { darkMode } = useAppContext();

  return (
    <div
      className={`min-h-screen px-6 py-16 flex flex-col items-center justify-start transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      <Metadata
        title="About Notexa | Smart Notes for Everyone"
        description="Learn about Notexa — a modern, AI-powered note app designed for productivity, creativity, and collaboration."
        keywords="about, Notexa, AI notes, productivity, collaboration, modern note app"
        image="/og/about.png"
      />

      <div className="max-w-3xl w-full space-y-6 text-center">
        <h1 className="text-4xl font-bold mb-4">About Notexa</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
          Notexa helps you capture, organize, and share your ideas beautifully.
          With AI-powered tools and real-time collaboration, you can focus on
          creativity while we handle the structure.
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
          Founded with a passion for simplicity and intelligence, Notexa
          empowers individuals, students, and teams to take notes that inspire
          progress.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
