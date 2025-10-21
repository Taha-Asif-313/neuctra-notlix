import React from "react";
import { useAppContext } from "../../context/useAppContext";
import Metadata from "../../MetaData";

const TermsPage = () => {
  const { darkMode } = useAppContext();

  return (
    <div
      className={`min-h-screen px-6 py-16 transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      <Metadata
        title="Terms of Service | Notexa"
        description="Review Notexa’s Terms of Service to understand your rights, responsibilities, and usage guidelines."
        keywords="terms of service, Notexa terms, policies, legal"
        image="/og/terms.png"
      />

      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-4">
          Terms of Service
        </h1>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          By using Notexa, you agree to comply with our Terms of Service. These
          terms outline how you can use the app, your rights, and limitations of
          liability.
        </p>

        <ul className="list-disc ml-6 space-y-3 text-gray-600 dark:text-gray-400">
          <li>
            Users must not upload harmful, illegal, or copyrighted content.
          </li>
          <li>
            Your notes and data are private and secure, accessible only by you.
          </li>
          <li>We reserve the right to update these terms as needed.</li>
        </ul>

        <p className="text-gray-600 dark:text-gray-400 mt-6">
          If you have any questions, contact us at{" "}
          <a
            href="mailto:support@notexa.app"
            className="text-primary font-semibold"
          >
            support@notexa.app
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default TermsPage;
