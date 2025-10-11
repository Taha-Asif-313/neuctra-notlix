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
  X,
  Plus,
  Minus,
  SquareDashed,
  
  Square,

  Settings,
  Layout,
  Columns,
  Rows,
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
      <div className="bg-white rounded-2xl p-6 w-96 max-w-[90vw] shadow-2xl">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
              className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
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
  const [hasHeader, setHasHeader] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onInsert(rows, cols, hasHeader);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 top-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 max-w-[90vw] shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Insert Table</h3>
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
                max="20"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Columns
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="hasHeader"
              checked={hasHeader}
              onChange={(e) => setHasHeader(e.target.checked)}
              className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500"
            />
            <label htmlFor="hasHeader" className="text-sm text-gray-700">
              Include header row
            </label>
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
              className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Insert Table
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ColorModal = ({ isOpen, onClose, onColorSelect, type }) => {
  const colors = [
    "#000000", "#333333", "#666666", "#999999", "#cccccc", "#ffffff",
    "#ff4444", "#ff8844", "#ffcc44", "#44ff44", "#44ffcc", "#4488ff",
    "#8844ff", "#ff44cc", "#8b4513", "#d2691e", "#ffa500", "#ffff00"
  ];

  const handleColorSelect = (color) => {
    onColorSelect(color);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-80 max-w-[90vw] shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {type === 'text' ? 'Text Color' : 'Background Color'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorSelect(color)}
              className="w-10 h-10 rounded-lg border border-gray-200 hover:scale-110 transition-transform"
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

// Floating Table Context Menu Component
const TableContextMenu = ({ table, position, onAction, onClose }) => {
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

  if (!table || !position) return null;

  const getTableInfo = () => {
    const rows = table.rows.length;
    const cols = table.rows[0]?.cells.length || 0;
    return { rows, cols };
  };

  const { rows, cols } = getTableInfo();

  return (
    <div
      ref={menuRef}
      className="fixed inset-0 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 min-w-64 overflow-hidden"
    
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 border-b border-emerald-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-gray-900">Table Tools</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="text-xs text-gray-600 mt-1">
          {rows} × {cols} table
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {/* Row Operations */}
        <div className="p-3 border-b border-gray-100">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Rows
          </div>
          <div className="grid grid-cols-2 gap-1">
            <MenuButton
              icon={<Plus size={16} />}
              label="Add Above"
              color="green"
              onClick={() => onAction('addRowAbove')}
            />
            <MenuButton
              icon={<Plus size={16} />}
              label="Add Below"
              color="green"
              onClick={() => onAction('addRowBelow')}
            />
            <MenuButton
              icon={<Minus size={16} />}
              label="Delete Row"
              color="red"
              disabled={rows <= 1}
              onClick={() => onAction('deleteRow')}
            />
            <MenuButton
              icon={<Rows size={16} />}
              label="Select Row"
              onClick={() => onAction('selectRow')}
            />
          </div>
        </div>

        {/* Column Operations */}
        <div className="p-3 border-b border-gray-100">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Columns
          </div>
          <div className="grid grid-cols-2 gap-1">
            <MenuButton
              icon={<Plus size={16} />}
              label="Add Left"
              color="green"
              onClick={() => onAction('addColumnLeft')}
            />
            <MenuButton
              icon={<Plus size={16} />}
              label="Add Right"
              color="green"
              onClick={() => onAction('addColumnRight')}
            />
            <MenuButton
              icon={<Minus size={16} />}
              label="Delete Column"
              color="red"
              disabled={cols <= 1}
              onClick={() => onAction('deleteColumn')}
            />
            <MenuButton
              icon={<Columns size={16} />}
              label="Select Column"
              onClick={() => onAction('selectColumn')}
            />
          </div>
        </div>

        {/* Table Operations */}
        <div className="p-3 border-b border-gray-100">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Table
          </div>
          <div className="space-y-1">
            <MenuButton
              icon={<SquareDashed size={16} />}
              label="Toggle Borders"
              onClick={() => onAction('toggleBorders')}
            />
            <MenuButton
              icon={<Layout size={16} />}
              label="Set Header Row"
              onClick={() => onAction('setHeaderRow')}
            />
            <MenuButton
              icon={<Square size={16} />}
              label="Remove Header"
              onClick={() => onAction('removeHeader')}
            />
            <MenuButton
              icon={<MousePointer2 size={16} />}
              label="Select Entire Table"
              onClick={() => onAction('selectTable')}
            />
          </div>
        </div>

        {/* Advanced Operations */}
        <div className="p-3">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Advanced
          </div>
          <div className="space-y-1">
            <MenuButton
              icon={<Settings size={16} />}
              label="Table Properties"
              onClick={() => onAction('tableProperties')}
            />
            <MenuButton
              icon={<Trash2 size={16} />}
              label="Delete Table"
              color="red"
              onClick={() => onAction('deleteTable')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuButton = ({ icon, label, color = "gray", disabled = false, onClick }) => {
  const colorClasses = {
    gray: "text-gray-700 hover:bg-gray-50",
    green: "text-green-700 hover:bg-green-50",
    red: "text-red-700 hover:bg-red-50",
    blue: "text-blue-700 hover:bg-blue-50",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        colorClasses[color]
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {icon}
      {label}
    </button>
  );
};

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

  // Modal states
  const [linkModal, setLinkModal] = useState(false);
  const [tableModal, setTableModal] = useState(false);
  const [colorModal, setColorModal] = useState({ open: false, type: 'text' });

  // Table context menu state
  const [tableContextMenu, setTableContextMenu] = useState({
    table: null,
    position: null,
  });

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
      attachTableEventListeners();
    }
  }, []);

  // Attach click listeners to tables
  const attachTableEventListeners = () => {
    const tables = editorRef.current?.querySelectorAll('table');
    tables?.forEach(table => {
      table.addEventListener('click', handleTableClick);
      table.classList.add('editor-table', 'interactive-table');
    });
  };

  const handleTableClick = (e) => {
    const table = e.currentTarget;
    const rect = table.getBoundingClientRect();
    
    setTableContextMenu({
      table,
      position: {
        x: rect.right + 10,
        y: rect.top
      }
    });
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
    const range = getRange();
    if (!range) return;
    
    const span = document.createElement("span");
    if (type === "text") {
      span.style.color = color;
    } else if (type === "background") {
      span.style.backgroundColor = color;
    } else if (type === "cell") {
      const cell = range.startContainer.closest('td, th');
      if (cell) {
        cell.style.backgroundColor = color;
      } else {
        span.style.backgroundColor = color;
        const contents = range.extractContents();
        span.appendChild(contents);
        range.insertNode(span);
      }
      triggerChange();
      return;
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
      justify: "justifyFull",
    };
    exec(map[type]);
  };

  const toggleList = (type) => {
    exec(type === "bullet" ? "insertUnorderedList" : "insertOrderedList");
  };

  const toggleBlockQuote = () => exec("formatBlock", "blockquote");

  // Advanced Table Functions
  const insertTable = (rows = 3, cols = 3, hasHeader = true) => {
    const range = getRange();
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.className = "editor-table interactive-table";
    table.setAttribute('data-table', 'true');
    
    // Create header row if requested
    if (hasHeader) {
      const headerRow = document.createElement("tr");
      headerRow.className = "table-header-row";
      for (let c = 0; c < cols; c++) {
        const th = document.createElement("th");
        th.innerHTML = "Header " + (c + 1);
        th.style.border = "1px solid #e5e7eb";
        th.style.padding = "12px 16px";
        th.style.background = "linear-gradient(135deg, #f8fafc, #f1f5f9)";
        th.style.fontWeight = "600";
        th.style.color = "#374151";
        headerRow.appendChild(th);
      }
      table.appendChild(headerRow);
      rows--; // Reduce data rows by one since we added header
    }
    
    // Create data rows
    for (let r = 0; r < rows; r++) {
      const tr = document.createElement("tr");
      for (let c = 0; c < cols; c++) {
        const td = document.createElement("td");
        td.innerHTML = "<br/>";
        td.style.border = "1px solid #e5e7eb";
        td.style.padding = "12px 16px";
        td.style.minWidth = "100px";
        tr.appendChild(td);
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

  // Table context menu actions
  const handleTableAction = (action) => {
    const { table } = tableContextMenu;
    if (!table) return;

    const currentRow = table.rows[0];
    const rowCount = table.rows.length;
    const colCount = currentRow?.cells.length || 0;

    switch (action) {
      case 'addRowAbove':
        addTableRow(table, 0);
        break;
      case 'addRowBelow':
        addTableRow(table, rowCount);
        break;
      case 'deleteRow':
        if (rowCount > 1) {
          table.deleteRow(rowCount - 1);
        }
        break;
      case 'addColumnLeft':
        addTableColumn(table, 0);
        break;
      case 'addColumnRight':
        addTableColumn(table, colCount);
        break;
      case 'deleteColumn':
        if (colCount > 1) {
          deleteTableColumn(table, colCount - 1);
        }
        break;
      case 'toggleBorders':
        toggleTableBorders(table);
        break;
      case 'setHeaderRow':
        setHeaderRow(table);
        break;
      case 'removeHeader':
        removeHeaderRow(table);
        break;
      case 'selectRow':
        selectTableRow(table, 0);
        break;
      case 'selectColumn':
        selectTableColumn(table, 0);
        break;
      case 'selectTable':
        selectEntireTable(table);
        break;
      case 'deleteTable':
        table.remove();
        break;
      case 'tableProperties':
        showTableProperties(table);
        break;
    }

    triggerChange();
    setTableContextMenu({ table: null, position: null });
  };

  const addTableRow = (table, index) => {
    const newRow = table.insertRow(index);
    const colCount = table.rows[0].cells.length;
    
    for (let i = 0; i < colCount; i++) {
      const cell = newRow.insertCell(i);
      cell.innerHTML = "<br/>";
      cell.style.border = "1px solid #e5e7eb";
      cell.style.padding = "12px 16px";
    }
  };

  const addTableColumn = (table, index) => {
    Array.from(table.rows).forEach(row => {
      const cell = row.insertCell(index);
      cell.innerHTML = "<br/>";
      cell.style.border = "1px solid #e5e7eb";
      cell.style.padding = "12px 16px";
      
      // Style header cells differently
      if (row.cells[0]?.tagName === 'TH') {
        cell.style.background = "linear-gradient(135deg, #f8fafc, #f1f5f9)";
        cell.style.fontWeight = "600";
      }
    });
  };

  const deleteTableColumn = (table, index) => {
    Array.from(table.rows).forEach(row => {
      if (row.cells[index]) {
        row.deleteCell(index);
      }
    });
  };

  const toggleTableBorders = (table) => {
    const hasBorder = table.rows[0]?.cells[0]?.style.border !== "none";
    Array.from(table.rows).forEach(row => {
      Array.from(row.cells).forEach(cell => {
        cell.style.border = hasBorder ? "none" : "1px solid #e5e7eb";
      });
    });
  };

  const setHeaderRow = (table) => {
    const firstRow = table.rows[0];
    Array.from(firstRow.cells).forEach(cell => {
      const th = document.createElement('th');
      th.innerHTML = cell.innerHTML;
      th.style.border = "1px solid #e5e7eb";
      th.style.padding = "12px 16px";
      th.style.background = "linear-gradient(135deg, #f8fafc, #f1f5f9)";
      th.style.fontWeight = "600";
      cell.replaceWith(th);
    });
  };

  const removeHeaderRow = (table) => {
    const firstRow = table.rows[0];
    Array.from(firstRow.cells).forEach(cell => {
      const td = document.createElement('td');
      td.innerHTML = cell.innerHTML;
      td.style.border = "1px solid #e5e7eb";
      td.style.padding = "12px 16px";
      cell.replaceWith(td);
    });
  };

  const selectTableRow = (table, rowIndex) => {
    // Implementation for row selection
    console.log('Select row:', rowIndex);
  };

  const selectTableColumn = (table, colIndex) => {
    // Implementation for column selection
    console.log('Select column:', colIndex);
  };

  const selectEntireTable = (table) => {
    const range = document.createRange();
    range.selectNode(table);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const showTableProperties = (table) => {
    const rows = table.rows.length;
    const cols = table.rows[0]?.cells.length || 0;
    alert(`Table Properties:\nRows: ${rows}\nColumns: ${cols}\nTotal Cells: ${rows * cols}`);
  };

  // Input handler
  const handleInput = () => {
    triggerChange();
    // Reattach event listeners to any new tables
    setTimeout(attachTableEventListeners, 0);
  };

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
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 relative rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div
        className={`bg-white  transition-all duration-300 overflow-hidden`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Advanced Editor</h2>
              <p className="text-sm text-gray-500">Professional rich text editing</p>
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
          <ToolbarButton
            icon={<div className="w-4 h-4 border-2 border-gray-400 rounded" />}
            title="Cell Color"
            onClick={() => setColorModal({ open: true, type: 'cell' })}
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
            onClick={() => setLinkModal(true)}
          />
          <ToolbarButton
            icon={<Table size={18} />}
            title="Insert Table"
            onClick={() => setTableModal(true)}
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

      {/* TABLE CONTEXT MENU */}
      <TableContextMenu
        table={tableContextMenu.table}
        position={tableContextMenu.position}
        onAction={handleTableAction}
        onClose={() => setTableContextMenu({ table: null, position: null })}
      />

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
          background: white;
          transition: all 0.3s ease;
          position: relative;
        }
        .rich-text-editor table.interactive-table:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        .rich-text-editor table.interactive-table:active {
          transform: translateY(0);
        }
        .rich-text-editor td, .rich-text-editor th {
          border: 1px solid #e5e7eb;
          padding: 12px 16px;
          transition: all 0.2s ease;
          min-width: 100px;
          position: relative;
          cursor: cell;
        }
        .rich-text-editor th {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
        }
        .rich-text-editor td:hover {
          background: #f9fafb;
        }
        .rich-text-editor th:hover {
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
        }
        .rich-text-editor a {
          color: #059669;
          text-decoration: underline;
          transition: color 0.2s ease;
          font-weight: 500;
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
        
        /* Table selection styles */
        .table-selected-row {
          background: #f0f9ff !important;
        }
        .table-selected-column {
          background: #fff7ed !important;
        }
        .table-selected-cell {
          background: #fefce8 !important;
          outline: 2px solid #f59e0b;
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