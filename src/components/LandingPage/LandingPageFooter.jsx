// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { Globe, MessageCircle, Users } from "lucide-react";
import { useAppContext } from "../../context/useAppContext";

const LandingPageFooter = () => {
  const { darkMode } = useAppContext();
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
    <footer className="bg-white dark:bg-black border-t border-emerald-100 dark:border-emerald-800">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 mb-2 group">
              <div className="relative">
                <div className="relative">
                  <img
                    src={darkMode ? "/logo-dark.png" : "/logo-white.png"}
                    alt="Neuctra Notes"
                    className="h-10 w-10 object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-primary leading-3">
                  Neuctra
                </span>
                <span className="text-lg font-bold leading-3">Notexa</span>
              </div>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm max-w-md">
              The intelligent note-taking app that helps you capture, organize,
              and bring your ideas to life with AI assistance.
            </p>
            <div className="flex space-x-4">
              {[Globe, MessageCircle, Users].map((Icon, i) => (
                <button
                  key={i}
                  className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
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
                      className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
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
