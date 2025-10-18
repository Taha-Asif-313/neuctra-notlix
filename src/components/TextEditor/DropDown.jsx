import React, { useRef, useEffect, useState, cloneElement } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Dropdown component
 * Props:
 * - open: boolean, whether dropdown is visible
 * - anchorRef: ref to the element that triggers the dropdown
 * - side: "bottom" | "top" (default "bottom")
 * - className: additional class names
 * - onClose: function to call when dropdown should close
 * - autoCloseOnSelect: boolean, whether to close dropdown when a child is clicked
 */
const Dropdown = ({
  open,
  anchorRef,
  children,
  side = "bottom",
  className = "",
  onClose,
  autoCloseOnSelect = false,
}) => {
  const dropdownRef = useRef(null);
  const [style, setStyle] = useState({});

  // Auto-position dropdown relative to anchor
  useEffect(() => {
    if (!open || !anchorRef?.current || !dropdownRef.current) return;

    const rect = anchorRef.current.getBoundingClientRect();
    const dd = dropdownRef.current;
    const margin = 8;

    let top = side === "bottom" ? rect.bottom + margin : rect.top - dd.offsetHeight - margin;
    let left = rect.left;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust if dropdown overflows bottom
    if (top + dd.offsetHeight > viewportHeight) {
      top = rect.top - dd.offsetHeight - margin;
    }

    // Adjust if dropdown overflows right
    if (left + dd.offsetWidth > viewportWidth) {
      left = viewportWidth - dd.offsetWidth - margin;
    }

    // Adjust if dropdown overflows left
    if (left < margin) left = margin;

    setStyle({ top: `${top}px`, left: `${left}px` });
  }, [open, anchorRef, children, side]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, anchorRef, onClose]);

  // Wrap children to auto-close on click if autoCloseOnSelect is true
  const wrappedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    return cloneElement(child, {
      onClick: (e) => {
        child.props.onClick?.(e); // call original click
        if (autoCloseOnSelect) onClose?.();
      },
    });
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.12 }}
          style={{ position: "fixed", ...style, zIndex: 9999 }}
          className={className}
        >
          {wrappedChildren}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Dropdown;
