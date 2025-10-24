import { Link } from "react-router-dom";
import { Globe, MessageCircle, Users } from "lucide-react";
import { useAppContext } from "../../context/useAppContext";

const LandingPageFooter = () => {
  const { darkMode } = useAppContext();

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", path: "/features" },
        { name: "Pricing", path: "/pricing" }
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", path: "/privacy-policy" },
        { name: "Terms of Service", path: "/terms" }
      ],
    },
  ];

  const socialIcons = [Globe, MessageCircle, Users];

  return (
    <footer className="bg-white dark:bg-black border-t border-emerald-100 dark:border-primary">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* --- Brand Section --- */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-2 group">
              <img
                src={darkMode ? "/logo-dark.png" : "/logo-white.png"}
                alt="Neuctra Notes"
                className="h-10 w-10 object-cover"
              />
              <div className="flex flex-col">
                <span className="text-[10px] text-primary leading-3">Neuctra</span>
                <span className="text-lg font-bold leading-3">Notexa</span>
              </div>
            </Link>

            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm max-w-md">
              The intelligent note-taking app that helps you capture, organize,
              and bring your ideas to life with AI assistance.
            </p>

            <div className="flex space-x-4">
              {socialIcons.map((Icon, i) => (
                <button
                  key={i}
                  className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* --- Footer Link Columns --- */}
          {footerLinks.map((col, index) => (
            <div key={index}>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link.path}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* --- Bottom Bar --- */}
        <div className="border-t border-emerald-100 dark:border-primary mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Neuctra Notes. Cultivate your ideas.
          </p>
          <div className="flex space-x-6 text-sm">
            {[
              { name: "Privacy Policy", path: "/privacy-policy" },
              { name: "Terms of Service", path: "/terms" },
              { name: "Contact Us", path: "/contact" },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingPageFooter;
