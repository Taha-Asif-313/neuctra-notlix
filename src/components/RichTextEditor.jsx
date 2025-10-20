import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Bold,
  Underline,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link as LinkIcon,
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
  Upload,
  FileText,
  Download,
  Droplets,
  RotateCcw,
  RotateCw,
  WholeWord,
  Type,
  ArrowLeftRight,
  Columns3,
  Table2,
  LayoutGrid,
  FileDown,
} from "lucide-react";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js"; // Optional backup

import html2canvas from "html2canvas";
import Swal from "sweetalert2"; // for asking user input
import { motion, AnimatePresence } from "framer-motion";
import Dropdown from "./TextEditor/DropDown";
import TableActionsPanel from "./TextEditor/TableActionsPannel";
import exportDocument from "./TextEditor/ExportDocument";

/**
 * Fully custom RichTextEditor.jsx
 * - TailwindCSS styles
 * - Framer Motion dropdown animations
 * - Inline dropdowns (no modals)
 * - All features from your original component + Text Size dropdown
 *
 * Paste into: src/components/RichTextEditor.jsx
 */

const PRIMARY = "#00d616";

const COLOR_PRESETS = [
  "#000000",
  "#1e293b",
  "#475569",
  "#94a3b8",
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#facc15",
  "#22c55e",
  "#16a34a",
  "#3b82f6",
  "#2563eb",
  "#7c3aed",
  "#a78bfa",
  "#ec4899",
  "#00d616",
];

const ToolbarButton = ({
  title,
  children,
  onClick,
  compact = false,
  active = false,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation(); // prevents dropdowns from closing instantly
        onClick?.(e);
      }}
      title={title}
      disabled={disabled}
      aria-pressed={!!active}
      className={`
        flex items-center justify-center
        rounded-lg font-medium
        transition-all duration-150 select-none
        focus:outline-none focus:ring-2 focus:ring-primary/40 
        active:scale-[0.97]
        ${compact ? "p-2" : "px-3 py-2"}
        text-[13px] sm:text-sm
        text-gray-800 dark:text-gray-100
        bg-transparent hover:bg-gray-100 dark:hover:bg-zinc-800
        ${active ? "bg-primary/10 text-primary font-semibold" : ""}
        ${disabled ? "opacity-60 pointer-events-none" : ""}
        ${className}
      `}
      style={{
        minWidth: compact ? "40px" : "44px",
        touchAction: "manipulation", // fixes 300ms tap delay on mobile
      }}
    >
      <div className="flex items-center gap-1 sm:gap-1.5">
        {children}
        {/* Optional visible label for mobile */}
        <span className="hidden sm:inline text-xs font-medium">{title}</span>
      </div>

      {/* Screen reader label */}
      <span className="sr-only">{title}</span>
    </button>
  );
};

const RichTextEditor = forwardRef(
  ({ content = "<p><br/></p>", setContent, mobileOptimized = false }, ref) => {
    const editorRef = useRef(null);
    const rootRef = useRef(null);
    const dropdownRef = useRef(null);
    const [html, setHtml] = useState(content || "<p><br/></p>");
    const [wordCount, setWordCount] = useState(0);
    const [lastSaved, setLastSaved] = useState(new Date());
    const [isTyping, setIsTyping] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    // dropdown states (replace modals)
    const [openDropdown, setOpenDropdown] = useState(null); // 'color','highlight','link','table','size','opt'
    const [dropdownAnchor, setDropdownAnchor] = useState(null); // ref for positioning if needed

    const [quoteStyle, setQuoteStyle] = useState(1);
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedCell, setSelectedCell] = useState(null);

    const [activeColor, setActiveColor] = useState(PRIMARY);

    // undo / redo stacks
    const undoRef = useRef([]); // array of html snapshots
    const redoRef = useRef([]);
    const suppressStackRef = useRef(false);
    const saveTimerRef = useRef(null);

    // link inputs
    const [linkUrl, setLinkUrl] = useState("");
    const [linkText, setLinkText] = useState("");

    // table inputs
    const [tableRows, setTableRows] = useState(3);
    const [tableCols, setTableCols] = useState(3);

    // color dropdown type context (text/background/cell)
    const [colorType, setColorType] = useState("text");

    // size mapping (we'll use exec fontSize (1-7) fallback)
    const SIZE_PRESETS = [
      { label: "Small", value: "2" }, // ~10-12px
      { label: "Normal", value: "3" }, // default
      { label: "Large", value: "4" }, // ~18px
      { label: "Huge", value: "5" }, // ~24px
    ];

    useImperativeHandle(ref, () => ({
      setEditorContent: (html) => {
        if (editorRef.current) {
          editorRef.current.innerHTML = html;
          setHtml(html);
          setContent?.(html);
          updateCounts(editorRef.current.innerText || "");
        }
      },
      getEditorContent: () => editorRef.current?.innerHTML || "",
    }));

    useEffect(() => {
      const handleClickOutside = (e) => {
        if (
          rootRef.current &&
          !rootRef.current.contains(e.target) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target)
        ) {
          setOpenDropdown(null);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = content || "<p><br/></p>";
        updateCounts(editorRef.current.innerText || "");
        attachTableListeners();
        undoRef.current = [editorRef.current.innerHTML];
        redoRef.current = [];
      }
      editorRef.current.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (link) {
          setLinkUrl(link.href);
          setLinkText(link.textContent);
          setOpenDropdown("link");
        }
      });

      const onKeyDown = (e) => {
        const isMac = navigator.platform?.toLowerCase().includes("mac");
        const mod = isMac ? e.metaKey : e.ctrlKey;

        // Undo (Ctrl/Cmd + Z)
        if (mod && e.key.toLowerCase() === "z" && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        }
        // Redo (Ctrl/Cmd + Y) or Cmd/Ctrl+Shift+Z
        if (
          (mod && e.key.toLowerCase() === "y") ||
          (mod && e.shiftKey && e.key.toLowerCase() === "z")
        ) {
          e.preventDefault();
          handleRedo();
        }
      };

      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // close dropdown on outside click
    useEffect(() => {
      const handler = (e) => {
        if (!rootRef.current) return;
        if (!rootRef.current.contains(e.target)) {
          setOpenDropdown(null);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    // 🧠 Keyboard Shortcuts for Undo / Redo
    useEffect(() => {
      const handleKeyDown = (e) => {
        // Detect Ctrl+Z or Cmd+Z (for Mac)
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
          e.preventDefault();
          handleUndo();
        }

        // Detect Ctrl+Y or Cmd+Shift+Z (Mac convention)
        if (
          (e.ctrlKey && e.key.toLowerCase() === "y") ||
          (e.metaKey && e.shiftKey && e.key.toLowerCase() === "z")
        ) {
          e.preventDefault();
          handleRedo();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, []); // ✅ runs once

    // Add this useEffect after your other useEffects
    useEffect(() => {
      if (selectedTable && selectedRows.length > 0) {
        // Clear previous selections
        selectedTable.querySelectorAll("tr").forEach((row) => {
          row.classList.remove("selected-row");
        });

        // Apply selection to current rows
        selectedRows.forEach((rowIndex) => {
          const row = selectedTable.rows[rowIndex];
          if (row) {
            row.classList.add("selected-row");
          }
        });
      }
    }, [selectedRows, selectedTable]);

    const handleRowSelect = (rowIndex, ctrlKey = false) => {
      setSelectedRows((prev) => {
        if (ctrlKey) {
          // Multi-select with Ctrl/Cmd
          return prev.includes(rowIndex)
            ? prev.filter((i) => i !== rowIndex)
            : [...prev, rowIndex];
        } else {
          // Single select
          return [rowIndex];
        }
      });
    };

    const attachTableListeners = () => {
      const el = editorRef.current;
      if (!el) return;

      el.querySelectorAll("table").forEach((t) => {
        if (!t.__rich_attached) {
          t.addEventListener("click", (ev) => {
            ev.stopPropagation();
            setSelectedTable(t);

            const cell = ev.target.closest("td,th");
            if (cell) {
              setSelectedCell(cell);

              // Get row index - FIXED: Use the actual table 't' not undefined variable
              const row = cell.closest("tr");
              const rowIndex = Array.from(t.rows).indexOf(row);

              // Select row on click
              handleRowSelect(rowIndex, ev.ctrlKey || ev.metaKey);
            }
          });
          t.__rich_attached = true;
        }
      });
    };

    const getRange = () => {
      const sel = window.getSelection();
      return sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
    };

    const pushToUndo = (snapshot) => {
      if (suppressStackRef.current) return;
      const stack = undoRef.current;
      const last = stack[stack.length - 1];
      if (last === snapshot) return;
      stack.push(snapshot);
      if (stack.length > 80) stack.splice(0, stack.length - 80);
      redoRef.current = [];
    };

    const handleUndo = () => {
      const stack = undoRef.current;
      if (stack.length <= 1) return;
      const current = stack.pop();
      redoRef.current.push(current);
      const prev = stack[stack.length - 1];
      if (prev !== undefined) {
        suppressStackRef.current = true;
        editorRef.current.innerHTML = prev;
        setHtml(prev);
        setContent?.(prev);
        updateCounts(editorRef.current.innerText || "");
        setTimeout(() => {
          suppressStackRef.current = false;
          attachTableListeners();
        }, 20);
      }
    };

    const handleRedo = () => {
      const redo = redoRef.current;
      if (redo.length === 0) return;
      const next = redo.pop();
      undoRef.current.push(next);
      suppressStackRef.current = true;
      editorRef.current.innerHTML = next;
      setHtml(next);
      setContent?.(next);
      updateCounts(editorRef.current.innerText || "");
      setTimeout(() => {
        suppressStackRef.current = false;
        attachTableListeners();
      }, 20);
    };

    /** 🌿 Modern exec replacement — fixed alignment + link feature (final optimized) */
    const exec = (cmd, value = null) => {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;
      const range = sel.getRangeAt(0);

      const wrapText = (style = {}) => {
        const span = document.createElement("span");
        Object.assign(span.style, style);
        span.appendChild(range.extractContents());
        range.insertNode(span);
        sel.removeAllRanges();
        sel.addRange(range);
      };

      const wrapList = (range, listType) => {
        const list = document.createElement(listType);
        const li = document.createElement("li");
        li.appendChild(range.extractContents());
        list.appendChild(li);
        range.insertNode(list);
      };

      switch (cmd) {
        /** ✳️ Text Styles */
        case "bold":
          wrapText({ fontWeight: "bold" });
          break;
        case "italic":
          wrapText({ fontStyle: "italic" });
          break;
        case "underline":
          wrapText({ textDecoration: "underline" });
          break;
        case "color":
          if (value) wrapText({ color: value });
          break;
        case "fontSize":
          if (value) {
            let fontSizeValue = value;

            // 💡 Handle plain numbers (5, 6, 7, etc.)
            if (!isNaN(value)) {
              // Convert to pixel size based on HTML font size scale
              // You can tweak this mapping for better control
              const sizeMap = {
                1: "10px",
                2: "12px",
                3: "14px",
                4: "16px",
                5: "18px",
                6: "20px",
                7: "24px",
                8: "28px",
                9: "32px",
                10: "36px",
              };
              fontSizeValue = sizeMap[value] || `${value}px`;
            }

            wrapText({ fontSize: fontSizeValue });
          }
          break;

        /** 🆕 Font Family */
        case "fontFamily":
          if (value) wrapText({ fontFamily: value });
          break;

        /** 🧭 Alignment */
        case "justifyLeft":
        case "justifyCenter":
        case "justifyRight": {
          const align =
            cmd === "justifyLeft"
              ? "left"
              : cmd === "justifyCenter"
              ? "center"
              : "right";

          let blockEl = range.startContainer;
          while (
            blockEl &&
            !/^(P|DIV|BLOCKQUOTE|LI|TD|TH)$/i.test(blockEl.nodeName)
          ) {
            blockEl = blockEl.parentElement;
          }

          if (!blockEl) {
            blockEl = document.createElement("p");
            blockEl.appendChild(range.extractContents());
            range.insertNode(blockEl);
          }

          blockEl.style.textAlign = align;
          break;
        }

        /** 📋 Lists */
        case "insertUnorderedList":
          wrapList(range, "ul");
          break;
        case "insertOrderedList":
          wrapList(range, "ol");
          break;

        /** 🔗 Create Link (simpler reliable version) */
        case "createLink": {
          const url = value || prompt("Enter URL:");
          if (!url) return;

          const formattedUrl = url.startsWith("http") ? url : `https://${url}`;

          // Use a simpler approach - insert HTML directly
          const linkHTML = `<a href="${formattedUrl}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline;">${
            range.toString() || formattedUrl
          }</a>`;

          // Delete current selection and insert link
          range.deleteContents();

          // Create temporary div to parse HTML
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = linkHTML;
          const linkElement = tempDiv.firstChild;

          range.insertNode(linkElement);

          // Move selection after the link
          const newRange = document.createRange();
          newRange.setStartAfter(linkElement);
          newRange.setEndAfter(linkElement);
          sel.removeAllRanges();
          sel.addRange(newRange);

          break;
        }

        /** 🔗 Remove Link (optional future feature) */
        case "unlink": {
          const node = range.startContainer.parentElement;
          if (node && node.tagName === "A") {
            const parent = node.parentNode;
            while (node.firstChild) parent.insertBefore(node.firstChild, node);
            parent.removeChild(node);
          }
          break;
        }

        default:
          break;
      }

      triggerChange();
      editorRef.current?.focus();
    };

    const triggerChange = () => {
      if (!editorRef.current) return;
      const newHtml = editorRef.current.innerHTML;
      setHtml(newHtml);
      setContent?.(newHtml);
      updateCounts(editorRef.current.innerText || "");
      setIsTyping(true);

      if (!suppressStackRef.current) {
        pushToUndo(newHtml);
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
          setLastSaved(new Date());
          setIsTyping(false);
          saveTimerRef.current = null;
        }, 700);
      }
      setTimeout(attachTableListeners, 50);
    };

    const updateCounts = (text) => {
      const clean = (text || "").replace(/\u00A0/g, " ").trim();
      if (!clean) return setWordCount(0);
      setWordCount(clean.split(/\s+/).filter(Boolean).length);
    };

    const applyColor = (type, color) => {
      const range = getRange();

      if (type === "cell") {
        if (selectedCell) {
          selectedCell.style.backgroundColor = color;
          setActiveColor(color);
          triggerChange();
        }
        return;
      }

      if (type === "background") {
        if (selectedCell) {
          selectedCell.style.backgroundColor = color; // apply directly to selected cell
          setActiveColor(color);
          triggerChange();
          return;
        }
        // fallback for general text background
        if (!range) return;
        const span = document.createElement("span");
        span.style.backgroundColor = color;
        const contents = range.extractContents();
        span.appendChild(contents);
        range.insertNode(span);
        setActiveColor(color);
        triggerChange();
        return;
      }

      if (type === "text") {
        if (!range) return;
        const span = document.createElement("span");
        span.style.color = color;
        const contents = range.extractContents();
        span.appendChild(contents);
        range.insertNode(span);
        setActiveColor(color);
        triggerChange();
      }
    };

    const applyRowStyle = (styleType, value) => {
      if (!selectedTable || selectedRows.length === 0) return;

      selectedRows.forEach((rowIndex) => {
        const row = selectedTable.rows[rowIndex];
        if (!row) return;

        switch (styleType) {
          case "backgroundColor":
            Array.from(row.cells).forEach((cell) => {
              cell.style.backgroundColor = value;
            });
            break;

          case "textColor":
            Array.from(row.cells).forEach((cell) => {
              cell.style.color = value;
            });
            break;

          case "fontWeight":
            Array.from(row.cells).forEach((cell) => {
              cell.style.fontWeight = value;
            });
            break;

          case "textAlign":
            Array.from(row.cells).forEach((cell) => {
              cell.style.textAlign = value;
            });
            break;

          case "border":
            Array.from(row.cells).forEach((cell) => {
              cell.style.border = value;
            });
            break;

          default:
            break;
        }
      });

      triggerChange();
    };

    const insertLink = (url, text) => {
      const range = getRange(); // same helper as insertTable
      if (!range) {
        alert("Please place the cursor in the editor or select text.");
        return;
      }

      // Normalize URL
      const formattedUrl = url.startsWith("http") ? url : `https://${url}`;

      // Determine link text
      const selectedText = range.toString();
      const linkText = text || selectedText || formattedUrl;

      // Create <a> element
      const a = document.createElement("a");
      a.href = formattedUrl;
      a.textContent = linkText;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "editor-link modern-link";
      a.style.color = "#2563eb";
      a.style.textDecoration = "underline";

      // Replace selection with link
      range.deleteContents();
      range.insertNode(a);

      // Move cursor after the link
      const newRange = document.createRange();
      newRange.setStartAfter(a);
      newRange.setEndAfter(a);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(newRange);

      // Trigger re-render or onChange
      triggerChange();

      // Reset link UI states
      setOpenDropdown(null);
      setLinkUrl("");
      setLinkText("");
    };

    const insertTable = (rows = 3, cols = 3) => {
      const range = getRange();
      const table = document.createElement("table");
      table.className = "editor-table modern-table";
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";
      table.style.margin = "12px 0";

      for (let r = 0; r < rows; r++) {
        const tr = document.createElement("tr");
        for (let c = 0; c < cols; c++) {
          const cell =
            r === 0
              ? document.createElement("th")
              : document.createElement("td");
          cell.innerHTML = "<br/>";
          cell.style.border = "1px solid rgba(0,0,0,0.08)";
          cell.style.padding = "10px";
          tr.appendChild(cell);
        }
        table.appendChild(tr);
      }

      // Use the same event listener as in attachTableListeners
      table.addEventListener("click", (ev) => {
        ev.stopPropagation();
        setSelectedTable(table);

        const cell = ev.target.closest("td,th");
        if (cell) {
          setSelectedCell(cell);

          // Get row index
          const row = cell.closest("tr");
          const rowIndex = Array.from(table.rows).indexOf(row);

          // Select row on click
          handleRowSelect(rowIndex, ev.ctrlKey || ev.metaKey);
        }
      });

      if (range) {
        range.deleteContents();
        range.insertNode(table);
      } else {
        editorRef.current.appendChild(table);
      }

      triggerChange();
      setOpenDropdown(null);
    };

    const performTableAction = (action) => {
      if (!selectedTable) return;

      switch (action) {
        /** ➕ Add or Remove Rows/Columns */
        case "addRow": {
          const row = selectedTable.insertRow();
          const cellCount = selectedTable.rows[0]?.cells.length || 1;
          for (let i = 0; i < cellCount; i++)
            row.insertCell().textContent = " ";
          break;
        }

        case "addColumn": {
          for (const row of selectedTable.rows)
            row.insertCell().textContent = " ";
          break;
        }

        case "deleteRow": {
          selectedTable.deleteRow(selectedTable.rows.length - 1);
          break;
        }

        case "deleteColumn": {
          const colCount = selectedTable.rows[0]?.cells.length || 0;
          if (colCount > 0) {
            for (const row of selectedTable.rows) row.deleteCell(colCount - 1);
          }
          break;
        }

        /** 🧾 Equalize widths */
        case "equalize": {
          const colCount = selectedTable.rows[0]?.cells.length || 0;
          if (colCount > 0) {
            const width = `${100 / colCount}%`;
            selectedTable.querySelectorAll("td, th").forEach((cell) => {
              cell.style.width = width;
            });
          }
          break;
        }

        /** 🧹 Delete table */
        case "deleteTable": {
          selectedTable.remove();
          setSelectedTable(null);
          break;
        }

        /** 🧭 Cell Alignment */
        case "alignLeft":
        case "justifyCenter":
        case "justifyRight": {
          const align =
            action === "alignLeft"
              ? "left"
              : action === "justifyCenter"
              ? "center"
              : "right";

          selectedTable.querySelectorAll("td, th").forEach((cell) => {
            cell.style.textAlign = align;
          });
          break;
        }

        default:
          break;
      }

      triggerChange?.();
      editorRef.current?.focus();
    };

    const optimizeAction = (act) => {
      switch (act) {
        case "cleanFormatting": {
          const el = editorRef.current;
          if (!el) return;
          const plain = el.innerText;
          el.innerHTML = `<p>${plain
            .replace(/\n\n/g, "</p><p>")
            .replace(/\n/g, "<br/>")}</p>`;
          triggerChange();
          break;
        }
        case "autofitTable": {
          if (selectedTable) performTableAction("autofit");
          break;
        }
        case "equalizeCells": {
          if (selectedTable) performTableAction("equalize");
          break;
        }
        case "resetColors": {
          if (selectedTable) performTableAction("resetColors");
          break;
        }
        default:
          break;
      }
      setOpenDropdown(null);
    };

    const applyQuoteStyle = (styleIndex) => {
      const range = getRange();
      if (!range) return;
      const block = document.createElement("blockquote");
      block.className = `quote-style-${styleIndex}`;
      const contents = range.extractContents();
      const p = document.createElement("p");
      p.appendChild(contents);
      block.appendChild(p);
      range.insertNode(block);
      triggerChange();
    };

    const handlePaste = (e) => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData(
        "text/plain"
      );
      const html = text.replace(/\n/g, "<br/>");
      document.execCommand("insertHTML", false, html);
      triggerChange();
    };

    const handleInput = () => {
      triggerChange();
    };

    const handleEditorKeyDown = (e) => {
      if (e.key === "Tab") {
        const sel = window.getSelection();
        if (!sel) return;
        const li =
          (sel.anchorNode &&
            sel.anchorNode.closest &&
            sel.anchorNode.closest("li")) ||
          null;
        if (li) {
          e.preventDefault();
          if (e.shiftKey) document.execCommand("outdent");
          else document.execCommand("indent");
        }
      }
    };

    const exportHTML = (title = "note") => {
      const noteHTML = `<!doctype html><html><head><meta charset="utf-8" /><title>${title}</title><meta name="viewport" content="width=device-width,initial-scale=1" /><style>body{font-family:system-ui,-apple-system,sans-serif;padding:20px;color:#111827;} .note-title{font-size:1.6rem;font-weight:700;margin-bottom:8px;color:${PRIMARY};} .note-content{line-height:1.6;} table{border-collapse:collapse;width:100%;} table td,table th{border:1px solid #e5e7eb;padding:8px;} blockquote{border-left:4px solid ${PRIMARY};padding:8px 16px;background:#f7fff2;}</style></head><body><div class="note-title">${title}</div><div class="note-meta">Exported: ${new Date().toLocaleString()}</div><div class="note-content">${
        editorRef.current?.innerHTML || ""
      }</div></body></html>`;
      const blob = new Blob([noteHTML], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\W+/g, "_")}.html`;
      a.click();
      URL.revokeObjectURL(url);
    };

    const exportTXT = (title = "note") => {
      const txt = editorRef.current?.innerText || "";
      const blob = new Blob([`# ${title}\n\n${txt}`], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\W+/g, "_")}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    };

    const importFile = () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".html,.htm,.txt,.md";
      input.onchange = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const text = ev.target.result;
          const ext = (f.name.split(".").pop() || "").toLowerCase();
          if (ext === "html" || ext === "htm") {
            try {
              const parser = new DOMParser();
              const doc = parser.parseFromString(text, "text/html");
              const body = doc.body.innerHTML;
              editorRef.current.innerHTML = body || "<p><br/></p>";
            } catch {
              editorRef.current.innerHTML = text;
            }
          } else {
            const html = text.replace(/\n/g, "<br/>");
            editorRef.current.innerHTML = `<p>${html}</p>`;
          }
          triggerChange();
        };
        reader.readAsText(f);
      };
      input.click();
    };

    /* ---------- JSX ---------- */
    return (
      <div
        ref={rootRef}
        className="w-full h-full bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-zinc-800 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-zinc-700">
          <div className="flex items-center gap-3">
            <div className="">
              <img src="/logo-dark.png" alt="logo" width={30} height={30} />
            </div>
            <div>
              <div className="text-sm font-semibold text-black dark:text-white">
                Notexa Text Editor
              </div>
              <div className="text-xs">
                Updated{" "}
                {lastSaved.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 🧮 Word Count */}
            <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-md">
              <WholeWord size={20} />
              <span className="text-xs">{wordCount}</span>
            </div>

            {/* 📤 Import & Export Controls */}
            <div className="flex items-center gap-2">
              {/* 📥 Import */}
              <ToolbarButton title="Import" onClick={importFile} compact>
                <Upload size={16} />
              </ToolbarButton>

              {/* 🌐 Export HTML */}
              <ToolbarButton
                title="Export HTML"
                onClick={() => exportDocument("html", "exported", editorRef)}
                compact
              >
                <Download size={16} />
              </ToolbarButton>

              {/* 📄 Export TXT */}
              <ToolbarButton
                title="Export TXT"
                onClick={() => exportTXT("exported")}
                compact
              >
                <FileText size={16} />
              </ToolbarButton>

         
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-100 dark:border-zinc-700 bg-white dark:bg-black">
          <ToolbarButton title="Undo" onClick={handleUndo} compact>
            <RotateCcw size={16} />
          </ToolbarButton>
          <ToolbarButton title="Redo" onClick={handleRedo} compact>
            <RotateCw size={16} />
          </ToolbarButton>

          <div className="w-px h-6 bg-gray-200 dark:bg-zinc-700 mx-1" />

          <ToolbarButton title="Bold" onClick={() => exec("bold")} compact>
            <Bold size={16} />
          </ToolbarButton>

          <ToolbarButton title="Italic" onClick={() => exec("italic")} compact>
            <Italic size={16} />
          </ToolbarButton>

          <ToolbarButton
            title="Underline"
            onClick={() => exec("underline")}
            compact
          >
            <Underline size={16} />
          </ToolbarButton>

          <div className="w-px h-6 bg-gray-200 dark:bg-zinc-700 mx-1" />

          <ToolbarButton
            title="Align left"
            onClick={() => exec("justifyLeft")}
            compact
          >
            <AlignLeft size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Align center"
            onClick={() => exec("justifyCenter")}
            compact
          >
            <AlignCenter size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Align right"
            onClick={() => exec("justifyRight")}
            compact
          >
            <AlignRight size={16} />
          </ToolbarButton>

          <div className="w-px h-6 bg-gray-200 dark:bg-zinc-700 mx-1" />

          <ToolbarButton
            title="Bullet list"
            onClick={() => exec("insertUnorderedList")}
            compact
          >
            <List size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Numbered list"
            onClick={() => exec("insertOrderedList")}
            compact
          >
            <ListOrdered size={16} />
          </ToolbarButton>

          <div className="w-px h-6 bg-gray-200 dark:bg-zinc-700 mx-1" />

          {/* Text Color dropdown */}
          <div className="relative">
            <ToolbarButton
              title="Text color"
              onClick={(e) => {
                setColorType("text");
                setOpenDropdown(openDropdown === "color" ? null : "color");
                setDropdownAnchor(e.currentTarget);
              }}
              compact
            >
              <Palette size={16} />
            </ToolbarButton>

            <Dropdown
              open={openDropdown === "color" && colorType === "text"}
              anchorRef={{ current: dropdownAnchor }}
              onClose={() => setOpenDropdown(null)}
              className="w-56 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-700 rounded-lg shadow-lg p-3"
              autoCloseOnSelect={true} // ✅ auto-close on color select
            >
              <div className="grid grid-cols-6 gap-2 mb-3">
                {COLOR_PRESETS.map((c) => {
                  const isActive =
                    activeColor &&
                    c.toLowerCase() === activeColor.toLowerCase();
                  return (
                    <button
                      key={c}
                      onClick={() => {
                        applyColor("text", c);
                        setActiveColor(c);
                      }}
                      title={c}
                      style={{ backgroundColor: c }}
                      className={`relative w-8 h-8 rounded-md border transition-all duration-150 ${
                        isActive
                          ? "ring-2 ring-green-400 border-green-400"
                          : "border-gray-200 dark:border-zinc-700"
                      }`}
                      aria-pressed={isActive}
                    >
                      {c === "#ffffff" && (
                        <div className="absolute inset-0 rounded-md border border-gray-200/60" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Custom color
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  defaultValue={activeColor || PRIMARY}
                  className="w-full h-9 rounded-md border border-gray-200 dark:border-zinc-700 cursor-pointer"
                  onChange={(e) => {
                    const val = e.target.value;
                    applyColor("text", val);
                    setActiveColor(val);
                    setOpenDropdown(null); // close on custom color select
                  }}
                />
                <div
                  className="px-3 py-1.5 text-xs rounded-md border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 select-none"
                  style={{ color: activeColor || PRIMARY }}
                >
                  {(activeColor || PRIMARY).toUpperCase()}
                </div>
              </div>
            </Dropdown>
          </div>

          {/* Highlight / Cell color dropdown */}
          <div className="relative">
            <ToolbarButton
              title="Cell / Background color"
              onClick={(e) => {
                setColorType("background"); // inline background color
                setOpenDropdown(openDropdown === "color" ? null : "color");
                setDropdownAnchor(e.currentTarget);
              }}
              compact
            >
              <Highlighter size={16} />
            </ToolbarButton>

            <Dropdown
              open={openDropdown === "color" && colorType === "background"}
              anchorRef={{ current: dropdownAnchor }}
              onClose={() => setOpenDropdown(null)}
              className="w-56 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-700 rounded-lg shadow-lg p-3"
              autoCloseOnSelect={true} // ✅ auto-close on color select
            >
              <div className="grid grid-cols-6 gap-2 mb-3">
                {COLOR_PRESETS.map((c) => {
                  const isActive =
                    activeColor &&
                    c.toLowerCase() === activeColor.toLowerCase();
                  return (
                    <button
                      key={c}
                      onClick={() => {
                        applyColor("background", c);
                        setActiveColor(c);
                      }}
                      title={c}
                      style={{ backgroundColor: c }}
                      className={`relative w-8 h-8 rounded-md border transition-all duration-150 ${
                        isActive
                          ? "ring-2 ring-green-400 border-green-400"
                          : "border-gray-200 dark:border-zinc-700"
                      }`}
                      aria-pressed={isActive}
                    >
                      {c === "#ffffff" && (
                        <div className="absolute inset-0 rounded-md border border-gray-200/60" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Custom color
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  defaultValue={activeColor || PRIMARY}
                  className="w-full h-9 rounded-md border border-gray-200 dark:border-zinc-700 cursor-pointer"
                  onChange={(e) => {
                    const val = e.target.value;
                    applyColor("background", val);
                    setActiveColor(val);
                    setOpenDropdown(null); // close on custom color select
                  }}
                />
                <div
                  className="px-3 py-1.5 text-xs rounded-md border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 select-none"
                  style={{ color: activeColor || PRIMARY }}
                >
                  {(activeColor || PRIMARY).toUpperCase()}
                </div>
              </div>
            </Dropdown>
          </div>

          <div className="w-px h-6 bg-gray-200 dark:bg-zinc-700 mx-1" />

          {/* 🔗 Link Dropdown */}
          <div className="relative">
            <ToolbarButton
              title="Insert link"
              onClick={(e) => {
                const sel = window.getSelection();
                setLinkText(sel?.toString() || "");
                setOpenDropdown(openDropdown === "link" ? null : "link");
                setDropdownAnchor(e.currentTarget);
              }}
              compact
            >
              <LinkIcon size={16} />
            </ToolbarButton>

            <Dropdown
              open={openDropdown === "link"}
              anchorRef={{ current: dropdownAnchor }}
              onClose={() => setOpenDropdown(null)}
              className="w-72 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-lg p-4"
            >
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">
                Insert Link
              </div>

              {/* URL input */}
              <input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                type="url"
                className="w-full p-2 text-sm rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 mb-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />

              {/* Text input */}
              <input
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Display text (optional)"
                className="w-full p-2 text-sm rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 mb-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setOpenDropdown(null);
                    setLinkUrl("");
                    setLinkText("");
                  }}
                  className="flex-1 p-2 text-sm rounded-md border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    if (!linkUrl.trim()) {
                      alert("Please enter a URL");
                      return;
                    }

                    // ✅ Insert link inside the editor (like insertTable)
                    editorRef.current?.focus();
                    insertLink(linkUrl.trim(), linkText.trim() || undefined);
                  }}
                  className="flex-1 p-2 text-sm rounded-md bg-green-600 hover:bg-green-700 text-white transition"
                >
                  Insert
                </button>
              </div>
            </Dropdown>
          </div>

          {/* Table dropdown */}
          <div className="relative">
            <ToolbarButton
              title="Insert table"
              onClick={(e) => {
                setOpenDropdown(openDropdown === "table" ? null : "table");
                setDropdownAnchor(e.currentTarget);
              }}
              compact
            >
              <Table size={16} />
            </ToolbarButton>

            <Dropdown
              open={openDropdown === "table"}
              anchorRef={{ current: dropdownAnchor }}
              onClose={() => setOpenDropdown(null)}
              className="w-56 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-700 rounded-lg shadow-lg p-3"
            >
              <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                Insert table
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Rows
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={tableRows}
                    onChange={(e) =>
                      setTableRows(Math.max(1, parseInt(e.target.value || "1")))
                    }
                    className="w-full p-2 text-sm rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Columns
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={tableCols}
                    onChange={(e) =>
                      setTableCols(Math.max(1, parseInt(e.target.value || "1")))
                    }
                    className="w-full p-2 text-sm rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setOpenDropdown(null)}
                  className="flex-1 p-2 text-sm rounded-md border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => insertTable(tableRows, tableCols)}
                  className="flex-1 p-2 text-sm rounded-md bg-green-600 hover:bg-green-700 text-white"
                >
                  Insert
                </button>
              </div>
            </Dropdown>
          </div>

          <div className="w-px h-6 bg-gray-200 dark:bg-zinc-700 mx-1" />

          <ToolbarButton
            title="Quote styles"
            onClick={() => {
              const next = (quoteStyle % 3) + 1;
              setQuoteStyle(next);
              applyQuoteStyle(next);
            }}
            compact
          >
            <Quote size={16} />
          </ToolbarButton>

          {/* 🧩 Text Size Dropdown */}
          <div className="relative">
            <ToolbarButton
              title="Text Size"
              onClick={(e) => {
                setOpenDropdown(openDropdown === "size" ? null : "size");
                setDropdownAnchor(e.currentTarget);
              }}
              compact
            >
              <Type size={16} />
            </ToolbarButton>

            <Dropdown
              open={openDropdown === "size"}
              anchorRef={{ current: dropdownAnchor }}
              onClose={() => setOpenDropdown(null)}
              className="w-44 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-700 rounded-lg shadow-lg p-2"
            >
              {[
                { label: "5", value: 5 },
                { label: "6", value: 6 },
                { label: "7", value: 7 },
                { label: "8", value: 8 },
                { label: "9", value: 9 },
                { label: "10", value: 10 },
              ].map((s) => {
                // same mapping as in exec() for preview
                const sizeMap = {
                  1: "10px",
                  2: "12px",
                  3: "14px",
                  4: "16px",
                  5: "18px",
                  6: "20px",
                  7: "24px",
                  8: "28px",
                  9: "32px",
                  10: "36px",
                };
                const fontSize = sizeMap[s.value] || `${s.value}px`;

                return (
                  <button
                    key={s.value}
                    onClick={() => {
                      exec("fontSize", s.value);
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-zinc-800 transition font-medium"
                    style={{ fontSize }}
                  >
                    {`Size ${s.label}`}
                  </button>
                );
              })}
            </Dropdown>
          </div>

          {/* 🅵 Font Family Dropdown */}
          <div className="relative">
            <ToolbarButton
              title="Font family"
              onClick={(e) => {
                setOpenDropdown(openDropdown === "font" ? null : "font");
                setDropdownAnchor(e.currentTarget);
              }}
              compact
            >
              <span className="text-sm font-semibold">Aa</span>
            </ToolbarButton>

            <Dropdown
              open={openDropdown === "font"}
              anchorRef={{ current: dropdownAnchor }}
              onClose={() => setOpenDropdown(null)}
              className="w-48 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-xl p-2"
            >
              {[
                { label: "Poppins", value: "Poppins" },
                { label: "Inter", value: "Inter" },
                { label: "Roboto", value: "Roboto" },
                { label: "Arial", value: "Arial" },
                { label: "Jameel Noori (Urdu)", value: "JameelNoori" },
                { label: "Quran Font", value: "QuranFont" },
                { label: "Quran Surah", value: "QuranSurah" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => {
                    exec("fontFamily", f.value);
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all duration-150 flex items-center gap-2"
                  style={{
                    fontFamily: f.value,
                  }}
                >
                  <span className="truncate">{f.label}</span>
                </button>
              ))}
            </Dropdown>
          </div>

          <div className="flex-1" />

          {/* optimize (dropdown) */}
          <div className="relative">
            <ToolbarButton
              title="Optimize"
              onClick={() =>
                setOpenDropdown(openDropdown === "opt" ? null : "opt")
              }
              compact
            >
              <Settings size={16} />
            </ToolbarButton>

            <AnimatePresence>
              {openDropdown === "opt" && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 mt-2 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-lg shadow-lg p-2 w-48 z-40"
                >
                  <button
                    className="w-full text-left p-2 text-xs hover:bg-gray-50 dark:hover:bg-zinc-700 rounded"
                    onClick={() => optimizeAction("cleanFormatting")}
                  >
                    Clean Formatting
                  </button>
                  <button
                    className="w-full text-left p-2 text-xs hover:bg-gray-50 dark:hover:bg-zinc-700 rounded"
                    onClick={() => optimizeAction("autofitTable")}
                  >
                    Auto-fit Table
                  </button>
                  <button
                    className="w-full text-left p-2 text-xs hover:bg-gray-50 dark:hover:bg-zinc-700 rounded"
                    onClick={() => optimizeAction("equalizeCells")}
                  >
                    Equalize Cell Widths
                  </button>
                  <button
                    className="w-full text-left p-2 text-xs hover:bg-gray-50 dark:hover:bg-zinc-700 rounded text-red-600"
                    onClick={() => optimizeAction("resetColors")}
                  >
                    Reset Table Colors
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <ToolbarButton
            title="Clear formatting"
            onClick={() => optimizeAction("cleanFormatting")}
            compact
          >
            <Eraser size={16} />
          </ToolbarButton>

          <ToolbarButton
            title="Delete selected table"
            onClick={() => performTableAction("deleteTable")}
            compact
          >
            <Trash2 size={16} />
          </ToolbarButton>
        </div>

        {/* Editor Area */}
        <div className="p-4 min-h-[280px] bg-white dark:bg-black">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onPaste={handlePaste}
            onKeyDown={handleEditorKeyDown}
            className="rich-text-editor min-h-[220px] p-2 text-sm leading-6 text-gray-900 dark:text-gray-100"
            style={{
              fontFamily:
                'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
            }}
          />
        </div>

        {/* 🧩 Table Actions Panel Component */}
        <TableActionsPanel
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
          selectedRows={selectedRows}
          applyRowStyle={applyRowStyle}
          performTableAction={performTableAction}
        />

        {/* 🌿 Styles: quotes, tables, links, and responsive behavior */}
        <style>{`
  :root {
    --primary: ${PRIMARY};
    --text-dark: #0f172a;
    --text-light: #f8fafc;
  }

  .rich-text-editor {
    min-height: 220px;
    line-height: 1.65;
    font-family: "Inter", system-ui, sans-serif;
    color: var(--text-dark);
    word-wrap: break-word;
    overflow-x: auto;
  }
    // Add to your style tag:
.rich-text-editor table tr.selected-row {
  background: rgba(0, 214, 22, 0.1) !important;
}

.rich-text-editor table tr.selected-row td,
.rich-text-editor table tr.selected-row th {
  border-left: 2px solid var(--primary) !important;
  border-right: 2px solid var(--primary) !important;
}

.rich-text-editor table tr.selected-row:first-child td,
.rich-text-editor table tr.selected-row:first-child th {
  border-top: 2px solid var(--primary) !important;
}

.rich-text-editor table tr.selected-row:last-child td,
.rich-text-editor table tr.selected-row:last-child th {
  border-bottom: 2px solid var(--primary) !important;
}

  .rich-text-editor:focus {
    outline: none;
  }

  /* --- Quotes --- */
  .rich-text-editor blockquote {
    margin: 14px 0;
    padding: 14px 18px;
    border-left: 5px solid var(--primary);
    border-radius: 8px;
    background: rgba(0, 214, 22, 0.06);
    color: #064e2a;
    font-style: italic;
  }

  .rich-text-editor .quote-style-1 {
    border-left-color: var(--primary);
    background: linear-gradient(90deg, rgba(0, 214, 22, 0.05), rgba(255, 255, 255, 0));
    color: #063e2a;
  }

  .rich-text-editor .quote-style-2 {
    border-left-color: #2563eb;
    background: linear-gradient(90deg, rgba(37, 99, 235, 0.05), rgba(255, 255, 255, 0));
    color: #07336b;
  }

  .rich-text-editor .quote-style-3 {
    border-left-color: #7c3aed;
    background: linear-gradient(90deg, rgba(124, 58, 237, 0.05), rgba(255, 255, 255, 0));
    color: #3e0f66;
    font-style: italic;
  }

  /* --- Tables --- */
  .rich-text-editor table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    border-radius: 8px;
    overflow: hidden;
  }

  .rich-text-editor table.modern-table th {
    background: #f8fafc;
    font-weight: 600;
  }

  .rich-text-editor table.modern-table td,
  .rich-text-editor table.modern-table th {
    border: 1px solid rgba(0, 0, 0, 0.06);
    padding: 10px 12px;
    vertical-align: top;
  }

  .rich-text-editor table.modern-table tr:nth-child(even) {
    background: rgba(0, 0, 0, 0.02);
  }

  .rich-text-editor table.modern-table tr:hover {
    background: rgba(0, 214, 22, 0.04);
  }

  /* --- Links --- */
  .rich-text-editor a {
    color: var(--primary);
    text-decoration: underline;
    transition: color 0.2s ease, background 0.2s ease;
  }

  .rich-text-editor a:hover {
    color: #059669;
    background: rgba(0, 214, 22, 0.05);
  }

  /* --- Lists --- */
  .rich-text-editor ul, .rich-text-editor ol {
    margin: 10px 0 10px 25px;
  }
  .rich-text-editor li {
    margin-bottom: 4px;
  }

  /* --- Headings --- */
  .rich-text-editor h1 { font-size: 1.8rem; font-weight: 700; margin: 1rem 0; }
  .rich-text-editor h2 { font-size: 1.5rem; font-weight: 600; margin: 0.9rem 0; }
  .rich-text-editor h3 { font-size: 1.3rem; font-weight: 500; margin: 0.8rem 0; }

  /* --- Responsive typography --- */
  @media (max-width: 640px) {
    .rich-text-editor { 
      font-size: 14px; 
      line-height: 1.6; 
      padding: 8px;
    }
    .rich-text-editor h1 { font-size: 1.4rem; }
    .rich-text-editor h2 { font-size: 1.2rem; }
  }

  /* --- Dark Mode --- */
  .dark .rich-text-editor {
    color: var(--text-light);
  }
  .dark .rich-text-editor table.modern-table th {
    background: #1e293b;
  }
  .dark .rich-text-editor table.modern-table td,
  .dark .rich-text-editor table.modern-table th {
    border-color: rgba(255,255,255,0.08);
  }
  .dark .rich-text-editor blockquote {
    background: rgba(0,214,22,0.08);
    color: #bbf7d0;
  }
`}</style>
      </div>
    );
  }
);

export default RichTextEditor;
