import React from "react";
import { useAppContext } from "../../context/AppContext";
import Metadata from "../../MetaData";

const PrivacyPolicyPage = () => {
  const { darkMode } = useAppContext();

  return (
    <div
      className={`min-h-screen px-6 py-16 lg:py-32 transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      <Metadata
        title="Privacy Policy | Notexa"
        description="Your privacy matters. Learn how Notexa collects, stores, and protects your personal data."
        keywords="privacy, data protection, Notexa privacy policy, security"
      />

      <div className="max-w-3xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center mb-6">Privacy Policy</h1>

        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
          At <strong>Notexa</strong>, we believe privacy is a fundamental right.
          This policy explains what data we collect, how we use it, and how you
          can manage your information. Our mission is to give you a safe,
          secure, and transparent note-taking experience.
        </p>

        {/* Section: Information We Collect */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            Information We Collect
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            We only collect data necessary to provide and improve our services.
          </p>
          <ul className="list-disc ml-6 space-y-2 text-gray-600 dark:text-gray-400">
            <li>
              <strong>Account Information:</strong> Your name, email, and login
              credentials for authentication and access management.
            </li>
            <li>
              <strong>Notes & Documents:</strong> All content you create and
              store in Notexa is encrypted and securely synced across your
              devices.
            </li>
            <li>
              <strong>Usage Data:</strong> Anonymous analytics like app
              performance, device type, and feature usage to enhance your
              experience.
            </li>
            <li>
              <strong>Cookies:</strong> Minimal cookies are used to maintain
              your login session and remember preferences (e.g., dark mode).
            </li>
          </ul>
        </section>

        {/* Section: How We Use Your Information */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            How We Use Your Information
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-600 dark:text-gray-400">
            <li>To create and manage your Notexa account</li>
            <li>To securely store and sync your notes across devices</li>
            <li>To improve performance and introduce new features</li>
            <li>To respond to your feedback or support requests</li>
          </ul>
        </section>

        {/* Section: Data Security */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            We implement industry-standard security practices, including data
            encryption, secure servers, and limited access controls. While no
            digital system is 100% secure, we continuously monitor and update
            our infrastructure to safeguard your information.
          </p>
        </section>

        {/* Section: Third-Party Services */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Third-Party Services</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Notexa may use trusted third-party tools (like analytics or cloud
            storage) to improve performance. These providers are bound by strict
            confidentiality and data-protection agreements and never use your
            personal data for their own purposes.
          </p>
        </section>

        {/* Section: Your Rights */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-600 dark:text-gray-400">
            <li>Access and download a copy of your data at any time</li>
            <li>Delete your account and remove your information permanently</li>
            <li>Update your profile and privacy preferences</li>
            <li>
              Contact us for clarification or complaints about data handling
            </li>
          </ul>
        </section>

        {/* Section: Retention & Deletion */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            Data Retention & Deletion
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Your data remains stored only as long as your account is active.
            When you delete your account, all personal data and notes are
            permanently erased from our servers within 30 days.
          </p>
        </section>

        {/* Section: Contact */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            If you have questions or concerns about this Privacy Policy, please
            reach out to our team at{" "}
            <a
              href="mailto:privacy@notexa.app"
              className="text-primary hover:underline font-medium"
            >
              privacy@notexa.app
            </a>
            .
          </p>
        </section>

        {/* Last Updated */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-500 mt-10">
          Last updated: October 22, 2025
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
