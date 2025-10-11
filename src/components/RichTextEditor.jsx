import React, { useEffect, useRef, useState } from "react";
import {
  Bold,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Type,
  Clock,
  Sparkles,
  Link,
  Quote,
  Table,
  Trash2,
  Palette,
  Highlighter,
  Eraser,
  X,
  Plus,
  Minus,
  Settings,
  MousePointer2,
} from "lucide-react";

// Modal Components
const LinkModal = ({ isOpen, onClose, onInsert }) => {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onInsert(url, text || url);
      setUrl("");
      setText("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw] shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Insert Link</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Text (Optional)
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Link text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Insert Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TableModal = ({ isOpen, onClose, onInsert }) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);

  const handleSubmit = (e) => {
    e.preventDefault();
    onInsert(rows, cols);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 max-w-[90vw] shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Create Table</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rows
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Columns
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Table
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ColorModal = ({ isOpen, onClose, onColorSelect, type }) => {
  const colors = [
    "#000000", "#dc2626", "#ea580c", "#ca8a04", "#16a34a", "#0891b2",
    "#2563eb", "#7c3aed", "#c026d3", "#4c0519", "#374151", "#6b7280"
  ];

  const handleColorSelect = (color) => {
    onColorSelect(color);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 max-w-[90vw] shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {type === 'text' ? 'Text Color' : 'Background Color'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="grid grid-cols-6 gap-3">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorSelect(color)}
              className="w-8 h-8 rounded-lg border border-gray-200 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Color
          </label>
          <input
            type="color"
            onChange={(e) => handleColorSelect(e.target.value)}
            className="w-full h-10 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

// Simple Table Options Component
const TableOptions = ({ table, onClose, onAction }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!table) return null;

  const rowCount = table.rows.length;
  const colCount = table.rows[0]?.cells.length || 0;

  return (
    <div
      ref={menuRef}
      className="absolute bg-white rounded-lg shadow-lg border border-gray-200 z-50 w-48 overflow-hidden"
      style={{ top: '10px', right: '10px' }}
    >
      <div className="p-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-gray-900 text-sm">Table Options</span>
        </div>
        <div className="text-xs text-gray-600 mt-1">
          {rowCount} × {colCount}
        </div>
      </div>

      <div className="p-2 space-y-1">
        <button
          onClick={() => onAction('addRow')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-gray-700 hover:bg-blue-50 transition-colors"
        >
          <Plus size={14} />
          Add Row
        </button>
        <button
          onClick={() => onAction('addColumn')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-gray-700 hover:bg-blue-50 transition-colors"
        >
          <Plus size={14} />
          Add Column
        </button>
        <button
          onClick={() => onAction('deleteRow')}
          disabled={rowCount <= 1}
          className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-gray-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Minus size={14} />
          Delete Row
        </button>
        <button
          onClick={() => onAction('deleteColumn')}
          disabled={colCount <= 1}
          className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-gray-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Minus size={14} />
          Delete Column
        </button>
        <button
          onClick={() => onAction('deleteTable')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={14} />
          Delete Table
        </button>
      </div>
    </div>
  );
};

const RichTextEditor = ({ content = "<p><br></p>", setContent }) => {
  const editorRef = useRef(null);
  const [html, setHtml] = useState(content);
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [isTyping, setIsTyping] = useState(false);
  const saveTimerRef = useRef(null);

  // Modal states
  const [linkModal, setLinkModal] = useState(false);
  const [tableModal, setTableModal] = useState(false);
  const [colorModal, setColorModal] = useState({ open: false, type: 'text' });

  // Table options state
  const [selectedTable, setSelectedTable] = useState(null);

  // Initialize HTML once
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content || "<p><br></p>";
      updateCounts(editorRef.current.innerText || "");
      attachTableEventListeners();
    }
  }, []);

  // Attach click listeners to tables
  const attachTableEventListeners = () => {
    const tables = editorRef.current?.querySelectorAll('table');
    tables?.forEach(table => {
      table.addEventListener('click', handleTableClick);
      table.classList.add('editor-table');
    });
  };

  const handleTableClick = (e) => {
    const table = e.currentTarget;
    setSelectedTable(table);
  };

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

  const applyFontSize = (size) => {
    const range = getRange();
    if (!range) return;
    const span = document.createElement("span");
    span.style.fontSize = size;
    const contents = range.extractContents();
    span.appendChild(contents);
    range.insertNode(span);
    triggerChange();
  };

  const applyColor = (type, color) => {
    const range = getRange();
    if (!range) return;
    
    const span = document.createElement("span");
    if (type === "text") {
      span.style.color = color;
    } else if (type === "background") {
      span.style.backgroundColor = color;
    }
    
    const contents = range.extractContents();
    span.appendChild(contents);
    range.insertNode(span);
    triggerChange();
  };

  const insertLink = (url, text) => {
    const range = getRange();
    if (!range) return;
    
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.textContent = text || url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    
    range.deleteContents();
    range.insertNode(anchor);
    triggerChange();
  };

  const applyAlign = (type) => {
    const map = {
      left: "justifyLeft",
      center: "justifyCenter",
      right: "justifyRight",
    };
    exec(map[type]);
  };

  const toggleList = (type) => {
    exec(type === "bullet" ? "insertUnorderedList" : "insertOrderedList");
  };

  // Simple Table Functions
  const insertTable = (rows = 3, cols = 3) => {
    const range = getRange();
    const table = document.createElement("table");
    table.className = "editor-table simple-table";
    
    for (let r = 0; r < rows; r++) {
      const tr = document.createElement("tr");
      for (let c = 0; c < cols; c++) {
        const cell = r === 0 ? document.createElement("th") : document.createElement("td");
        cell.innerHTML = "<br/>";
        tr.appendChild(cell);
      }
      table.appendChild(tr);
    }
    
    // Add click listener
    table.addEventListener('click', handleTableClick);
    
    if (range) {
      range.deleteContents();
      range.insertNode(table);
    } else {
      editorRef.current?.appendChild(table);
    }
    triggerChange();
  };

  // Table actions
  const handleTableAction = (action) => {
    if (!selectedTable) return;

    const rowCount = selectedTable.rows.length;
    const colCount = selectedTable.rows[0]?.cells.length || 0;

    switch (action) {
      case 'addRow':
        const newRow = selectedTable.insertRow();
        for (let i = 0; i < colCount; i++) {
          const cell = newRow.insertCell();
          cell.innerHTML = "<br/>";
        }
        break;
        
      case 'addColumn':
        Array.from(selectedTable.rows).forEach(row => {
          const cell = row.insertCell();
          cell.innerHTML = "<br/>";
        });
        break;
        
      case 'deleteRow':
        if (rowCount > 1) {
          selectedTable.deleteRow(rowCount - 1);
        }
        break;
        
      case 'deleteColumn':
        if (colCount > 1) {
          Array.from(selectedTable.rows).forEach(row => {
            if (row.cells[colCount - 1]) {
              row.deleteCell(colCount - 1);
            }
          });
        }
        break;
        
      case 'deleteTable':
        selectedTable.remove();
        setSelectedTable(null);
        break;
    }

    triggerChange();
  };

  // Input handler
  const handleInput = () => {
    triggerChange();
    setTimeout(attachTableEventListeners, 0);
  };

  const clearFormatting = () => {
    exec("removeFormat");
  };

  return (
    <div className="w-full h-full bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-white">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Text Editor</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg">
              <Type className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                {wordCount} words
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg">
              <Clock className="w-4 h-4 text-blue-600" />
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

        {/* SIMPLIFIED TOOLBAR */}
        <div className="flex items-center gap-1 p-3 border-b border-gray-200 bg-white">
          {/* Basic Formatting */}
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

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

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

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

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

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Colors */}
          <ToolbarButton
            icon={<Palette size={18} />}
            title="Text Color"
            onClick={() => setColorModal({ open: true, type: 'text' })}
          />
          <ToolbarButton
            icon={<Highlighter size={18} />}
            title="Background Color"
            onClick={() => setColorModal({ open: true, type: 'background' })}
          />

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Advanced */}
          <ToolbarButton
            icon={<Link size={18} />}
            title="Insert Link"
            onClick={() => setLinkModal(true)}
          />
          <ToolbarButton
            icon={<Table size={18} />}
            title="Insert Table"
            onClick={() => setTableModal(true)}
          />
          <ToolbarButton
            icon={<Quote size={18} />}
            title="Quote"
            onClick={() => exec("formatBlock", "blockquote")}
          />

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Clear */}
          <ToolbarButton
            icon={<Eraser size={18} />}
            title="Clear Formatting"
            onClick={clearFormatting}
          />
        </div>

        {/* EDITOR AREA */}
        <div className="min-h-[400px] bg-white relative">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            className="rich-text-editor p-6 outline-none"
          />
          
          {/* Table Options */}
          {selectedTable && (
            <TableOptions
              table={selectedTable}
              onClose={() => setSelectedTable(null)}
              onAction={handleTableAction}
            />
          )}
        </div>
      </div>

      {/* MODALS */}
      <LinkModal
        isOpen={linkModal}
        onClose={() => setLinkModal(false)}
        onInsert={insertLink}
      />
      <TableModal
        isOpen={tableModal}
        onClose={() => setTableModal(false)}
        onInsert={insertTable}
      />
      <ColorModal
        isOpen={colorModal.open}
        onClose={() => setColorModal({ open: false, type: 'text' })}
        onColorSelect={(color) => applyColor(colorModal.type, color)}
        type={colorModal.type}
      />

      {/* STYLE */}
      <style>{`
        .toolbar-btn {
          background: white;
          border: 1px solid #e5e7eb;
          padding: 6px 10px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          color: #374151;
        }
        .toolbar-btn:hover {
          background: #eff6ff;
          border-color: #3b82f6;
          color: #1d4ed8;
        }
        .rich-text-editor {
          font-size: 16px;
          line-height: 1.6;
          color: #1f2937;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .rich-text-editor:focus {
          background: white;
        }
        .rich-text-editor blockquote {
          border-left: 4px solid #3b82f6;
          margin: 16px 0;
          padding: 12px 20px;
          background: #eff6ff;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: #1e40af;
        }
        .rich-text-editor table.simple-table {
          border-collapse: collapse;
          width: 100%;
          margin: 16px 0;
          border: 1px solid #e5e7eb;
          background: white;
        }
        .rich-text-editor table.simple-table th,
        .rich-text-editor table.simple-table td {
          border: 1px solid #e5e7eb;
          padding: 8px 12px;
          min-width: 80px;
        }
        .rich-text-editor table.simple-table th {
          background: #f8fafc;
          font-weight: 600;
        }
        .rich-text-editor table.simple-table:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .rich-text-editor a {
          color: #2563eb;
          text-decoration: underline;
        }
        .rich-text-editor a:hover {
          color: #1d4ed8;
        }
        .rich-text-editor ul, .rich-text-editor ol {
          margin: 8px 0;
          padding-left: 24px;
        }
        .rich-text-editor li {
          margin: 2px 0;
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

export default RichTextEditor;