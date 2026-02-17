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
  Search as SearchIcon,
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

/* ---------------- UI Components ---------------- */
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

const DropdownBox = ({ children }) => (
  <div
    className="absolute z-50 mt-2 
      bg-white dark:bg-zinc-800 
      border border-zinc-200 dark:border-zinc-700 
      rounded-xl shadow-2xl 
      py-2 min-w-[160px] max-h-[300px] overflow-y-auto"
  >
    {children}
  </div>
);

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
  const editor = createEditorCommands(editorRef);

  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedFont, setSelectedFont] = useState(fonts[0]);
  const [selectedSize, setSelectedSize] = useState(16);
  const [selectedColor, setSelectedColor] = useState("#000000");

  const [searchQuery, setSearchQuery] = useState("");

  /* ---------------- Initialize Content ---------------- */
  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = initialValue || "";
  }, [initialValue]);

  /* ---------------- Close Dropdowns Outside Click ---------------- */
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".dropdown-container")) {
        setShowFontMenu(false);
        setShowSizeMenu(false);
        setShowColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------- Handlers ---------------- */
  const handleFontChange = (font) => {
    editor.fontFamily(font.value);
    setSelectedFont(font);
    setShowFontMenu(false);
  };

  const handleSizeChange = (size) => {
    editor.fontSize(size);
    setSelectedSize(size);
    setShowSizeMenu(false);
  };

  const handleSave = () => {
    const content = editorRef.current?.innerHTML.trim() || "";
    onDone?.(content);
  };

  /* ---------------- Undo / Redo ---------------- */
  const handleUndo = () => document.execCommand("undo");
  const handleRedo = () => document.execCommand("redo");

  /* ---------------- Render ---------------- */
  return (
    <div
      className="relative bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl 
        border border-zinc-200/60 dark:border-zinc-700/60 
        rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] 
        overflow-hidden transition-all duration-300"
    >
      {/* ---------------- Toolbar ---------------- */}
      <div
        className="sticky top-0 z-40 
          flex flex-wrap items-center gap-2 px-4 py-3 
          bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl
          border-b border-zinc-200/60 dark:border-zinc-700/60"
      >
        {/* Formatting */}
        <div className="flex items-center gap-1 bg-zinc-100/70 dark:bg-zinc-800/70 rounded-xl p-1">
          <ToolbarIcon onClick={editor.bold}>
            <Bold size={16} />
          </ToolbarIcon>
          <ToolbarIcon onClick={editor.italic}>
            <Italic size={16} />
          </ToolbarIcon>
          <ToolbarIcon onClick={editor.underline}>
            <Underline size={16} />
          </ToolbarIcon>
          <ToolbarIcon onClick={editor.strike}>
            <Strikethrough size={16} />
          </ToolbarIcon>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 bg-zinc-100/70 dark:bg-zinc-800/70 rounded-xl p-1">
          <ToolbarIcon onClick={() => editor.align("left")}>
            <AlignLeft size={16} />
          </ToolbarIcon>
          <ToolbarIcon onClick={() => editor.align("center")}>
            <AlignCenter size={16} />
          </ToolbarIcon>
          <ToolbarIcon onClick={() => editor.align("right")}>
            <AlignRight size={16} />
          </ToolbarIcon>
          <ToolbarIcon onClick={() => editor.align("justify")}>
            <AlignJustify size={16} />
          </ToolbarIcon>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 bg-zinc-100/70 dark:bg-zinc-800/70 rounded-xl p-1">
          <ToolbarIcon onClick={editor.unorderedList}>
            <List size={16} />
          </ToolbarIcon>
          <ToolbarIcon onClick={editor.orderedList}>
            <ListOrdered size={16} />
          </ToolbarIcon>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-1 bg-zinc-100/70 dark:bg-zinc-800/70 rounded-xl p-1">
          <ToolbarIcon onClick={handleUndo}>
            <RotateCcw size={16} />
          </ToolbarIcon>
          <ToolbarIcon onClick={handleRedo}>
            <RotateCw size={16} />
          </ToolbarIcon>
        </div>

        {/* Font Selector */}
        <div className="dropdown-container relative">
          <button
            onClick={() => setShowFontMenu(!showFontMenu)}
            onMouseDown={(e) => e.preventDefault()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg
              bg-zinc-100/70 dark:bg-zinc-800/70 text-sm"
          >
            <Type size={14} />
            <span className="max-w-[80px] truncate">{selectedFont.name}</span>
            <ChevronDown size={14} />
          </button>

          {showFontMenu && (
            <DropdownBox>
              {fonts.map((f) => (
                <DropdownItem
                  key={f.name}
                  onClick={() => handleFontChange(f)}
                  style={{ fontFamily: f.value }}
                >
                  {f.name}
                </DropdownItem>
              ))}
            </DropdownBox>
          )}
        </div>

        {/* Size Selector */}
        <div className="dropdown-container relative">
          <button
            onClick={() => setShowSizeMenu(!showSizeMenu)}
            onMouseDown={(e) => e.preventDefault()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg
              bg-zinc-100/70 dark:bg-zinc-800/70 text-sm"
          >
            {selectedSize}px
            <ChevronDown size={14} />
          </button>

          {showSizeMenu && (
            <DropdownBox>
              {sizes.map((s) => (
                <DropdownItem key={s} onClick={() => handleSizeChange(s)}>
                  {s}px
                </DropdownItem>
              ))}
            </DropdownBox>
          )}
        </div>

        {/* ---------------- Color Picker ---------------- */}
        <div className="dropdown-container relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            onMouseDown={(e) => e.preventDefault()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg
      bg-zinc-100/70 dark:bg-zinc-800/70"
          >
            <div
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: selectedColor }}
            />
            <Palette size={14} />
          </button>

          {showColorPicker && (
            <div className="absolute z-50 mt-2 right-0 shadow-2xl rounded-xl overflow-visible">
              <ColorPicker
                selectedColor={selectedColor}
                onSelect={(color) => {
                  editor.color(color); // use your editor command
                  setSelectedColor(color);
                  setShowColorPicker(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Clear Formatting */}
        <div className="flex items-center gap-1 bg-zinc-100/70 dark:bg-zinc-800/70 rounded-xl p-1">
          <ToolbarIcon onClick={editor.clearFormatting}>
            <Eraser size={16} />
          </ToolbarIcon>
        </div>
      </div>

      {/* ---------------- Editor ---------------- */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="
    w-full
    max-w-full
    min-h-[220px]

    px-4 py-4
    text-[16px] leading-relaxed
    focus:outline-none

    break-words
    whitespace-normal
    overflow-x-hidden

    text-black dark:text-white

    [&_*]:max-w-full
    [&_*]:break-words
    [&_*]:whitespace-normal

    [&_img]:max-w-full
    [&_img]:h-auto

    [&_table]:block
    [&_table]:w-full
    [&_table]:overflow-x-auto

    [&_ul]:list-disc [&_ul]:pl-8
    [&_ol]:list-decimal [&_ol]:pl-8

    empty:before:content-[attr(data-placeholder)]
    empty:before:text-zinc-400
  "
        data-placeholder={placeholder}
      />

      {/* ---------------- Footer ---------------- */}
      <div className="flex justify-end gap-3 px-6 pb-4">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-lg border 
            border-zinc-300 dark:border-zinc-600 
            text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-lg 
            bg-primary text-white 
            text-sm font-semibold 
            shadow-lg hover:shadow-xl
            hover:bg-primary/80
            active:scale-[0.98]
            transition-all duration-200"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default TextEditorBlock;
