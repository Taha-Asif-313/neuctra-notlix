import { Link } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 py-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="relative">
                <img
                  src={"/logo-dark.png"}
                  alt="Neuctra Notes"
                  className="h-10 w-10 object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-primary leading-3">
                Neuctra
              </span>
              <span className="text-lg dark:text-white text-black font-bold leading-3">
                Notlix
              </span>
            </div>
          </Link>

          {/* Copyright */}
          <p className="text-gray-600 dark:text-gray-400 text-sm text-center md:text-right">
            © {new Date().getFullYear()}{" "}
            <span className="font-medium text-gray-800 dark:text-gray-200">
              Neuctra Notlix
            </span>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
