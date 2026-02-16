import React, { useState, useRef } from "react";

const defaultColors = [
  "#000000", "#444444", "#666666", "#999999",
  "#FFFFFF", "#FF0000", "#FF7F00", "#FFFF00",
  "#00FF00", "#00FFFF", "#0000FF", "#8000FF",
  "#FF00FF", "#FFC0CB", "#A52A2A", "#4B0082",
];

const ColorPicker = ({ selectedColor, onSelect }) => {
  const [customColor, setCustomColor] = useState(selectedColor);
  const inputRef = useRef(null);

  const handleCustomChange = (e) => {
    const input = inputRef.current;
    let value = e.target.value;

    // Always start with #
    if (!value.startsWith("#")) value = "#" + value.replace("#", "");

    // Preserve cursor position
    const start = input.selectionStart;
    const end = input.selectionEnd;

    setCustomColor(value);

    // Restore cursor after React updates
    requestAnimationFrame(() => {
      input.setSelectionRange(start, end);
    });
  };

  const applyCustomColor = () => {
    if (/^#[0-9A-Fa-f]{6}$/.test(customColor)) {
      onSelect(customColor); // Apply only valid 6-digit hex
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      applyCustomColor();
    }
  };

  return (
    <div className="p-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl shadow-lg w-72">
      {/* Color Grid */}
      <div className="grid grid-cols-4 gap-3 mb-3">
        {defaultColors.map((color) => (
          <button
            key={color}
            onClick={() => onSelect(color)}
            className={`w-10 h-10 rounded-lg border transition-transform duration-150 ${
              selectedColor === color ? "ring-2 ring-primary" : ""
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Custom Hex Input */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={customColor}
          onChange={handleCustomChange}
          onKeyDown={handleKeyDown}
          placeholder="#FFFFFF"
          className="flex-1 px-2 py-1 rounded-lg border border-zinc-300 dark:border-zinc-600 text-sm dark:bg-zinc-700"
          maxLength={7}
        />
        <button
          onClick={applyCustomColor}
          className="px-3 py-1 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/80 transition"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default ColorPicker;
