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
  Upload,
  FileText,
  Eye,
  Edit3,
  Save,
  Download,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * RichTextEditor
 * - primary color: #00d616
 * - responsive, compact (text-xs where helpful)
 * - table cell bg color support
 * - Optimize menu (clean, autofit, equalize, reset)
 *
 * Props:
 * - content (initial HTML)
 * - setContent (callback)
 * - mobileOptimized (bool)
 */
const PRIMARY = "#00d616";

const ToolbarButton = ({ title, children, onClick, compact }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`inline-flex items-center justify-center rounded-md transition-all duration-150
      ${
        compact ? "p-1.5" : "p-2"
      } text-gray-700 hover:bg-gray-100 active:scale-95`}
    style={{ minWidth: compact ? 34 : 40 }}
  >
    {children}
  </button>
);

/* ===== Modals & small UI pieces ===== */

const SimpleModal = ({ open, onClose, children, width = 420 }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 12, opacity: 0 }}
        className="relative bg-white dark:bg-zinc-900 rounded-xl shadow-2xl p-4"
        style={{ width, maxWidth: "94vw" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

/* Color palette used in multiple places */
const COLOR_PRESETS = [
  "#000000",
  "#dc2626",
  "#ea580c",
  "#ca8a04",
  "#00d616", // primary
  "#0891b2",
  "#2563eb",
  "#7c3aed",
  "#c026d3",
  "#4c0519",
  "#374151",
  "#6b7280",
];

/* ===== Main Component ===== */

const RichTextEditor = ({
  content = "<p><br/></p>",
  setContent,
  mobileOptimized = false,
}) => {
  const editorRef = useRef(null);
  const [html, setHtml] = useState(content || "<p><br/></p>");
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [isTyping, setIsTyping] = useState(false);

  // modals / tool states
  const [linkModal, setLinkModal] = useState(false);
  const [tableModal, setTableModal] = useState(false);
  const [colorModal, setColorModal] = useState({ open: false, type: "text" }); // type: 'text' | 'background' | 'cell'
  const [optOpen, setOptOpen] = useState(false);
  const [quoteStyle, setQuoteStyle] = useState(1); // 1..3
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);

  const saveTimerRef = useRef(null);

  useEffect(() => {
    // initialize editor content
    if (editorRef.current) {
      editorRef.current.innerHTML = content || "<p><br/></p>";
      updateCounts(editorRef.current.innerText || "");
      attachTableListeners();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // attach click handlers to tables to show options
  const attachTableListeners = () => {
    const el = editorRef.current;
    if (!el) return;
    el.querySelectorAll("table").forEach((t) => {
      // avoid duplicate listener
      if (!t.__rich_attached) {
        t.addEventListener("click", (ev) => {
          ev.stopPropagation();
          setSelectedTable(t);
          // detect clicked cell
          const cell = ev.target.closest("td,th");
          if (cell) setSelectedCell(cell);
        });
        t.__rich_attached = true;
      }
    });
  };

  // helper: get selection range
  const getRange = () => {
    const sel = window.getSelection();
    return sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
  };

  // wrapper "execCommand" to keep older shortcuts
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
    // typing indicator / auto-save
    setIsTyping(true);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setIsTyping(false);
      setLastSaved(new Date());
      saveTimerRef.current = null;
    }, 900);
    // re-attach table listeners because DOM might have changed
    setTimeout(attachTableListeners, 50);
  };

  const updateCounts = (text) => {
    const clean = text.replace(/\u00A0/g, " ").trim();
    if (!clean) return setWordCount(0);
    setWordCount(clean.split(/\s+/).filter(Boolean).length);
  };

  /* ===== Actions ===== */

  const applyColor = (type, color) => {
    // type: 'text' | 'background' | 'cell'
    const range = getRange();
    if (!range && type !== "cell") return;

    if (type === "cell") {
      // apply to selectedCell if present
      if (selectedCell) {
        selectedCell.style.backgroundColor = color;
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
          r === 0 ? document.createElement("th") : document.createElement("td");
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

  // Table actions (add row/col, delete, equalize widths, autofit)
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
        // set equal widths
        const percent = Math.floor(100 / cols);
        Array.from(selectedTable.rows).forEach((r) =>
          Array.from(r.cells).forEach((cell) => {
            cell.style.width = `${percent}%`;
          })
        );
        break;
      }
      case "autofit": {
        // remove fixed widths to let content determine widths
        Array.from(selectedTable.rows).forEach((r) =>
          Array.from(r.cells).forEach((cell) => {
            cell.style.width = "";
          })
        );
        break;
      }
      case "resetColors": {
        Array.from(selectedTable.querySelectorAll("td,th")).forEach((cell) => {
          cell.style.backgroundColor = "";
        });
        break;
      }
    }
    triggerChange();
  };

  // Optimize actions
  const optimizeAction = (act) => {
    switch (act) {
      case "cleanFormatting": {
        // remove inline styles and tags we don't want; keep basic tags
        const el = editorRef.current;
        if (!el) return;
        // convert to plain text then re-insert basic tags (simple approach)
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

  const clearFormatting = () => {
    exec("removeFormat");
  };

  // Quote styles - apply blockquote with different classes
  const applyQuoteStyle = (styleIndex) => {
    const range = getRange();
    if (!range) return;
    // create blockquote wrapper
    const block = document.createElement("blockquote");
    block.className = `quote-style-${styleIndex}`;
    const contents = range.extractContents();
    // ensure text goes into a paragraph inside blockquote
    const p = document.createElement("p");
    p.appendChild(contents);
    block.appendChild(p);
    range.insertNode(block);
    triggerChange();
  };

  // Basic paste cleanup (strip dangerous tags)
  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData(
      "text/plain"
    );
    // simple conversion of newlines to <br/>
    const html = text.replace(/\n/g, "<br/>");
    document.execCommand("insertHTML", false, html);
    triggerChange();
  };

  // editor input handler
  const handleInput = () => {
    triggerChange();
  };

  /* ===== Exports helpers (HTML / TXT) ===== */
  const exportHTML = (title = "note") => {
    const noteHTML = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${title}</title>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; color: #111827; }
            .note-title { font-size: 1.6rem; font-weight: 700; margin-bottom: 8px; color: ${PRIMARY}; }
            .note-content { line-height: 1.6; }
            table { border-collapse: collapse; width: 100%; }
            table td, table th { border: 1px solid #e5e7eb; padding: 8px; }
            blockquote { border-left: 4px solid ${PRIMARY}; padding: 8px 16px; background: #f7fff2; }
          </style>
        </head>
        <body>
          <div class="note-title">${title}</div>
          <div class="note-meta">Exported: ${new Date().toLocaleString()}</div>
          <div class="note-content">${editorRef.current?.innerHTML || ""}</div>
        </body>
      </html>
    `;
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

  /* ===== Import (html or txt) ===== */
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
          // parse HTML, take body innerHTML
          try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");
            const body = doc.body.innerHTML;
            editorRef.current.innerHTML = body || "<p><br/></p>";
          } catch {
            editorRef.current.innerHTML = text;
          }
        } else {
          // txt / md -> simple newline -> <br/>
          const html = text.replace(/\n/g, "<br/>");
          editorRef.current.innerHTML = `<p>${html}</p>`;
        }
        triggerChange();
      };
      reader.readAsText(f);
    };
    input.click();
  };

  /* ===== UI Rendering ===== */
  return (
    <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-zinc-700">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-md"
            style={{ background: "linear-gradient(90deg,#f0fff3, #e8fff7)" }}
          >
            <Sparkles size={16} color={PRIMARY} />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              Text Editor
            </div>
            <div className="text-xs text-gray-500">
              {wordCount} words • updated{" "}
              {lastSaved.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-gray-50 dark:bg-zinc-800 px-2 py-1 rounded-md">
            <Type size={14} className="text-gray-600" />
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {wordCount}
            </span>
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

      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-100 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        {/* basics */}
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
        >
          <Palette size={16} />
        </ToolbarButton>
        <ToolbarButton
          title="Cell / Background color"
          onClick={() => setColorModal({ open: true, type: "cell" })}
          compact
        >
          <Highlighter size={16} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-200 dark:bg-zinc-700 mx-1" />

        <ToolbarButton
          title="Insert link"
          onClick={() => setLinkModal(true)}
          compact
        >
          <Link size={16} />
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
          }}
          compact
        >
          <Quote size={16} />
        </ToolbarButton>

        <div className="flex-1" />

        {/* optimize / clear */}
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
          onClick={clearFormatting}
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

      {/* editor area */}
      <div className="p-4 min-h-[280px] bg-white dark:bg-zinc-900">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onPaste={handlePaste}
          className="rich-text-editor min-h-[220px] p-2 text-sm leading-6 text-gray-900 dark:text-gray-100"
          style={{
            fontFamily:
              'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
          }}
        />
      </div>

      {/* TABLE OPTIONS floating when a table is selected */}
      <AnimatePresence>
        {selectedTable && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="fixed z-40 right-6 p-4 top-6 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-xl"
            style={{ width: 220 }}
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold mb-1">
                Table ({selectedTable.rows.length}×
                {selectedTable.rows[0]?.cells.length || 0})
              </div>
              <X onClick={() => setSelectedTable(null)} size={16} />
            </div>

            <div className="grid grid-cols-2 gap-1">
              <button
                className="text-xs flex items-center gap-2 p-2 rounded hover:bg-gray-50"
                onClick={() => performTableAction("addRow")}
              >
                <Plus size={14} /> Row
              </button>
              <button
                className="text-xs flex items-center gap-2 p-2 rounded hover:bg-gray-50"
                onClick={() => performTableAction("addColumn")}
              >
                <Plus size={14} /> Col
              </button>
              <button
                className="text-xs flex items-center gap-2 p-2 rounded hover:bg-gray-50"
                onClick={() => performTableAction("deleteRow")}
              >
                <Minus size={14} /> Row
              </button>
              <button
                className="text-xs flex items-center gap-2 p-2 rounded hover:bg-gray-50"
                onClick={() => performTableAction("deleteColumn")}
              >
                <Minus size={14} /> Col
              </button>
              <button
                className="col-span-2 text-xs p-2 rounded hover:bg-gray-50"
                onClick={() => performTableAction("equalize")}
              >
                Equalize Widths
              </button>
              <button
                className="col-span-2 flex items-center gap-2 justify-center text-xs p-2 rounded text-red-600 hover:bg-red-50"
                onClick={() => performTableAction("deleteTable")}
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

      <SimpleModal
        open={colorModal.open}
        onClose={() => setColorModal({ open: false, type: "text" })}
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold">
              {colorModal.type === "cell"
                ? "Cell Background Color"
                : colorModal.type === "text"
                ? "Text Color"
                : "Background Color"}
            </div>
            <button
              onClick={() => setColorModal({ open: false, type: "text" })}
            >
              <X />
            </button>
          </div>
          <div className="grid grid-cols-6 gap-2 mb-3">
            {COLOR_PRESETS.map((c) => (
              <button
                key={c}
                className="w-8 h-8 rounded-md border"
                style={{ background: c }}
                onClick={() => {
                  applyColor(
                    colorModal.type === "cell" ? "cell" : colorModal.type,
                    c
                  );
                  setColorModal({ open: false, type: "text" });
                }}
              />
            ))}
          </div>
          <div className="text-xs text-gray-600 mb-2">Or pick custom</div>
          <input
            type="color"
            className="w-full h-10 rounded-md"
            onChange={(e) => {
              applyColor(
                colorModal.type === "cell" ? "cell" : colorModal.type,
                e.target.value
              );
              setColorModal({ open: false, type: "text" });
            }}
          />
        </div>
      </SimpleModal>

      {/* Styles: primary color, quotes, table */}
      <style>{`
        :root { --primary: ${PRIMARY}; }
        .rich-text-editor:focus { outline: none; }
        .rich-text-editor blockquote { margin: 12px 0; padding: 12px 16px; border-left: 4px solid var(--primary); border-radius: 6px; background: rgba(0,214,22,0.06); color: #064e2a; }
        .rich-text-editor .quote-style-1 { border-left-color: var(--primary); background: rgba(0,214,22,0.06); }
        .rich-text-editor .quote-style-2 { border-left-color: #2563eb; background: rgba(37,99,235,0.04); }
        .rich-text-editor .quote-style-3 { border-left-color: #7c3aed; background: rgba(124,58,237,0.04); font-style: italic; }
        .rich-text-editor table.modern-table th { background: #f8fafc; font-weight: 600; }
        .rich-text-editor table.modern-table td, .rich-text-editor table.modern-table th { border: 1px solid rgba(0,0,0,0.06); padding: 10px; vertical-align: top; }
        .rich-text-editor a { color: var(--primary); text-decoration: underline; }
        @media (max-width: 640px) {
          .rich-text-editor { font-size: 14px; }
        }
      `}</style>
    </div>
  );
};

/* ===== small components used above ===== */

const InsertLinkForm = ({ onInsert, onClose }) => {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onInsert(url, text);
      }}
      className="space-y-3"
    >
      <div>
        <label className="text-xs font-medium">URL</label>
        <input
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full p-2 border rounded-md mt-1 text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-medium">Display text (optional)</label>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Link text"
          className="w-full p-2 border rounded-md mt-1 text-sm"
        />
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 p-2 text-sm rounded-md border"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 p-2 text-sm rounded-md bg-green-600 text-white"
        >
          Insert
        </button>
      </div>
    </form>
  );
};

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
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-medium">Rows</label>
          <input
            type="number"
            value={rows}
            onChange={(e) => setRows(parseInt(e.target.value) || 1)}
            min={1}
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium">Columns</label>
          <input
            type="number"
            value={cols}
            onChange={(e) => setCols(parseInt(e.target.value) || 1)}
            min={1}
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 p-2 text-sm rounded-md border"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 p-2 text-sm rounded-md bg-green-600 text-white"
        >
          Create
        </button>
      </div>
    </form>
  );
};

export default RichTextEditor;
