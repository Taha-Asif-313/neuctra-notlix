import React from "react";
import { useAppContext } from "../../context/useAppContext";
import Metadata from "../../MetaData";

const TermsPage = () => {
  const { darkMode } = useAppContext();

  return (
    <div
      className={`min-h-screen px-6 py-16 lg:py-32 transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      <Metadata
        title="Terms of Service | Notexa"
        description="Review Notexa’s Terms of Service to understand your rights, responsibilities, and usage guidelines."
        keywords="terms of service, Notexa terms, policies, legal agreement"
        image="/og/terms.png"
      />

      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-4">
          Terms of Service
        </h1>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
          Welcome to <strong>Notexa</strong>. These Terms of Service (“Terms”) 
          govern your access to and use of our website, application, and 
          related services. By creating an account or using Notexa, you agree 
          to be bound by these Terms. Please read them carefully.
        </p>

        {/* Section: Acceptance */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            By accessing or using Notexa, you confirm that you are at least 
            13 years old (or the legal age of digital consent in your region) 
            and have the legal capacity to enter into this agreement. If you 
            do not agree to these Terms, you must not use our services.
          </p>
        </section>

        {/* Section: Use of Service */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Use of Our Services</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-600 dark:text-gray-400">
            <li>
              You are responsible for maintaining the confidentiality of your 
              account credentials and all activities under your account.
            </li>
            <li>
              You may not use Notexa for any unlawful, harmful, or abusive 
              purpose, including transmitting malware or infringing intellectual 
              property rights.
            </li>
            <li>
              You retain ownership of the content you create in Notexa. However, 
              by using the app, you grant us a limited, non-exclusive license 
              to store and process your content for functionality (e.g., syncing 
              and backups).
            </li>
          </ul>
        </section>

        {/* Section: Data and Privacy */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Data and Privacy</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Your privacy is extremely important to us. Our{" "}
            <a
              href="/privacy"
              className="text-emerald-500 font-medium hover:underline"
            >
              Privacy Policy
            </a>{" "}
            explains how we collect, use, and protect your personal data. 
            By using Notexa, you also agree to our Privacy Policy.
          </p>
        </section>

        {/* Section: Intellectual Property */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Intellectual Property</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            The Notexa platform, logo, design, and underlying technologies are 
            owned by Notexa. You may not copy, modify, distribute, or create 
            derivative works from our content or software without prior written 
            consent.
          </p>
        </section>

        {/* Section: Prohibited Conduct */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Prohibited Conduct</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-600 dark:text-gray-400">
            <li>Uploading or sharing illegal, harmful, or offensive materials</li>
            <li>Attempting to hack, disrupt, or reverse-engineer Notexa</li>
            <li>Using automation tools or bots to overload our systems</li>
            <li>Impersonating others or misrepresenting your identity</li>
          </ul>
        </section>

        {/* Section: Service Modifications */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Modifications & Availability</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            We continuously update Notexa to improve features and performance. 
            We reserve the right to modify, suspend, or discontinue any part 
            of our service at any time, with or without prior notice.
          </p>
        </section>

        {/* Section: Termination */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Termination of Use</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            We may suspend or terminate your account if you violate these Terms 
            or engage in misuse of our services. Upon termination, your right 
            to use Notexa will immediately cease, and your stored data may be 
            deleted in accordance with our retention policy.
          </p>
        </section>

        {/* Section: Limitation of Liability */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">8. Limitation of Liability</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Notexa and its team shall not be held liable for any indirect, 
            incidental, or consequential damages resulting from your use of 
            the service. Our total liability is limited to the amount you 
            paid (if any) for using Notexa.
          </p>
        </section>

        {/* Section: Governing Law */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">9. Governing Law</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            These Terms shall be governed by and interpreted in accordance 
            with the laws of your country of residence. Any disputes shall 
            be handled in local courts where applicable.
          </p>
        </section>

        {/* Section: Updates */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">10. Updates to These Terms</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            We may revise these Terms periodically to reflect new features, 
            legal requirements, or feedback. The latest version will always 
            be available on this page, with the updated date clearly stated.
          </p>
        </section>

        {/* Section: Contact */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">11. Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            For questions, feedback, or concerns regarding these Terms, 
            please contact our support team at{" "}
            <a
              href="mailto:support@notexa.app"
              className="text-primary font-medium hover:underline"
            >
              support@notexa.app
            </a>.
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

export default TermsPage;
