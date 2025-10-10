import React, { useEffect, useRef, useState } from "react";
import {
  Bold,
  Underline,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Type,
  Clock,
  Sparkles,
  Link,
  Quote,
  ArrowLeftRight,
  Table,
  Columns3,
  Rows3,
  Trash2,
  Palette,
  Highlighter,
  Eraser,
  ArrowRightLeft,
} from "lucide-react";

const RichTextEditor = ({ content = "<p><br></p>", setContent }) => {
  const editorRef = useRef(null);
  const [html, setHtml] = useState(content);
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [isTyping, setIsTyping] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [fontSize, setFontSize] = useState("16px");
  const [customSizeValue, setCustomSizeValue] = useState("");
  const saveTimerRef = useRef(null);

  // Detect mobile layout
  useEffect(() => {
    const onResize = () => setMobileView(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Initialize HTML once
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content || "<p><br></p>";
      updateCounts(editorRef.current.innerText || "");
    }
  }, []);

  // Helpers
  const getRange = () => {
    const sel = window.getSelection();
    return sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
  };

  const exec = (cmd, value) => {
    document.execCommand(cmd, false, value);
    triggerChange();
  };

  const triggerChange = () => {
    const el = editorRef.current;
    if (!el) return;
    const newHtml = el.innerHTML;
    setHtml(newHtml);
    setContent?.(newHtml);
    updateCounts(el.innerText || "");
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    setIsTyping(true);
    saveTimerRef.current = window.setTimeout(() => {
      setIsTyping(false);
      setLastSaved(new Date());
      saveTimerRef.current = null;
    }, 1000);
  };

  const updateCounts = (text) => {
    const clean = text.replace(/\u00A0/g, " ").trim();
    if (!clean) return setWordCount(0);
    const words = clean.split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  };

  const toggleCode = () => {
    const range = getRange();
    if (!range) return;
    const selected = range.cloneContents();
    const div = document.createElement("div");
    div.appendChild(selected);
    const html = div.innerHTML;
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.innerHTML = html || "<br/>";
    pre.appendChild(code);
    range.deleteContents();
    range.insertNode(pre);
    triggerChange();
  };

  const applyFontSize = (size) => {
    const range = getRange();
    if (!range) return;
    const span = document.createElement("span");
    span.style.fontSize = size;
    const contents = range.extractContents();
    span.appendChild(contents);
    range.insertNode(span);
    setFontSize(size);
    triggerChange();
  };

  const applyColor = (type, color) => {
    try {
      document.execCommand(
        type === "foreColor" ? "foreColor" : "hiliteColor",
        false,
        color
      );
    } catch {
      const range = getRange();
      if (!range) return;
      const span = document.createElement("span");
      if (type === "foreColor") span.style.color = color;
      else span.style.backgroundColor = color;
      const contents = range.extractContents();
      span.appendChild(contents);
      range.insertNode(span);
    }
    triggerChange();
  };

  const insertLink = () => {
    const url = window.prompt("Enter link URL:");
    if (url) exec("createLink", url);
  };

  const applyAlign = (type) => {
    const map = {
      left: "justifyLeft",
      center: "justifyCenter",
      right: "justifyRight",
      justify: "justifyFull",
    };
    exec(map[type]);
  };

  const toggleList = (type) => {
    exec(type === "bullet" ? "insertUnorderedList" : "insertOrderedList");
  };

  const toggleBlockQuote = () => exec("formatBlock", "blockquote");

  // Table utilities
  const insertTable = (rows = 3, cols = 3) => {
    const range = getRange();
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.className = "editor-table";
    for (let r = 0; r < rows; r++) {
      const tr = document.createElement("tr");
      for (let c = 0; c < cols; c++) {
        const td = document.createElement("td");
        td.innerHTML = "<br/>";
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    if (range) {
      range.deleteContents();
      range.insertNode(table);
    } else {
      editorRef.current?.appendChild(table);
    }
    triggerChange();
  };

  const promptInsertTable = () => {
    const rows = parseInt(prompt("Rows?", "3") || "3");
    const cols = parseInt(prompt("Columns?", "3") || "3");
    insertTable(rows, cols);
  };

  // Input handler
  const handleInput = () => triggerChange();

  const applyCustomFontSize = () => {
    const size = customSizeValue.trim();
    if (!size) return;
    const px = /^\d+$/.test(size) ? `${size}px` : size;
    applyFontSize(px);
    setCustomSizeValue("");
  };

  const clearFormatting = () => {
    exec("removeFormat");
    exec("formatBlock", "<div>");
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div
        className={`bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden ${
          mobileView ? "rounded-none border-0" : "my-6 mx-4"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Smart Editor</h2>
              <p className="text-sm text-gray-500">Modern rich text editing</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-200">
              <Type className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">
                {wordCount} words
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-200">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">
                {lastSaved.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {isTyping ? " • typing…" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="flex flex-wrap items-center gap-2 p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          {/* Font Size */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
            <select
              value={fontSize}
              onChange={(e) => applyFontSize(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-700 outline-none"
            >
              <option value="12px">Small</option>
              <option value="14px">Medium</option>
              <option value="16px">Large</option>
              <option value="18px">XL</option>
              <option value="20px">XXL</option>
            </select>
          </div>

          {/* Custom Size */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
            <input
              className="bg-transparent text-sm w-16 outline-none placeholder-gray-400"
              placeholder="24px"
              value={customSizeValue}
              onChange={(e) => setCustomSizeValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && applyCustomFontSize()}
            />
            <button
              onClick={applyCustomFontSize}
              className="text-xs font-medium bg-emerald-500 text-white px-2 py-1 rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Set
            </button>
          </div>

          <div className="w-px h-6 bg-gray-200 mx-1"></div>

          {/* Inline formatting */}
          <ToolbarButton
            icon={<Bold size={18} />}
            title="Bold"
            onClick={() => exec("bold")}
          />
          <ToolbarButton
            icon={<Underline size={18} />}
            title="Underline"
            onClick={() => exec("underline")}
          />
          <ToolbarButton
            icon={<Code size={18} />}
            title="Code Block"
            onClick={toggleCode}
          />

          <div className="w-px h-6 bg-gray-200 mx-1"></div>

          {/* Alignment */}
          <ToolbarButton
            icon={<AlignLeft size={18} />}
            title="Align Left"
            onClick={() => applyAlign("left")}
          />
          <ToolbarButton
            icon={<AlignCenter size={18} />}
            title="Align Center"
            onClick={() => applyAlign("center")}
          />
          <ToolbarButton
            icon={<AlignRight size={18} />}
            title="Align Right"
            onClick={() => applyAlign("right")}
          />
          <ToolbarButton
            icon={<AlignJustify size={18} />}
            title="Justify"
            onClick={() => applyAlign("justify")}
          />

          <div className="w-px h-6 bg-gray-200 mx-1"></div>

          {/* Lists */}
          <ToolbarButton
            icon={<List size={18} />}
            title="Bullet List"
            onClick={() => toggleList("bullet")}
          />
          <ToolbarButton
            icon={<ListOrdered size={18} />}
            title="Numbered List"
            onClick={() => toggleList("ordered")}
          />

          <div className="w-px h-6 bg-gray-200 mx-1"></div>

          {/* Colors */}
          <ColorPicker
            icon={<Palette size={18} />}
            title="Text Color"
            onChange={(color) => applyColor("foreColor", color)}
          />
          <ColorPicker
            icon={<Highlighter size={18} />}
            title="Highlight Color"
            onChange={(color) => applyColor("hiliteColor", color)}
          />

          <div className="w-px h-6 bg-gray-200 mx-1"></div>

          {/* Advanced */}
          <ToolbarButton
            icon={<Quote size={18} />}
            title="Blockquote"
            onClick={toggleBlockQuote}
          />
          <ToolbarButton
            icon={<Link size={18} />}
            title="Insert Link"
            onClick={insertLink}
          />
          <ToolbarButton
            icon={<Table size={18} />}
            title="Insert Table"
            onClick={promptInsertTable}
          />

          <div className="w-px h-6 bg-gray-200 mx-1"></div>

          {/* Text Direction */}
          <ToolbarButton
            icon={<ArrowRightLeft size={18} />}
            title="Set LTR"
            onClick={() => exec("styleWithCSS", false) || exec("dir", "ltr")}
          />
          <ToolbarButton
            icon={<ArrowLeftRight size={18} />}
            title="Set RTL"
            onClick={() => exec("styleWithCSS", false) || exec("dir", "rtl")}
          />

          {/* Clear */}
          <ToolbarButton
            icon={<Eraser size={18} />}
            title="Clear Formatting"
            onClick={clearFormatting}
          />
        </div>

        {/* EDITOR AREA */}
        <div className={`bg-white ${mobileView ? "min-h-[70vh]" : "min-h-[500px]"}`}>
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            className="rich-text-editor"
            style={{ 
              padding: mobileView ? "20px" : "32px",
              background: "linear-gradient(to bottom, #fff, #fafafa)"
            }}
          />
        </div>
      </div>

      {/* STYLE */}
      <style>{`
        .toolbar-btn {
          background: white;
          border: 1px solid #e5e7eb;
          padding: 8px 12px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          color: #374151;
        }
        .toolbar-btn:hover {
          background: #f0fdf4;
          border-color: #86efac;
          color: #059669;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.1);
        }
        .rich-text-editor {
          font-size: 16px;
          line-height: 1.7;
          outline: none;
          color: #1f2937;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
        .rich-text-editor:focus {
          background: white;
        }
        .rich-text-editor pre {
          background: #1f2937;
          color: #f9fafb;
          padding: 16px;
          border-radius: 12px;
          overflow-x: auto;
          margin: 16px 0;
          font-family: 'Fira Code', monospace;
          border: 1px solid #374151;
        }
        .rich-text-editor blockquote {
          border-left: 4px solid #10b981;
          margin: 16px 0;
          padding: 12px 20px;
          background: #f0fdf4;
          border-radius: 0 12px 12px 0;
          font-style: italic;
          color: #065f46;
        }
        .rich-text-editor table {
          border-collapse: collapse;
          width: 100%;
          margin: 20px 0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .rich-text-editor td, .rich-text-editor th {
          border: 1px solid #e5e7eb;
          padding: 12px 16px;
          transition: background 0.2s ease;
        }
        .rich-text-editor th {
          background: #f8fafc;
          font-weight: 600;
          color: #374151;
        }
        .rich-text-editor td:hover {
          background: #f9fafb;
        }
        .rich-text-editor a {
          color: #059669;
          text-decoration: underline;
          transition: color 0.2s ease;
        }
        .rich-text-editor a:hover {
          color: #047857;
        }
        .rich-text-editor ul, .rich-text-editor ol {
          margin: 12px 0;
          padding-left: 24px;
        }
        .rich-text-editor li {
          margin: 4px 0;
        }
      `}</style>
    </div>
  );
};

// Toolbar Button Component
const ToolbarButton = ({ icon, title, onClick }) => (
  <button className="toolbar-btn" title={title} onClick={onClick}>
    {icon}
  </button>
);

// Color Picker Component
const ColorPicker = ({ icon, title, onChange }) => (
  <label className="toolbar-btn cursor-pointer" title={title}>
    {icon}
    <input
      type="color"
      className="absolute opacity-0 w-0 h-0"
      onChange={(e) => onChange(e.target.value)}
    />
  </label>
);

export default RichTextEditor;