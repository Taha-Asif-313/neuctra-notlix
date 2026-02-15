import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";

/* ----------------------------------------
   🌀 Session Loading Screen (Modern)
---------------------------------------- */
const CustomLoader = ({message="Loading please wait"}) => {
  const { darkMode } = useAppContext();
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-black z-[9999]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative flex flex-col items-center gap-6"
      >
        {/* Outer Circular Ring */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary animate-spin-slow" />

          {/* Logo in center */}
          <img
            src={darkMode ? "/logo-dark.png" : "/logo-white.png"}
            alt="Logo"
            className="w-14 h-14 rounded-full object-contain drop-shadow-md"
          />
        </div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-700 dark:text-gray-300 font-medium tracking-wide"
        >
          {message}...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default CustomLoader;
