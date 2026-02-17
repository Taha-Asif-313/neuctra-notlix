import React from "react";

/* 🎨 Modern Extended Color Palette */
const colorPalette = [
  "#000000","#111827","#1F2937","#374151","#4B5563","#6B7280","#9CA3AF","#D1D5DB","#E5E7EB","#F3F4F6","#FFFFFF",
  "#7F1D1D","#991B1B","#B91C1C","#DC2626","#EF4444","#F87171","#FCA5A5","#FECACA",
  "#7C2D12","#9A3412","#C2410C","#EA580C","#F97316","#FB923C","#FDBA74","#FFEDD5",
  "#713F12","#854D0E","#A16207","#CA8A04","#EAB308","#FACC15","#FDE047","#FEF9C3",
  "#052E16","#065F46","#047857","#059669","#10B981","#34D399","#6EE7B7","#D1FAE5",
  "#042F2E","#0F766E","#115E59","#14B8A6","#2DD4BF","#5EEAD4","#99F6E4","#CCFBF1",
  "#1E3A8A","#1D4ED8","#2563EB","#3B82F6","#60A5FA","#93C5FD","#BFDBFE","#DBEAFE",
  "#312E81","#3730A3","#4338CA","#4F46E5","#6366F1","#818CF8","#A5B4FC","#C7D2FE",
  "#581C87","#6B21A8","#7E22CE","#9333EA","#A855F7","#C084FC","#D8B4FE","#F3E8FF",
  "#831843","#9D174D","#BE185D","#DB2777","#EC4899","#F472B6","#F9A8D4","#FCE7F3",
  "#FFADAD","#FFD6A5","#FDFFB6","#CAFFBF","#9BF6FF","#A0C4FF","#BDB2FF","#FFC6FF",
  "#39FF14","#FF073A","#04D9FF","#FF00FF","#FFF700","#FF6EC7","#00F5D4","#F15BB5"
];

const ColorPicker = ({ selectedColor, onSelect }) => {
  return (
    <div className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl w-72">
      
      {/* 🎨 Compact Grid */}
      <div className="grid grid-cols-12 gap-1 max-h-48 overflow-y-auto pr-1">
        {colorPalette.map((color, index) => (
          <button
            key={index}
            onClick={() => onSelect(color)}
            className={`w-4 h-4 rounded-sm transition-all hover:scale-105 border ${
              selectedColor === color
                ? ""
                : "border-black/10 dark:border-white/10"
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Selected Color Preview */}
      <div className="mt-3 flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-md border"
          style={{ backgroundColor: selectedColor }}
        />
        <span className="text-xs text-zinc-600 dark:text-zinc-400">
          {selectedColor}
        </span>
      </div>
    </div>
  );
};

export default ColorPicker;
