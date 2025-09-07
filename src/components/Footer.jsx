import { Link } from "react-router-dom";

const Footer = ({ darkMode }) => {
  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-700 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Link to="/" className="flex-shrink-0 flex items-center mb-2">
            <div className="mr-1">
              <img
                src={darkMode ? "/logo-dark.png" : "/logo-white.png"}
                height={38}
                width={38}
                alt="Logo"
                className="object-cover"
              />
            </div>
            <span className="text-sm text-gray-800 dark:text-white">
              Neuctra <span className="text-primary font-bold">Notexa</span>
            </span>
          </Link>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Neuctra Notes. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
