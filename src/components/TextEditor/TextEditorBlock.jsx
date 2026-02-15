import React, { useRef, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Check,
  X,
  ChevronDown,
  Type,
  Palette,
} from "lucide-react";
import { TwitterPicker } from "react-color";

const fonts = [
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Times New Roman", value: "'Times New Roman', serif" },
  { name: "Courier New", value: "'Courier New', monospace" },
  { name: "Verdana", value: "Verdana, sans-serif" },
  { name: "Helvetica", value: "Helvetica, sans-serif" },
  { name: "Inter", value: "'Inter', sans-serif" },
];

const sizes = [12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 48];

const TextEditorBlock = ({
  initialValue = "",
  onDone,
  onCancel,
  placeholder = "Start writing...",
}) => {
  const editorRef = useRef(null);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const [fontFamily, setFontFamily] = useState(fonts[0]);
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState("#000000");

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-container")) {
        setShowFontMenu(false);
        setShowSizeMenu(false);
        setShowColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML =
        initialValue || `<p class="placeholder-text">${placeholder}</p>`;
    }
  }, [initialValue, placeholder]);

  const focusEditor = () => editorRef.current?.focus();

  const exec = (command, value = null) => {
    focusEditor();
    document.execCommand(command, false, value);
  };

  // Lists
  const toggleList = (type) => exec(type);

  // Apply font size to selection or future typing
  const applyFontSize = (size) => {
    focusEditor();
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      document.execCommand("fontSize", false, "7");
      const fonts = editorRef.current.getElementsByTagName("font");
      for (let el of fonts) {
        if (el.size === "7") {
          el.removeAttribute("size");
          el.style.fontSize = size + "px";
        }
      }
    } else {
      // Future typing
      document.execCommand("fontSize", false, "7");
    }
    setFontSize(size);
    setShowSizeMenu(false);
  };

  const applyFontFamily = (font) => {
    focusEditor();
    document.execCommand("fontName", false, font.value);
    setFontFamily(font);
    setShowFontMenu(false);
  };

  const applyTextColor = (color) => {
    focusEditor();
    exec("foreColor", color.hex);
    setTextColor(color.hex);
  };

  const handleSave = () => {
    let content = editorRef.current?.innerHTML || "";
    content = content
      .replace(/<p><br><\/p>/g, "")
      .replace(/<p class="placeholder-text">.*?<\/p>/g, "")
      .trim();
    onDone && onDone(content || "");
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gradient-to-r from-zinc-50 to-white dark:from-zinc-800 dark:to-zinc-900 border-b border-zinc-200 dark:border-zinc-700">

        {/* Text formatting */}
        <div className="flex items-center gap-1 px-1 border-r border-zinc-200 dark:border-zinc-700">
          <button onClick={() => exec("bold")} className="toolbar-btn" title="Bold"><Bold size={18} /></button>
          <button onClick={() => exec("italic")} className="toolbar-btn" title="Italic"><Italic size={18} /></button>
          <button onClick={() => exec("underline")} className="toolbar-btn" title="Underline"><Underline size={18} /></button>
          <button onClick={() => exec("strikeThrough")} className="toolbar-btn" title="Strikethrough"><Strikethrough size={18} /></button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 px-1 border-r border-zinc-200 dark:border-zinc-700">
          <button onClick={() => toggleList("insertUnorderedList")} className="toolbar-btn" title="Bullet List"><List size={18} /></button>
          <button onClick={() => toggleList("insertOrderedList")} className="toolbar-btn" title="Numbered List"><ListOrdered size={18} /></button>
        </div>

        {/* Font Dropdown */}
        <div className="dropdown-container relative px-1">
          <button
            onClick={() => setShowFontMenu(!showFontMenu)}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all text-sm"
          >
            <Type size={16} className="text-zinc-500" />
            <span className="max-w-[100px] truncate">{fontFamily.name}</span>
            <ChevronDown size={14} className={`transition-transform ${showFontMenu ? "rotate-180" : ""}`} />
          </button>
          {showFontMenu && (
            <div className="absolute z-50 mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl py-1 min-w-[180px]">
              {fonts.map((f) => (
                <button
                  key={f.name}
                  onClick={() => applyFontFamily(f)}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-zinc-700 transition-colors text-sm"
                  style={{ fontFamily: f.value }}
                >
                  {f.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Size Dropdown */}
        <div className="dropdown-container relative px-1">
          <button
            onClick={() => setShowSizeMenu(!showSizeMenu)}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all text-sm"
          >
            <span>{fontSize}px</span>
            <ChevronDown size={14} className={`transition-transform ${showSizeMenu ? "rotate-180" : ""}`} />
          </button>
          {showSizeMenu && (
            <div className="absolute z-50 mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl py-1 min-w-[100px] max-h-[200px] overflow-y-auto">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => applyFontSize(s)}
                  className={`w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-zinc-700 transition-colors text-sm ${s === fontSize ? "bg-blue-50 dark:bg-zinc-700 text-blue-600" : ""}`}
                >
                  {s}px
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color Picker */}
        <div className="dropdown-container relative px-1">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all text-sm"
          >
            <div className="w-4 h-4 rounded-full border border-zinc-300" style={{ backgroundColor: textColor }} />
            <Palette size={16} className="text-zinc-500" />
            <ChevronDown size={14} className={`transition-transform ${showColorPicker ? "rotate-180" : ""}`} />
          </button>
          {showColorPicker && (
            <div className="absolute z-50 mt-1 right-0">
              <TwitterPicker
                color={textColor}
                onChange={applyTextColor}
                triangle="top-right"
                colors={['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00','#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000']}
              />
            </div>
          )}
        </div>

      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="min-h-[200px] p-6 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-base leading-relaxed"
        style={{ fontFamily: fontFamily.value, fontSize: `${fontSize}px`, color: textColor }}
        onFocus={(e) => {
          if (e.target.innerHTML.includes("placeholder-text")) e.target.innerHTML = "";
        }}
      />

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 p-4 bg-zinc-50 dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-600 transition-all text-sm font-medium"
        >
          <X size={16} /> Cancel
        </button>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all text-sm font-medium shadow-md"
        >
          <Check size={16} /> Save Changes
        </button>
      </div>
    </div>
  );
};

export default TextEditorBlock;
