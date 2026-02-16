import React, { useRef, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link2,
  Quote,
  Code,
  Palette,
  Type,
  Minimize2,
  Maximize2,
  RotateCcw,
  Copy,
  Download,
  ChevronDown,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
} from "lucide-react";

const fonts = [
  { name: "Inter", value: "'Inter', sans-serif" },
  { name: "Geist", value: "'Geist', -apple-system, sans-serif" },
  { name: "Merriweather", value: "'Merriweather', serif" },
  { name: "Playfair", value: "'Playfair Display', serif" },
  { name: "JetBrains", value: "'JetBrains Mono', monospace" },
  { name: "Fira Code", value: "'Fira Code', monospace" },
];

const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 48];

const colors = [
  "#000000", "#1F2937", "#374151", "#6B7280",
  "#EF4444", "#F97316", "#FBBF24", "#10B981",
  "#06B6D4", "#3B82F6", "#8B5CF6", "#EC4899",
];

const ToolbarButton = ({ icon: Icon, label, onClick, isActive, size = 18 }) => (
  <button
    onClick={onClick}
    title={label}
    type="button"
    className={`p-2.5 rounded-lg transition-all duration-200 flex-shrink-0 ${
      isActive
        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md"
        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
    }`}
  >
    <Icon size={size} strokeWidth={2} />
  </button>
);

const Divider = () => (
  <div className="w-px h-6 bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:via-gray-600" />
);

const ModernTextEditor = ({
  initialValue = "",
  onDone,
  onCancel,
  placeholder = "Start writing something amazing...",
}) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [selectedFont, setSelectedFont] = useState(fonts[0]);
  const [selectedSize, setSelectedSize] = useState(16);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".dropdown-trigger")) {
        setShowColorPicker(false);
        setShowFontMenu(false);
        setShowSizeMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current) {
      if (initialValue) {
        editorRef.current.innerHTML = initialValue;
      } else {
        editorRef.current.innerHTML = "";
      }
      updateStats();
    }
  }, [initialValue]);

  // Detect dark mode
  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(isDark);
  }, []);

  // Update word and character count
  const updateStats = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || "";
      setCharCount(text.length);
      const wordArray = text.trim().split(/\s+/).filter(Boolean);
      setWordCount(wordArray.length);
    }
  };

  // Execute formatting commands
  const execCommand = (command, value = null) => {
    try {
      document.execCommand(command, false, value);
      editorRef.current?.focus();
    } catch (error) {
      console.error(`Command ${command} failed:`, error);
    }
  };

  // Apply inline styles to selected text
  const applyInlineStyle = (styleObj) => {
    const selection = window.getSelection();
    
    if (!selection.rangeCount) {
      console.warn("No selection range");
      return;
    }

    const range = selection.getRangeAt(0);
    
    if (range.collapsed) {
      console.warn("Selection is collapsed");
      return;
    }

    try {
      const selectedContent = range.extractContents();
      const span = document.createElement("span");
      
      // Apply styles
      Object.keys(styleObj).forEach(key => {
        span.style[key] = styleObj[key];
      });
      
      span.appendChild(selectedContent);
      range.insertNode(span);
      
      // Reset selection
      selection.removeAllRanges();
      editorRef.current?.focus();
      updateStats();
    } catch (error) {
      console.error("Failed to apply inline style:", error);
    }
  };

  // Insert heading
  const insertHeading = (level) => {
    try {
      execCommand("formatBlock", `<h${level}>`);
      updateStats();
    } catch (error) {
      console.error(`Failed to insert h${level}:`, error);
    }
  };

  // Insert link
  const insertLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url && url.trim()) {
      try {
        execCommand("createLink", url);
        updateStats();
      } catch (error) {
        console.error("Failed to insert link:", error);
      }
    }
  };

  // Insert quote block
  const insertQuote = () => {
    try {
      execCommand("formatBlock", "<blockquote>");
      updateStats();
    } catch (error) {
      console.error("Failed to insert quote:", error);
    }
  };

  // Insert code block
  const insertCode = () => {
    try {
      execCommand("formatBlock", "<pre>");
      updateStats();
    } catch (error) {
      console.error("Failed to insert code block:", error);
    }
  };

  // Apply text alignment
  const applyAlign = (align) => {
    try {
      const commands = {
        left: "justifyLeft",
        center: "justifyCenter",
        right: "justifyRight",
      };
      execCommand(commands[align]);
      updateStats();
    } catch (error) {
      console.error(`Failed to align ${align}:`, error);
    }
  };

  // Save document
  const handleSave = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML.trim();
      onDone?.(content);
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      const text = editorRef.current?.innerText || "";
      if (!text.trim()) {
        alert("Nothing to copy!");
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy to clipboard");
    }
  };

  // Download as HTML
  const handleDownload = () => {
    try {
      const content = editorRef.current?.innerHTML || "";
      if (!content.trim()) {
        alert("Nothing to download!");
        return;
      }
      
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      padding: 20px;
      max-width: 900px;
      margin: 0 auto;
    }
    h1, h2, h3, h4, h5, h6 { margin-top: 1em; }
    blockquote { border-left: 4px solid #ddd; padding-left: 1em; margin-left: 0; color: #666; }
    pre { background: #f4f4f4; padding: 1em; overflow-x: auto; border-radius: 4px; }
  </style>
</head>
<body>
${content}
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", "document.html");
      link.style.visibility = "hidden";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download:", err);
      alert("Failed to download document");
    }
  };

  // Clear all content
  const handleClear = () => {
    if (confirm("Clear all content? This cannot be undone.")) {
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
        updateStats();
      }
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply font family
  const handleFontSelect = (font) => {
    setSelectedFont(font);
    if (editorRef.current) {
      editorRef.current.style.fontFamily = font.value;
    }
    setShowFontMenu(false);
  };

  // Apply font size
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    if (editorRef.current) {
      editorRef.current.style.fontSize = `${size}px`;
    }
    setShowSizeMenu(false);
  };

  // Apply text color
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    if (editorRef.current) {
      editorRef.current.style.color = color;
    }
    setShowColorPicker(false);
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col h-full transition-all duration-300 ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Playfair+Display:wght@700&family=JetBrains+Mono:wght@400;700&family=Fira+Code:wght@400;700&display=swap');
        
        [contenteditable]:focus {
          outline: none;
          box-shadow: inset 0 0 0 1px transparent;
        }
      `}</style>

      {/* Main Container */}
      <div
        className={`flex-1 flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 ${
          isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""
        } ${
          isDarkMode
            ? "bg-gray-900 border-gray-800 shadow-2xl"
            : "bg-white border-gray-200 shadow-xl"
        }`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 z-40 px-6 py-4 border-b backdrop-blur-sm transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-900/95 border-gray-800"
              : "bg-white/95 border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
              <h2
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Document Editor
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                type="button"
                className={`p-2 rounded-lg transition-all ${
                  isDarkMode
                    ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title={isDarkMode ? "Light mode" : "Dark mode"}
              >
                {isDarkMode ? "☀️" : "🌙"}
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                type="button"
                className={`p-2 rounded-lg transition-all ${
                  isDarkMode
                    ? "text-gray-400 hover:bg-gray-800"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 size={18} />
                ) : (
                  <Maximize2 size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 overflow-x-auto pb-2">
            {/* Text Formatting */}
            <div className="flex items-center gap-1 p-2 rounded-xl bg-gray-100 dark:bg-gray-800">
              <ToolbarButton
                icon={Bold}
                label="Bold (Ctrl+B)"
                onClick={() => execCommand("bold")}
              />
              <ToolbarButton
                icon={Italic}
                label="Italic (Ctrl+I)"
                onClick={() => execCommand("italic")}
              />
              <ToolbarButton
                icon={Underline}
                label="Underline (Ctrl+U)"
                onClick={() => execCommand("underline")}
              />
              <ToolbarButton
                icon={Strikethrough}
                label="Strikethrough"
                onClick={() => execCommand("strikeThrough")}
              />
            </div>

            <Divider />

            {/* Headings */}
            <div className="flex items-center gap-1 p-2 rounded-xl bg-gray-100 dark:bg-gray-800">
              <ToolbarButton
                icon={Heading1}
                label="Heading 1"
                onClick={() => insertHeading(1)}
              />
              <ToolbarButton
                icon={Heading2}
                label="Heading 2"
                onClick={() => insertHeading(2)}
              />
              <ToolbarButton
                icon={Heading3}
                label="Heading 3"
                onClick={() => insertHeading(3)}
              />
            </div>

            <Divider />

            {/* Lists & Blocks */}
            <div className="flex items-center gap-1 p-2 rounded-xl bg-gray-100 dark:bg-gray-800">
              <ToolbarButton
                icon={List}
                label="Bullet List"
                onClick={() => execCommand("insertUnorderedList")}
              />
              <ToolbarButton
                icon={ListOrdered}
                label="Numbered List"
                onClick={() => execCommand("insertOrderedList")}
              />
              <ToolbarButton
                icon={Quote}
                label="Quote"
                onClick={insertQuote}
              />
              <ToolbarButton
                icon={Code}
                label="Code Block"
                onClick={insertCode}
              />
            </div>

            <Divider />

            {/* Alignment */}
            <div className="flex items-center gap-1 p-2 rounded-xl bg-gray-100 dark:bg-gray-800">
              <ToolbarButton
                icon={AlignLeft}
                label="Align Left"
                onClick={() => applyAlign("left")}
              />
              <ToolbarButton
                icon={AlignCenter}
                label="Align Center"
                onClick={() => applyAlign("center")}
              />
              <ToolbarButton
                icon={AlignRight}
                label="Align Right"
                onClick={() => applyAlign("right")}
              />
            </div>

            <Divider />

            {/* Font Selector */}
            <div className="dropdown-trigger relative">
              <button
                onClick={() => setShowFontMenu(!showFontMenu)}
                type="button"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
                    : "bg-gray-50 border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                <Type size={16} />
                <span className="text-sm font-medium">{selectedFont.name}</span>
                <ChevronDown size={14} />
              </button>
              {showFontMenu && (
                <div
                  className={`absolute top-full mt-2 left-0 z-50 border rounded-xl shadow-xl p-2 min-w-[180px] ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {fonts.map((font) => (
                    <button
                      key={font.name}
                      onClick={() => handleFontSelect(font)}
                      type="button"
                      style={{ fontFamily: font.value }}
                      className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedFont.name === font.name
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                          : isDarkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {font.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Size Selector */}
            <div className="dropdown-trigger relative">
              <button
                onClick={() => setShowSizeMenu(!showSizeMenu)}
                type="button"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
                    : "bg-gray-50 border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                <span className="text-sm font-medium">{selectedSize}px</span>
                <ChevronDown size={14} />
              </button>
              {showSizeMenu && (
                <div
                  className={`absolute top-full mt-2 left-0 z-50 border rounded-xl shadow-xl p-2 grid grid-cols-4 gap-1 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {fontSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      type="button"
                      className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                        selectedSize === size
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                          : isDarkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Color Picker */}
            <div className="dropdown-trigger relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                type="button"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                    : "bg-gray-50 border-gray-300 hover:border-gray-400"
                }`}
              >
                <div
                  className="w-5 h-5 rounded-lg border-2 border-gray-300 dark:border-gray-600 transition-all"
                  style={{ backgroundColor: selectedColor }}
                />
                <ChevronDown size={14} />
              </button>
              {showColorPicker && (
                <div
                  className={`absolute top-full mt-2 left-0 z-50 border rounded-xl shadow-xl p-3 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="grid grid-cols-6 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        type="button"
                        className={`w-8 h-8 rounded-lg border-2 transition-all transform hover:scale-110 ${
                          selectedColor === color
                            ? "border-gray-900 dark:border-gray-100 ring-2 ring-offset-2"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        style={{ backgroundColor: color }}
                        title={`Select ${color}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Divider />

            {/* Additional Actions */}
            <div className="flex items-center gap-1 p-2 rounded-xl bg-gray-100 dark:bg-gray-800">
              <ToolbarButton
                icon={Link2}
                label="Insert Link"
                onClick={insertLink}
              />
              <ToolbarButton
                icon={Copy}
                label={copyFeedback ? "Copied!" : "Copy"}
                onClick={handleCopy}
              />
              <ToolbarButton
                icon={Download}
                label="Download"
                onClick={handleDownload}
              />
              <ToolbarButton
                icon={RotateCcw}
                label="Undo"
                onClick={() => execCommand("undo")}
              />
              <ToolbarButton
                icon={Trash2}
                label="Clear All"
                onClick={handleClear}
              />
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-y-auto">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={updateStats}
            onKeyUp={updateStats}
            onPaste={(e) => {
              // Handle paste events
              setTimeout(updateStats, 0);
            }}
            className={`min-h-full px-8 py-6 focus:outline-none text-base leading-relaxed transition-all ${
              isDarkMode
                ? "bg-gray-900 text-gray-100"
                : "bg-white text-gray-900"
            }`}
            style={{
              fontFamily: selectedFont.value,
              fontSize: `${selectedSize}px`,
              color: selectedColor,
            }}
          />
        </div>

        {/* Footer */}
        <div
          className={`sticky bottom-0 flex items-center justify-between px-6 py-4 border-t transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-900/95 border-gray-800"
              : "bg-white/95 border-gray-200"
          }`}
        >
          <div className="flex items-center gap-6 text-sm">
            <div className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              <span className="font-semibold text-blue-500">{wordCount}</span> words
            </div>
            <div className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              <span className="font-semibold text-purple-500">{charCount}</span> characters
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              type="button"
              className={`px-6 py-2.5 rounded-lg font-medium transition-all border ${
                isDarkMode
                  ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              type="button"
              className="px-6 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              Save Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTextEditor;