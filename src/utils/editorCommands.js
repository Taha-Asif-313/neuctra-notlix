export const createEditorCommands = (editorRef) => {
  const focus = () => editorRef.current?.focus();

  const exec = (command, value = null) => {
    focus();
    document.execCommand(command, false, value);
  };

  /* ---------------- Basic Toggles ---------------- */
  const bold = () => exec("bold");
  const italic = () => exec("italic");
  const underline = () => exec("underline");
  const strike = () => exec("strikeThrough");

  /* ---------------- Lists ---------------- */
  const unorderedList = () => exec("insertUnorderedList");
  const orderedList = () => exec("insertOrderedList");

  /* ---------------- Alignment ---------------- */
  const align = (type) => {
    const map = {
      left: "justifyLeft",
      center: "justifyCenter",
      right: "justifyRight",
      justify: "justifyFull",
    };
    exec(map[type]);
  };

  /* ---------------- Font Size ---------------- */
  const fontSize = (size) => {
    focus();
    document.execCommand("fontSize", false, "7");
    const fonts = editorRef.current.getElementsByTagName("font");
    for (let el of fonts) {
      if (el.size === "7") {
        el.removeAttribute("size");
        el.style.fontSize = size + "px";
      }
    }
  };

  /* ---------------- Font Family ---------------- */
  const fontFamily = (family) => {
    focus();
    document.execCommand("fontName", false, family);
  };

  /* ---------------- Text Color ---------------- */

  const color = (hex) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      // Insert a span for typing with selected color
      const span = document.createElement("span");
      span.style.color = hex;
      span.appendChild(document.createTextNode("\u200B")); // zero-width char
      range.insertNode(span);

      const newRange = document.createRange();
      newRange.setStart(span.firstChild, 1);
      newRange.collapse(true);

      selection.removeAllRanges();
      selection.addRange(newRange);
    } else {
      // Wrap each text node in the selection with a span
      const content = range.cloneContents();
      const frag = document.createDocumentFragment();

      content.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const span = document.createElement("span");
          span.style.color = hex;
          span.textContent = node.textContent;
          frag.appendChild(span);
        } else {
          // recursively apply color to element nodes
          const wrapper = document.createElement("span");
          wrapper.style.color = hex;
          wrapper.appendChild(node.cloneNode(true));
          frag.appendChild(wrapper);
        }
      });

      range.deleteContents();
      range.insertNode(frag);
    }

    // Keep focus
    editorRef.current.focus();
  };

  /* ---------------- Remove Format ---------------- */
  const clearFormatting = () => {
    focus();
    document.execCommand("removeFormat");

    // Remove inline styles manually
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;

    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_ELEMENT,
      null,
      false,
    );

    while (walker.nextNode()) {
      const el = walker.currentNode;
      if (el.style) {
        el.removeAttribute("style");
      }
    }
  };

  return {
    bold,
    italic,
    underline,
    strike,
    unorderedList,
    orderedList,
    align,
    fontSize,
    fontFamily,
    color,
    clearFormatting,
  };
};
