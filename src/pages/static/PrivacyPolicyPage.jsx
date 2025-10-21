import React from "react";
import { useAppContext } from "../../context/useAppContext";
import Metadata from "../../MetaData";

const PrivacyPolicyPage = () => {
  const { darkMode } = useAppContext();

  return (
    <div
      className={`min-h-screen px-6 py-16 transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      <Metadata
        title="Privacy Policy | Notexa"
        description="Your privacy matters. Learn how Notexa collects, stores, and protects your personal data."
        keywords="privacy, data protection, Notexa privacy policy, security"
        image="/og/privacy.png"
      />

      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-4">Privacy Policy</h1>

        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Notexa values your privacy. We only collect data necessary for your
          account and note synchronization. Your information is never sold or
          shared with third parties.
        </p>

        <h2 className="text-2xl font-semibold mt-8">What We Collect</h2>
        <ul className="list-disc ml-6 space-y-3 text-gray-600 dark:text-gray-400">
          <li>Account information (email, username)</li>
          <li>Notes and documents you create</li>
          <li>Usage analytics to improve performance</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">Your Rights</h2>
        <ul className="list-disc ml-6 space-y-3 text-gray-600 dark:text-gray-400">
          <li>Access and delete your data anytime</li>
          <li>Export your notes on request</li>
          <li>Request account removal by contacting support</li>
        </ul>

        <p className="text-gray-600 dark:text-gray-400 mt-6">
          Questions? Contact us at{" "}
          <a
            href="mailto:privacy@notexa.app"
            className="text-primary font-semibold"
          >
            privacy@notexa.app
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
