import React, { useRef, useEffect, useState, cloneElement } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Dropdown = ({
  open,
  anchorRef,
  children,
  className = "",
  onClose,
  autoCloseOnSelect = false, // closes only for clickable items, not inputs
}) => {
  const dropdownRef = useRef(null);
  const [style, setStyle] = useState({});

  // ✅ Position dropdown relative to anchor, clamp to viewport
  useEffect(() => {
    if (!open || !anchorRef?.current || !dropdownRef.current) return;

    const rect = anchorRef.current.getBoundingClientRect();
    const dd = dropdownRef.current;
    const margin = 8;

    let top = rect.bottom + margin;
    let left = rect.left;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const availableHeight = viewportHeight - top - margin;
    const maxHeight = Math.max(150, Math.min(availableHeight, 320));

    if (left + dd.offsetWidth > viewportWidth - margin) {
      left = viewportWidth - dd.offsetWidth - margin;
    }
    if (left < margin) left = margin;

    setStyle({
      top: `${top}px`,
      left: `${left}px`,
      maxHeight: `${maxHeight}px`,
    });
  }, [open, anchorRef, children]);

  // 🧩 Close dropdown when clicking outside
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

  // ✅ Auto-close children if clicked (skip inputs)
  const wrappedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    const isInput = child.type === "input" || child.props.type === "text" || child.props.type === "color";
    return cloneElement(child, {
      onClick: (e) => {
        child.props.onClick?.(e);
        if (autoCloseOnSelect && !isInput) onClose?.();
      },
    });
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{
            position: "fixed",
            ...style,
            zIndex: 9999,
            overflowY: "auto",
          }}
          className={`rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent ${className}`}
        >
          {wrappedChildren}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Dropdown;
