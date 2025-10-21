import React from "react";
import { useAppContext } from "../../context/useAppContext";
import Metadata from "../../MetaData";

const ContactPage = () => {
  const { darkMode } = useAppContext();

  return (
    <div
      className={`min-h-screen px-6 py-16 flex flex-col items-center justify-start transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      <Metadata
        title="Contact Us | Notexa"
        description="Have questions or feedback? Contact the Notexa team — we’d love to hear from you."
        keywords="contact, support, Notexa, feedback, help center"
        image="/og/contact.png"
      />

      <div className="max-w-2xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          We’re always happy to hear from you. Whether it’s feedback, support,
          or collaboration ideas — reach out!
        </p>

        <div className="mt-8 space-y-3 text-gray-700 dark:text-gray-300">
          <p>
            Email:{" "}
            <a
              href="mailto:support@notexa.app"
              className="text-primary font-semibold"
            >
              support@notexa.app
            </a>
          </p>
          <p>
            Twitter:{" "}
            <a
              href="https://twitter.com/notexa"
              className="text-primary font-semibold"
            >
              @Notexa
            </a>
          </p>
          <p>
            GitHub:{" "}
            <a
              href="https://github.com/notexa"
              className="text-primary font-semibold"
            >
              github.com/notexa
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
