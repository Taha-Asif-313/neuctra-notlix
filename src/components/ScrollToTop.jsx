import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to top whenever the route changes
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Always scroll to top when a new route is opened
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
