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
  RemoveFormatting,
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
  // ⚫ Neutral & Grayscale
  "#000000",
  "#1e293b",
  "#334155",
  "#475569",
  "#94a3b8",
  "#cbd5e1",
  "#e2e8f0",
  "#f8fafc",
  "#ffffff",

  // ❤️ Reds
  "#7f1d1d",
  "#b91c1c",
  "#ef4444",
  "#f87171",
  "#fca5a5",
  "#fee2e2",

  // 🧡 Oranges
  "#78350f",
  "#b45309",
  "#f97316",
  "#fb923c",
  "#fdba74",
  "#ffedd5",

  // 💛 Yellows
  "#854d0e",
  "#ca8a04",
  "#facc15",
  "#fde047",
  "#fef08a",
  "#fef9c3",

  // 💚 Greens
  "#14532d",
  "#15803d",
  "#22c55e",
  "#4ade80",
  "#86efac",
  "#dcfce7",

  // 🩵 Teals / Cyans
  "#134e4a",
  "#0d9488",
  "#14b8a6",
  "#2dd4bf",
  "#5eead4",
  "#ccfbf1",

  // 💙 Blues
  "#1e3a8a",
  "#2563eb",
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
  "#dbeafe",

  // 💜 Purples / Violets
  "#4c1d95",
  "#7c3aed",
  "#8b5cf6",
  "#a78bfa",
  "#c4b5fd",
  "#ede9fe",

  // 💖 Pinks / Magentas
  "#831843",
  "#be185d",
  "#ec4899",
  "#f472b6",
  "#f9a8d4",
  "#fce7f3",

  // 💚 Accent Brights / Specials
  "#00d616", // your signature bright green
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#14b8ff", // bright aqua
  "#ff80ed", // pink neon
  "#ffe45e", // bright yellow
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

    /** 🌿 Modern exec replacement — toggle bold/italic/underline properly */
    const exec = (cmd, value = null) => {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;
      const range = sel.getRangeAt(0);

      /** 🧩 Helper: Wrap selection with inline styles */
      const wrapText = (style = {}) => {
        const span = document.createElement("span");
        Object.assign(span.style, style);
        span.appendChild(range.extractContents());
        range.insertNode(span);
        sel.removeAllRanges();
        sel.addRange(range);
      };

      /** 🧩 Toggle inline style for multi-node selection */
      const toggleInlineStyle = (styleProp, styleValue) => {
        if (range.collapsed) return; // do nothing for cursor only

        const frag = range.extractContents();
        const walker = document.createTreeWalker(
          frag,
          NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
          null
        );
        let hasStyle = false;

        // First pass: check if any node already has this style
        const tempFrag = frag.cloneNode(true);
        const tempWalker = document.createTreeWalker(
          tempFrag,
          NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
          null
        );

        while (tempWalker.nextNode()) {
          const node = tempWalker.currentNode;
          if (node.nodeType === 1 && node.style[styleProp] === styleValue) {
            hasStyle = true;
            break;
          }
        }

        // Second pass: apply or remove style
        while (walker.nextNode()) {
          const node = walker.currentNode;

          if (node.nodeType === 3) {
            // Text node
            const parent = node.parentNode;

            if (hasStyle) {
              // Remove style
              if (
                parent.nodeType === 1 &&
                parent.style[styleProp] === styleValue
              ) {
                parent.style[styleProp] = "";
                // Remove empty span
                if (
                  !parent.getAttribute("style") &&
                  parent.tagName === "SPAN"
                ) {
                  const parentParent = parent.parentNode;
                  while (parent.firstChild) {
                    parentParent.insertBefore(parent.firstChild, parent);
                  }
                  parentParent.removeChild(parent);
                }
              }
            } else {
              // Apply style
              const span = document.createElement("span");
              span.style[styleProp] = styleValue;
              const clonedNode = node.cloneNode(true);
              span.appendChild(clonedNode);
              parent.replaceChild(span, node);
            }
          } else if (node.nodeType === 1) {
            // Element node
            if (hasStyle && node.style[styleProp] === styleValue) {
              node.style[styleProp] = "";
            } else if (!hasStyle) {
              node.style[styleProp] = styleValue;
            }
          }
        }

        range.insertNode(frag);
      };

      /** 🧩 Wrap selection as list (ul/ol) */
      const wrapList = (range, listType) => {
        const list = document.createElement(listType);
        const li = document.createElement("li");
        li.appendChild(range.extractContents());
        list.appendChild(li);
        range.insertNode(list);
      };

      switch (cmd) {
        /** ✳️ Toggle Text Styles */
        case "bold":
          toggleInlineStyle("fontWeight", "bold");
          break;
        case "italic":
          toggleInlineStyle("fontStyle", "italic");
          break;
        case "underline":
          toggleInlineStyle("textDecoration", "underline");
          break;

        /** 🎨 Colors & Fonts */
        case "color":
          if (value) wrapText({ color: value });
          break;
        case "fontSize":
          if (value) {
            let fontSizeValue = value;
            if (!isNaN(value)) {
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
          )
            blockEl = blockEl.parentElement;
          if (!blockEl) {
            blockEl = document.createElement("p");
            blockEl.appendChild(range.extractContents());
            range.insertNode(blockEl);
          }
          blockEl.style.textAlign = align;
          break;
        }

        /** 🧹 Clear Formatting */
        case "clearFormatting": {
          let blockEl = range.startContainer;
          while (
            blockEl &&
            !/^(P|DIV|LI|TD|TH|BLOCKQUOTE)$/i.test(blockEl.nodeName)
          )
            blockEl = blockEl.parentElement;
          if (!blockEl) {
            const p = document.createElement("p");
            p.appendChild(range.extractContents());
            range.insertNode(p);
            blockEl = p;
          }

          const cleaned = blockEl.cloneNode(true);
          const removeFormatting = (node) => {
            if (node.nodeType === 1) {
              node.removeAttribute("style");
              const removableTags = ["B", "I", "U", "FONT", "SPAN"];
              if (removableTags.includes(node.nodeName)) {
                const parent = node.parentNode;
                while (node.firstChild)
                  parent.insertBefore(node.firstChild, node);
                parent.removeChild(node);
                return;
              }
              Array.from(node.childNodes).forEach(removeFormatting);
            }
          };
          removeFormatting(cleaned);
          blockEl.replaceWith(cleaned);
          break;
        }

        /** 📋 Lists */
        case "insertUnorderedList":
          wrapList(range, "ul");
          break;
        case "insertOrderedList":
          wrapList(range, "ol");
          break;

        /** 🔗 Create / Remove Link */
        case "createLink": {
          const url = value || prompt("Enter URL:");
          if (!url) return;
          const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
          const linkHTML = `<a href="${formattedUrl}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">${
            range.toString() || formattedUrl
          }</a>`;
          range.deleteContents();
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = linkHTML;
          const linkElement = tempDiv.firstChild;
          range.insertNode(linkElement);
          const newRange = document.createRange();
          newRange.setStartAfter(linkElement);
          newRange.setEndAfter(linkElement);
          sel.removeAllRanges();
          sel.addRange(newRange);
          break;
        }
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
                Notlix Text Editor
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

          {/* 🎨 Text Color Picker */}
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

            {openDropdown === "color" && colorType === "text" && (
              <div className="absolute top-10 left-0 z-50 bg-gray-200 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xl p-4 grid grid-cols-8 gap-2 w-56">
                {COLOR_PRESETS.map((c) => {
                  const isActive =
                    activeColor?.toLowerCase() === c.toLowerCase();
                  return (
                    <button
                      key={c}
                      onClick={() => {
                        applyColor("text", c);
                        setActiveColor(c);
                        setOpenDropdown(null);
                      }}
                      title={c}
                      style={{ backgroundColor: c }}
                      className={`w-5 h-5 rounded transition-all duration-150 hover:scale-110 ${
                        isActive
                          ? "ring-2 ring-green-400 ring-offset-1 ring-offset-white dark:ring-offset-zinc-900"
                          : ""
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* 🖍 Background Color Picker */}
          <div className="relative">
            <ToolbarButton
              title="Background color"
              onClick={(e) => {
                setColorType("background");
                setOpenDropdown(openDropdown === "color" ? null : "color");
                setDropdownAnchor(e.currentTarget);
              }}
              compact
            >
              <Highlighter size={16} />
            </ToolbarButton>

            {openDropdown === "color" && colorType === "background" && (
              <div className="absolute top-10 left-0 z-50 bg-gray-200 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xl p-4 grid grid-cols-8 gap-2 w-56">
                {COLOR_PRESETS.map((c) => {
                  const isActive =
                    activeColor?.toLowerCase() === c.toLowerCase();
                  return (
                    <button
                      key={c}
                      onClick={() => {
                        applyColor("background", c);
                        setActiveColor(c);
                        setOpenDropdown(null);
                      }}
                      title={c}
                      style={{ backgroundColor: c }}
                      className={`w-5 h-5 rounded transition-all duration-150 hover:scale-110 ${
                        isActive
                          ? "ring-2 ring-green-400 ring-offset-1 ring-offset-white dark:ring-offset-zinc-900"
                          : ""
                      }`}
                    />
                  );
                })}
              </div>
            )}
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

            {openDropdown === "size" && dropdownAnchor && (
              <div
                className="absolute mt-2 w-44 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg p-2 z-50 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent"
                style={{
                  top: "100%", // always open downward
                  left: 0,
                }}
              >
                {[
                  { label: "5", value: 5 },
                  { label: "6", value: 6 },
                  { label: "7", value: 7 },
                  { label: "8", value: 8 },
                  { label: "9", value: 9 },
                  { label: "10", value: 10 },
                ].map((s) => {
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
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition font-medium"
                      style={{ fontSize }}
                    >
                      {`Size ${s.label}`}
                    </button>
                  );
                })}
              </div>
            )}
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

            {openDropdown === "font" && dropdownAnchor && (
              <div
                className="absolute mt-2 w-48 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg p-2 z-50 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent"
                style={{
                  top: "100%", // always open downward
                  left: 0,
                }}
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
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-200 dark:bg-zinc-700 mx-1" />

          <ToolbarButton
            title="Remove format"
            onClick={() => exec("clearFormatting")}
          >
            <RemoveFormatting size={16} />
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

  .rich-text-editor:focus {
    outline: none;
  }

  /* --- Table Row Selection --- */
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
.rich-text-editor ul,
.rich-text-editor ol {
  margin: 10px 0 10px 25px;
  padding-left: 1.2em; /* ensure space for bullets/numbers */
}

.rich-text-editor ul {
  list-style-type: disc; /* shows ● bullets */
  list-style-position: outside;
}

.rich-text-editor ol {
  list-style-type: decimal; /* shows 1. 2. 3. */
  list-style-position: outside;
}

.rich-text-editor li {
  margin-bottom: 4px;
}

/* Optional — custom checkmark bullets for modern style */
.rich-text-editor ul.checklist {
  list-style: none;
  padding-left: 0;
}

.rich-text-editor ul.checklist li::before {
  content: "✔";
  color: var(--primary);
  margin-right: 8px;
  font-weight: 600;
}


  /* --- Headings --- */
  .rich-text-editor h1 {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 1rem 0;
  }

  .rich-text-editor h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0.9rem 0;
  }

  .rich-text-editor h3 {
    font-size: 1.3rem;
    font-weight: 500;
    margin: 0.8rem 0;
  }

  /* --- Responsive Typography --- */
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
    border-color: rgba(255, 255, 255, 0.08);
  }

  .dark .rich-text-editor blockquote {
    background: rgba(0, 214, 22, 0.08);
    color: #bbf7d0;
  }
`}</style>
      </div>
    );
  }
);

export default RichTextEditor;
