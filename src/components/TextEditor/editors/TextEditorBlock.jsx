import React, { useRef, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronDown,
  Type,
  Palette,
  RotateCcw,
  RotateCw,
  Eraser,
} from "lucide-react";
import { createEditorCommands } from "../../../utils/editorCommands";
import ColorPicker from "../ColorPicker";

/* ---------------- Fonts & Sizes ---------------- */
const fonts = [
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Jameel Noori", value: "JameelNoori, Noto Nastaliq Urdu, serif" },
  { name: "Times New Roman", value: "'Times New Roman', serif" },
  { name: "Courier New", value: "'Courier New', monospace" },
  { name: "Quran Font", value: "QuranFont, Scheherazade New, Amiri, serif" },
  { name: "Quran Surah Font", value: "QuranSurah, Scheherazade New, serif" },
  { name: "Hafs", value: "Hafs, Scheherazade New, serif" },
  { name: "Inter", value: "'Inter', sans-serif" },
];

const sizes = [12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 48];

/* ---------------- Toolbar Button ---------------- */
const ToolbarIcon = ({ children, onClick }) => (
  <button
    onClick={onClick}
    onMouseDown={(e) => e.preventDefault()}
    className="p-2 rounded-lg transition-all duration-200
      text-zinc-600 dark:text-zinc-300
      hover:bg-white dark:hover:bg-zinc-700 hover:text-primary"
  >
    {children}
  </button>
);

/* ---------------- Dropdown Wrapper ---------------- */
const DropdownWrapper = ({ isOpen, align = "left", children }) => {
  if (!isOpen) return null;

  return (
    <div
      className={`
        absolute z-[999]
        mt-2
        ${align === "right" ? "right-0" : "left-0"}
        bg-white dark:bg-zinc-800
        border border-zinc-200 dark:border-zinc-700
        rounded-xl shadow-2xl
        min-w-[160px]
        max-h-[300px]
        overflow-y-auto
      `}
    >
      {children}
    </div>
  );
};

const DropdownItem = ({ children, ...props }) => (
  <button
    {...props}
    onMouseDown={(e) => e.preventDefault()}
    className="w-full text-left px-4 py-2 
      hover:bg-zinc-100 dark:hover:bg-zinc-700 
      text-sm transition"
  >
    {children}
  </button>
);

const TextEditorBlock = ({
  initialValue = "",
  onDone,
  onCancel,
  placeholder = "Start writing...",
}) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const editor = createEditorCommands(editorRef);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedFont, setSelectedFont] = useState(fonts[0]);
  const [selectedSize, setSelectedSize] = useState(16);
  const [selectedColor, setSelectedColor] = useState("#000000");

  /* ---------------- Initialize Content ---------------- */
  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = initialValue || "";
  }, [initialValue]);

  /* ---------------- Close Dropdowns Outside ---------------- */
  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------- Handlers ---------------- */
  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const handleFontChange = (font) => {
    editor.fontFamily(font.value);
    setSelectedFont(font);
    setActiveDropdown(null);
  };

  const handleSizeChange = (size) => {
    editor.fontSize(size);
    setSelectedSize(size);
    setActiveDropdown(null);
  };

  const handleSave = () => {
    const content = editorRef.current?.innerHTML.trim() || "";
    onDone?.(content);
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl 
        border border-zinc-200/60 dark:border-zinc-700/60 
        rounded-2xl shadow-lg overflow-visible"
    >
      {/* ---------------- Toolbar ---------------- */}
      <div className="sticky top-0 z-40 flex flex-wrap items-center gap-2 px-4 py-3 bg-white/90 dark:bg-zinc-900/90 border-b border-zinc-200/60 dark:border-zinc-700/60">

        {/* Formatting */}
        <div className="flex items-center gap-1 bg-zinc-100/70 dark:bg-zinc-800/70 rounded-xl p-1">
          <ToolbarIcon onClick={editor.bold}><Bold size={16} /></ToolbarIcon>
          <ToolbarIcon onClick={editor.italic}><Italic size={16} /></ToolbarIcon>
          <ToolbarIcon onClick={editor.underline}><Underline size={16} /></ToolbarIcon>
          <ToolbarIcon onClick={editor.strike}><Strikethrough size={16} /></ToolbarIcon>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 bg-zinc-100/70 dark:bg-zinc-800/70 rounded-xl p-1">
          <ToolbarIcon onClick={() => editor.align("left")}><AlignLeft size={16} /></ToolbarIcon>
          <ToolbarIcon onClick={() => editor.align("center")}><AlignCenter size={16} /></ToolbarIcon>
          <ToolbarIcon onClick={() => editor.align("right")}><AlignRight size={16} /></ToolbarIcon>
          <ToolbarIcon onClick={() => editor.align("justify")}><AlignJustify size={16} /></ToolbarIcon>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 bg-zinc-100/70 dark:bg-zinc-800/70 rounded-xl p-1">
          <ToolbarIcon onClick={editor.unorderedList}><List size={16} /></ToolbarIcon>
          <ToolbarIcon onClick={editor.orderedList}><ListOrdered size={16} /></ToolbarIcon>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-1 bg-zinc-100/70 dark:bg-zinc-800/70 rounded-xl p-1">
          <ToolbarIcon onClick={() => document.execCommand("undo")}><RotateCcw size={16} /></ToolbarIcon>
          <ToolbarIcon onClick={() => document.execCommand("redo")}><RotateCw size={16} /></ToolbarIcon>
        </div>

        {/* Font Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("font")}
            onMouseDown={(e) => e.preventDefault()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100/70 dark:bg-zinc-800/70 text-sm"
          >
            <Type size={14} />
            <span className="max-w-[80px] truncate">{selectedFont.name}</span>
            <ChevronDown size={14} />
          </button>

          <DropdownWrapper isOpen={activeDropdown === "font"}>
            {fonts.map((f) => (
              <DropdownItem
                key={f.name}
                onClick={() => handleFontChange(f)}
                style={{ fontFamily: f.value }}
              >
                {f.name}
              </DropdownItem>
            ))}
          </DropdownWrapper>
        </div>

        {/* Size Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("size")}
            onMouseDown={(e) => e.preventDefault()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100/70 dark:bg-zinc-800/70 text-sm"
          >
            {selectedSize}px
            <ChevronDown size={14} />
          </button>

          <DropdownWrapper isOpen={activeDropdown === "size"}>
            {sizes.map((s) => (
              <DropdownItem key={s} onClick={() => handleSizeChange(s)}>
                {s}px
              </DropdownItem>
            ))}
          </DropdownWrapper>
        </div>

        {/* Color Picker */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("color")}
            onMouseDown={(e) => e.preventDefault()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100/70 dark:bg-zinc-800/70"
          >
            <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: selectedColor }} />
            <Palette size={14} />
          </button>

          <DropdownWrapper isOpen={activeDropdown === "color"} align="right">
            <ColorPicker
              selectedColor={selectedColor}
              onSelect={(color) => {
                editor.color(color);
                setSelectedColor(color);
                setActiveDropdown(null);
              }}
            />
          </DropdownWrapper>
        </div>

        {/* Clear */}
        <div className="flex items-center gap-1 bg-zinc-100/70 dark:bg-zinc-800/70 rounded-xl p-1">
          <ToolbarIcon onClick={editor.clearFormatting}>
            <Eraser size={16} />
          </ToolbarIcon>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        className="w-full min-h-[220px] px-4 py-4 text-[16px] break-words overflow-x-hidden focus:outline-none text-black dark:text-white"
      />

      {/* Footer */}
      <div className="flex justify-end gap-3 px-6 pb-4">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-600 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/80 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default TextEditorBlock;
