// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { Globe, MessageCircle, Users } from "lucide-react";

const LandingPageFooter = ({ darkMode }) => {
  const footerLinks = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Use Cases", "Integrations"],
    },
    {
      title: "Company",
      links: ["About", "Blog", "Careers", "Contact"],
    },
    {
      title: "Legal",
      links: ["Privacy", "Terms", "Security", "Compliance"],
    },
  ];

  return (
    <footer className="bg-white dark:bg-zinc-900 border-t border-emerald-100 dark:border-emerald-800">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <img
                src={darkMode ? "/logo-dark.png" : "/logo-white.png"}
                alt="Neuctra Notes"
                className="h-10 w-10 object-cover"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
                  Neuctra
                </span>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Notes
                </span>
              </div>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              The intelligent note-taking app that helps you capture, organize,
              and bring your ideas to life with AI assistance.
            </p>
            <div className="flex space-x-4">
              {[Globe, MessageCircle, Users].map((Icon, i) => (
                <button
                  key={i}
                  className="p-2 bg-emerald-100 dark:bg-emerald-900/50 text-primary dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors"
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {footerLinks.map((col, index) => (
            <div key={index}>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-emerald-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-emerald-100 dark:border-emerald-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Neuctra Notes. Cultivate your ideas 🌱
          </div>
          <div className="flex space-x-6 text-sm">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-emerald-400 transition-colors"
                >
                  {item}
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingPageFooter;
