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
  Table,
  Trash2,
  Palette,
  Highlighter,
  Plus,
  RotateCcw,
  RotateCw,
  Type,
  RemoveFormatting,
  ImagePlus,
  Stars,
  Edit2,
} from "lucide-react";
import "../RichTextEditor.module.css";
import Dropdown from "./TextEditor/DropDown";
import EditableTable from "./TextEditor/EditableTable";
import EditImage from "./TextEditor/EditImage";
import TextEditorBlock from "./TextEditor/TextEditorBlock";

// Reusable button component for bottom panel
const AddBlockButton = ({ icon, label, onClick }) => (
  <div className="w-full max-w-6xl mx-auto flex items-center justify-center">
    <div
      onClick={onClick}
      className="group w-full cursor-pointer border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl h-36 flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:border-primary hover:bg-primary/5"
    >
      <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-900 shadow-lg flex items-center justify-center transition-all duration-300 group-hover:bg-primary">
        {icon}
      </div>
      <div className="text-center text-sm text-zinc-200">{label}</div>
    </div>
  </div>
);

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

    const [blocks, setBlocks] = useState([]);

    console.log(blocks);
    const [tableOfContents, setTableOfContents] = useState([]);

    // dropdown states (replace modals)
    const [openDropdown, setOpenDropdown] = useState(null); // 'color','highlight','link','table','size','opt'
    const [dropdownAnchor, setDropdownAnchor] = useState(null); // ref for positioning if needed

    const [selectedCell, setSelectedCell] = useState(null);

    const [activeColor, setActiveColor] = useState(PRIMARY);

    // undo / redo stacks
    const undoRef = useRef([]); // array of html snapshots
    const redoRef = useRef([]);
    const suppressStackRef = useRef(false);

    // link inputs
    const [linkUrl, setLinkUrl] = useState("");
    const [linkText, setLinkText] = useState("");

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
      const toc = [];

      blocks.forEach((block, index) => {
        const div = document.createElement("div");
        div.innerHTML = block.html;

        const heading = div.querySelector("h1, h2, h3");
        if (heading) {
          toc.push({
            id: block.id,
            text: heading.innerText,
            level: heading.tagName.toLowerCase(),
            index,
          });
        }
      });

      setTableOfContents(toc);
    }, [blocks]);

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

    // Add a new block at given index with type
    const addBlock = (index, type = "text") => {
      const newBlock = {
        id: Date.now(),
        type,
        content: type === "text" ? "" : null, // text gets empty content, others optional
      };
      const updated = [...blocks];
      updated.splice(index + 1, 0, newBlock);
      setBlocks(updated);
    };

    // Delete block by id
    const deleteBlock = (id) => {
      setBlocks(blocks.filter((b) => b.id !== id));
    };

    // Update text block content
    const updateBlock = (id, content) => {
      setBlocks(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
      triggerChange();
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
          null,
        );
        let hasStyle = false;

        // First pass: check if any node already has this style
        const tempFrag = frag.cloneNode(true);
        const tempWalker = document.createTreeWalker(
          tempFrag,
          NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
          null,
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
        case "formatBlock": {
          const blockEl = range.startContainer.closest("div[contenteditable]");
          if (!blockEl) return;

          blockEl.innerHTML = `<${value}>${blockEl.innerText}</${value}>`;
          break;
        }

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
      const newHtml = blocks.map((b) => b.html).join("");
      setHtml(newHtml);
      setContent?.(newHtml);

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = newHtml;
      updateCounts(tempDiv.innerText || "");

      if (!suppressStackRef.current) {
        pushToUndo(newHtml);
      }
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

    /* ---------- JSX ---------- */
    return (
      <div
        ref={rootRef}
        className="w-full h-full bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-zinc-800 overflow-hidden"
      >
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
        </div>

        {tableOfContents.length > 0 && (
          <div className="p-4 border-b bg-gray-50 dark:bg-zinc-900">
            <div className="font-semibold mb-2">Table of Contents</div>

            {tableOfContents.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  const element = document.querySelector(
                    `[data-block-id="${item.id}"]`,
                  );
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`
          cursor-pointer text-sm hover:text-green-600
          ${item.level === "h2" ? "ml-4" : ""}
          ${item.level === "h3" ? "ml-8" : ""}
        `}
              >
                {item.text}
              </div>
            ))}
          </div>
        )}

        {/* Editor Area */}
        <div className="p-6 bg-white dark:bg-black">
          <div ref={editorRef} className="mx-auto space-y-6">
            {blocks.map((block, index) => (
              <div key={block.id} className="relative group">
                {/* Render block by type */}
                {block.type === "text" && (
                  <TextEditorBlock
                    value={block.content || ""}
                    onChange={(html) => updateBlock(block.id, html)}
                  />
                )}

                {block.type === "image" && (
                  <div className="relative">
                    {block.content?.isEditing ? (
                      <EditImage
                        initialUrl={block.content.url || ""}
                        onDone={(newUrl) =>
                          updateBlock(block.id, {
                            content: { url: newUrl, isEditing: false },
                          })
                        }
                        onCancel={() =>
                          updateBlock(block.id, {
                            content: { ...block.content, isEditing: false },
                          })
                        }
                      />
                    ) : (
                      <div className="relative group">
                        {block.content?.url ? (
                          <>
                            <img
                              src={block.content.url}
                              alt="User uploaded"
                              className="w-full h-auto max-h-[300px] object-contain rounded-lg border border-zinc-200 dark:border-zinc-700"
                            />
                            <div className="absolute top-2 right-2 flex gap-2">
                              <button
                                onClick={() =>
                                  updateBlock(block.id, {
                                    content: {
                                      ...block.content,
                                      isEditing: true,
                                    },
                                  })
                                }
                                className="p-1 text-sky-600 hover:text-sky-700 rounded-full bg-white dark:bg-zinc-900 shadow hover:shadow-md transition"
                                title="Edit image"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => deleteBlock(block.id)}
                                className="p-1 text-red-600 hover:text-red-700 rounded-full bg-white dark:bg-zinc-900 shadow hover:shadow-md transition"
                                title="Delete image"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div
                            onClick={() =>
                              updateBlock(block.id, {
                                content: { url: "", isEditing: true },
                              })
                            }
                            className="cursor-pointer min-h-[180px] border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg flex flex-col items-center justify-center gap-3 bg-zinc-50 dark:bg-zinc-800/50"
                          >
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              Click to add image
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {block.type === "table" && (
                  <div className="relative">
                    {block.content.isEditing ? (
                      <EditableTable
                        initialRows={block.content?.rows.length || 2}
                        initialCols={block.content?.headers.length || 2}
                        initialData={block.content}
                        onDone={(data) => {
                          // Save edited table
                          updateBlock(block.id, { ...data, isEditing: false });
                        }}
                      />
                    ) : block.content ? (
                      <>
                        {/* Render modern table */}
                        <div className="relative overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm bg-white dark:bg-zinc-900">
                          <table className="w-full text-sm text-left text-zinc-700 dark:text-zinc-200 border-collapse">
                            <thead className="bg-zinc-100 dark:bg-zinc-800">
                              <tr>
                                {block.content.headers.map((h, i) => (
                                  <th
                                    key={i}
                                    className="px-4 py-2 font-medium text-zinc-900 dark:text-zinc-100 border-b border-zinc-300 dark:border-zinc-600 text-left"
                                  >
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {block.content.rows.map((row, i) => (
                                <tr
                                  key={i}
                                  className={`${
                                    i % 2 === 0
                                      ? "bg-white dark:bg-zinc-900"
                                      : "bg-zinc-50 dark:bg-zinc-800/50"
                                  } hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors`}
                                >
                                  {row.map((cell, j) => (
                                    <td
                                      key={j}
                                      className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-700"
                                    >
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          {/* Edit/Delete buttons */}
                          <div className="absolute top-2 right-2 flex gap-2">
                            <button
                              onClick={() =>
                                updateBlock(block.id, {
                                  ...block.content,
                                  isEditing: true,
                                })
                              }
                              className="p-1 text-sky-600 hover:text-sky-700 rounded-full bg-white dark:bg-zinc-900 shadow hover:shadow-md transition"
                              title="Edit table"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => deleteBlock(block.id)}
                              className="p-1 text-red-600 hover:text-red-700 rounded-full bg-white dark:bg-zinc-900 shadow hover:shadow-md transition"
                              title="Delete table"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      // New table
                      <EditableTable
                        initialRows={2}
                        initialCols={2}
                        onDone={(data) => updateBlock(block.id, data)}
                      />
                    )}
                  </div>
                )}

                {block.type === "ai" && (
                  <div className="min-h-[80px] p-4 rounded-lg border-2 border-dashed border-purple-500 flex items-center justify-center text-gray-500">
                    AI Generated Content
                  </div>
                )}

                {/* Delete button */}
                <button
                  onClick={() => deleteBlock(block.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {/* ================================= */}
            {/* Large Dashed Add Section (BOTTOM) */}
            {/* ================================= */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-4">
              <AddBlockButton
                icon={<Plus size={20} />}
                label="Add Text"
                onClick={() => addBlock(blocks.length - 1, "text")}
              />
              <AddBlockButton
                icon={<ImagePlus size={20} />}
                label="Add Image"
                onClick={() => addBlock(blocks.length - 1, "image")}
              />
              <AddBlockButton
                icon={<Table size={20} />}
                label="Add Table"
                onClick={() => addBlock(blocks.length - 1, "table")}
              />
              <AddBlockButton
                icon={<Stars size={20} />}
                label="Add AI Content"
                onClick={() => addBlock(blocks.length - 1, "ai")}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default RichTextEditor;
