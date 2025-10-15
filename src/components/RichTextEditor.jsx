// RichTextEditor.jsx
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * RichTextEditor (modern, responsive, dark/light)
 * - Tailwind classes (dark: variants)
 * - Framer-motion for modals & floating panels
 * - Undo/Redo stack (Ctrl/Cmd+Z, Ctrl/Cmd+Y or Ctrl/Cmd+Shift+Z)
 * - Working lists, indent/outdent on Tab/Shift+Tab
 * - Color picker, link, table modals
 *
 * Props:
 *  - content (initial HTML)
 *  - setContent (callback)
 *  - mobileOptimized (bool)
 *
 * Drop into your project as RichTextEditor.jsx
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
  active,
  disabled,
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    disabled={disabled}
    aria-pressed={!!active}
    className={`inline-flex items-center justify-center rounded-md transition-all duration-150
      ${
        compact ? "p-1.5" : "p-2"
      } text-black dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-800 active:scale-95
      ${disabled ? "opacity-60 pointer-events-none" : ""}`}
    style={{ minWidth: compact ? 34 : 40 }}
  >
    {children}
  </button>
);

/* Simple modal used for Link/Table/Color */
const SimpleModal = ({ open, onClose, children, width = 440 }) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100000000] flex items-center justify-center">
          <motion.div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ y: 12, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-4"
            style={{ width, maxWidth: "94vw" }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/* InsertLinkForm */
const InsertLinkForm = ({ onInsert, onClose }) => {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onInsert(url.trim(), text.trim());
      }}
      className="space-y-4 p-1"
    >
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">
          URL
        </label>
        <input
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full p-2 text-sm rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-400 outline-none transition"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">
          Display text (optional)
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Link text"
          className="w-full p-2 text-sm rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-400 outline-none transition"
        />
      </div>

      <div className="flex gap-3 pt-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 p-2 text-sm font-medium rounded-md border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 p-2 text-sm font-medium rounded-md bg-green-600 hover:bg-green-700 text-white transition-colors"
        >
          Insert
        </button>
      </div>
    </form>
  );
};

/* CreateTableForm */
const CreateTableForm = ({ onCreate, onClose }) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCreate(Math.max(1, rows), Math.max(1, cols));
      }}
      className="space-y-3"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
            Rows
          </label>
          <input
            type="number"
            value={rows}
            onChange={(e) => setRows(parseInt(e.target.value) || 1)}
            min={1}
            className="w-full p-2 text-sm rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
            Columns
          </label>
          <input
            type="number"
            value={cols}
            onChange={(e) => setCols(parseInt(e.target.value) || 1)}
            min={1}
            className="w-full p-2 text-sm rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 outline-none"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 p-2 text-sm rounded-md border border-gray-300 dark:border-zinc-700 dark:text-gray-200 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 p-2 text-sm rounded-md bg-green-600 hover:bg-green-700 text-white transition-colors"
        >
          Create
        </button>
      </div>
    </form>
  );
};

/* ColorPickerModal */
const ColorPickerModal = ({
  open,
  colorType,
  onClose,
  applyColor,
  activeColor,
  setActiveColor,
}) => {
  return (
    <SimpleModal open={open} onClose={onClose} width={420}>
      <div className="p-5 bg-gradient-to-b from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-950 text-gray-800 dark:text-gray-100 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.5)] transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Droplets className="w-4 h-4 text-green-500" />
            {colorType === "cell"
              ? "Cell Background Color"
              : colorType === "text"
              ? "Text Color"
              : "Background Color"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-gray-200/60 dark:hover:bg-zinc-800/80 transition-colors duration-150"
            aria-label="Close color picker"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-6 gap-2 mb-4">
          {COLOR_PRESETS.map((c) => {
            const lower = (c || "").toLowerCase();
            const isActive = activeColor && lower === activeColor.toLowerCase();
            return (
              <button
                key={c}
                onClick={() => {
                  applyColor(colorType === "cell" ? "cell" : colorType, c);
                  setActiveColor(c);
                  onClose();
                }}
                title={c}
                style={{ backgroundColor: c }}
                className={`relative w-9 h-9 rounded-xl border transition-all duration-200 hover:scale-110 active:scale-95 ${
                  isActive
                    ? "ring-2 ring-green-400 border-green-400"
                    : "border-gray-300 dark:border-zinc-700"
                }`}
                aria-pressed={isActive}
              >
                {c === "#ffffff" && (
                  <div className="absolute inset-0 rounded-xl border border-gray-300/50" />
                )}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Or pick custom color
        </div>
        <div className="flex items-center gap-3">
          <input
            type="color"
            defaultValue={activeColor || PRIMARY}
            className="w-full h-10 rounded-lg border border-gray-300 dark:border-zinc-700 cursor-pointer bg-transparent hover:scale-[1.02] transition-transform"
            onChange={(e) => {
              const val = e.target.value;
              applyColor(colorType === "cell" ? "cell" : colorType, val);
              setActiveColor(val);
              onClose();
            }}
            aria-label="Pick custom color"
          />
          <div
            className="px-3 py-1.5 text-xs rounded-md border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 select-none"
            style={{ color: activeColor || PRIMARY }}
          >
            {(activeColor || PRIMARY).toUpperCase()}
          </div>
        </div>
      </div>
    </SimpleModal>
  );
};

/* ===== Main component ===== */
const RichTextEditor = forwardRef(
  ({ content = "<p><br/></p>", setContent, mobileOptimized = false }, ref) => {
    const editorRef = useRef(null);
    const rootRef = useRef(null);

    const [html, setHtml] = useState(content || "<p><br/></p>");
    const [wordCount, setWordCount] = useState(0);
    const [lastSaved, setLastSaved] = useState(new Date());
    const [isTyping, setIsTyping] = useState(false);

    // modal / UI states
    const [linkModal, setLinkModal] = useState(false);
    const [tableModal, setTableModal] = useState(false);
    const [colorModal, setColorModal] = useState({ open: false, type: "text" });
    const [optOpen, setOptOpen] = useState(false);
    const [quoteStyle, setQuoteStyle] = useState(1);
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedCell, setSelectedCell] = useState(null);

    const [activeColor, setActiveColor] = useState(PRIMARY);

    // undo / redo stacks
    const undoRef = useRef([]); // array of html snapshots
    const redoRef = useRef([]);
    const suppressStackRef = useRef(false);
    const saveTimerRef = useRef(null);
    
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
      // initialize content and stacks
      if (editorRef.current) {
        editorRef.current.innerHTML = content || "<p><br/></p>";
        updateCounts(editorRef.current.innerText || "");
        attachTableListeners();
        undoRef.current = [editorRef.current.innerHTML];
        redoRef.current = [];
      }

      // keyboard shortcuts (global within editor)
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

      // attach to document for broad capture while focused on editor
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const attachTableListeners = () => {
      const el = editorRef.current;
      if (!el) return;
      el.querySelectorAll("table").forEach((t) => {
        if (!t.__rich_attached) {
          t.addEventListener("click", (ev) => {
            ev.stopPropagation();
            setSelectedTable(t);
            const cell = ev.target.closest("td,th");
            if (cell) setSelectedCell(cell);
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
      // limit stack size
      if (stack.length > 80) stack.splice(0, stack.length - 80);
      // clear redo when new edit
      redoRef.current = [];
    };

    const handleUndo = () => {
      const stack = undoRef.current;
      if (stack.length <= 1) return; // nothing to undo
      const current = stack.pop(); // remove current
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

    const exec = (cmd, value = null) => {
      document.execCommand(cmd, false, value);
      triggerChange();
    };

    const triggerChange = () => {
      if (!editorRef.current) return;
      const newHtml = editorRef.current.innerHTML;
      setHtml(newHtml);
      setContent?.(newHtml);
      updateCounts(editorRef.current.innerText || "");
      setIsTyping(true);

      // push to undo stack (debounced slightly to avoid insane growth)
      if (!suppressStackRef.current) {
        pushToUndo(newHtml);
        // debounce lastSaved update
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

    /* Actions */
    const applyColor = (type, color) => {
      const range = getRange();
      if (!range && type !== "cell") return;
      if (type === "cell") {
        if (selectedCell) {
          selectedCell.style.backgroundColor = color;
          setActiveColor(color);
          triggerChange();
        }
        return;
      }
      const span = document.createElement("span");
      if (type === "text") span.style.color = color;
      if (type === "background") span.style.backgroundColor = color;
      const contents = range.extractContents();
      span.appendChild(contents);
      range.insertNode(span);
      setActiveColor(color);
      triggerChange();
    };

    const insertLink = (url, text) => {
      const range = getRange();
      if (!range) return;
      const a = document.createElement("a");
      a.href = url;
      a.textContent = text || url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      range.deleteContents();
      range.insertNode(a);
      triggerChange();
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
      table.addEventListener("click", (ev) => {
        ev.stopPropagation();
        setSelectedTable(table);
        setSelectedCell(ev.target.closest("td,th"));
      });
      if (range) {
        range.deleteContents();
        range.insertNode(table);
      } else {
        editorRef.current.appendChild(table);
      }
      triggerChange();
    };

    const performTableAction = (action) => {
      if (!selectedTable) return;
      const rows = selectedTable.rows.length;
      const cols = selectedTable.rows[0]?.cells.length || 0;
      switch (action) {
        case "addRow": {
          const tr = selectedTable.insertRow();
          for (let i = 0; i < cols; i++) {
            const td = tr.insertCell();
            td.innerHTML = "<br/>";
            td.style.border = "1px solid rgba(0,0,0,0.08)";
            td.style.padding = "10px";
          }
          break;
        }
        case "addColumn": {
          Array.from(selectedTable.rows).forEach((r) => {
            const td = r.insertCell();
            td.innerHTML = "<br/>";
            td.style.border = "1px solid rgba(0,0,0,0.08)";
            td.style.padding = "10px";
          });
          break;
        }
        case "deleteRow": {
          if (rows > 1) selectedTable.deleteRow(rows - 1);
          break;
        }
        case "deleteColumn": {
          if (cols > 1) {
            Array.from(selectedTable.rows).forEach((r) => {
              r.deleteCell(cols - 1);
            });
          }
          break;
        }
        case "deleteTable": {
          selectedTable.remove();
          setSelectedTable(null);
          setSelectedCell(null);
          break;
        }
        case "equalize": {
          const percent = Math.floor(100 / cols);
          Array.from(selectedTable.rows).forEach((r) =>
            Array.from(r.cells).forEach((cell) => {
              cell.style.width = `${percent}%`;
            })
          );
          break;
        }
        case "autofit": {
          Array.from(selectedTable.rows).forEach((r) =>
            Array.from(r.cells).forEach((cell) => {
              cell.style.width = "";
            })
          );
          break;
        }
        case "resetColors": {
          Array.from(selectedTable.querySelectorAll("td,th")).forEach(
            (cell) => {
              cell.style.backgroundColor = "";
            }
          );
          break;
        }
      }
      triggerChange();
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
      setOptOpen(false);
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

    /* Editor keyboard behavior for lists / indentation */
    const handleEditorKeyDown = (e) => {
      // Tab -> indent list item; Shift+Tab -> outdent
      if (e.key === "Tab") {
        const sel = window.getSelection();
        if (!sel) return;
        // if inside list, indent/outdent
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
      // Enter inside list: keep behavior native, but ensure proper spacing
      // (no extra code required unless custom behavior needed)
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
            <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-md">
              <WholeWord size={20} />
              <span className="text-xs">{wordCount}</span>
            </div>

            <div className="flex items-center gap-2">
              <ToolbarButton title="Import" onClick={importFile} compact>
                <Upload size={16} />
              </ToolbarButton>
              <ToolbarButton
                title="Export HTML"
                onClick={() => exportHTML("exported")}
                compact
              >
                <Download size={16} />
              </ToolbarButton>
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

          <ToolbarButton
            title="Text color"
            onClick={() => setColorModal({ open: true, type: "text" })}
            compact
            active={colorModal.type === "text"}
          >
            <Palette size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Cell / Background color"
            onClick={() => setColorModal({ open: true, type: "cell" })}
            compact
            active={colorModal.type === "cell"}
          >
            <Highlighter size={16} />
          </ToolbarButton>

          <div className="w-px h-6 bg-gray-200 dark:bg-zinc-700 mx-1" />

          <ToolbarButton
            title="Insert link"
            onClick={() => setLinkModal(true)}
            compact
          >
            <LinkIcon size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Insert table"
            onClick={() => setTableModal(true)}
            compact
          >
            <Table size={16} />
          </ToolbarButton>

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

          <div className="flex-1" />

          {/* optimize */}
          <div className="relative">
            <ToolbarButton
              title="Optimize"
              onClick={() => setOptOpen(!optOpen)}
              compact
            >
              <Settings size={16} />
            </ToolbarButton>

            <AnimatePresence>
              {optOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
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

        {/* Table Actions (floating panel) */}
        <AnimatePresence>
          {selectedTable && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed right-6 top-6 z-40 w-56 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-gray-200/60 dark:border-zinc-700/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl p-4 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  Table ({selectedTable.rows.length}×
                  {selectedTable.rows[0]?.cells.length || 0})
                </div>
                <button
                  onClick={() => setSelectedTable(null)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  <X size={16} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => performTableAction("addRow")}
                  className="flex items-center justify-center gap-2 text-xs font-medium p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  <Plus size={14} /> Row
                </button>
                <button
                  onClick={() => performTableAction("addColumn")}
                  className="flex items-center justify-center gap-2 text-xs font-medium p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  <Plus size={14} /> Col
                </button>
                <button
                  onClick={() => performTableAction("deleteRow")}
                  className="flex items-center justify-center gap-2 text-xs font-medium p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  <Minus size={14} /> Row
                </button>
                <button
                  onClick={() => performTableAction("deleteColumn")}
                  className="flex items-center justify-center gap-2 text-xs font-medium p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  <Minus size={14} /> Col
                </button>
                <button
                  onClick={() => performTableAction("equalize")}
                  className="col-span-2 text-xs font-medium text-gray-700 dark:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  Equalize Widths
                </button>
                <button
                  onClick={() => performTableAction("deleteTable")}
                  className="col-span-2 flex items-center justify-center gap-2 text-xs font-medium p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-950/40 transition"
                >
                  <Trash2 size={14} /> Delete Table
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals */}
        <SimpleModal open={linkModal} onClose={() => setLinkModal(false)}>
          <InsertLinkForm
            onInsert={(u, t) => {
              insertLink(u, t);
              setLinkModal(false);
            }}
            onClose={() => setLinkModal(false)}
          />
        </SimpleModal>

        <SimpleModal open={tableModal} onClose={() => setTableModal(false)}>
          <CreateTableForm
            onCreate={(r, c) => {
              insertTable(r, c);
              setTableModal(false);
            }}
            onClose={() => setTableModal(false)}
          />
        </SimpleModal>

        <ColorPickerModal
          open={colorModal.open}
          colorType={colorModal.type}
          onClose={() => setColorModal({ open: false, type: "text" })}
          applyColor={applyColor}
          activeColor={activeColor}
          setActiveColor={setActiveColor}
        />

        {/* Styles: quotes, tables, responsiveness */}
        <style>{`
        :root { --primary: ${PRIMARY}; }
        .rich-text-editor:focus { outline: none; }

        /* modern quote styles */
        .rich-text-editor blockquote { margin: 12px 0; padding: 14px 18px; border-left: 5px solid var(--primary); border-radius: 8px; background: rgba(0,214,22,0.06); color: #064e2a; }
        .rich-text-editor .quote-style-1 { border-left-color: var(--primary); background: linear-gradient(90deg, rgba(0,214,22,0.05), rgba(255,255,255,0)); color: #063e2a; }
        .rich-text-editor .quote-style-2 { border-left-color: #2563eb; background: linear-gradient(90deg, rgba(37,99,235,0.04), rgba(255,255,255,0)); color: #07336b; }
        .rich-text-editor .quote-style-3 { border-left-color: #7c3aed; background: linear-gradient(90deg, rgba(124,58,237,0.04), rgba(255,255,255,0)); color: #3e0f66; font-style: italic; }

        /* table */
        .rich-text-editor table.modern-table th { background: #f8fafc; font-weight: 600; }
        .rich-text-editor table.modern-table td, .rich-text-editor table.modern-table th { border: 1px solid rgba(0,0,0,0.06); padding: 10px; vertical-align: top; }
        .rich-text-editor a { color: var(--primary); text-decoration: underline; }

        @media (max-width: 640px) {
          .rich-text-editor { font-size: 14px; }
        }
      `}</style>
      </div>
    );
  }
);

export default RichTextEditor;
