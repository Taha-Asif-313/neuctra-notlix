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
    const range = selection.rangeCount ? selection.getRangeAt(0) : null;

    if (range && !range.collapsed) {
      // Wrap selection in span with color
      const span = document.createElement("span");
      span.style.color = hex;

      try {
        range.surroundContents(span);
      } catch (e) {
        // fallback for complex selections
        const fragment = range.extractContents();
        span.appendChild(fragment);
        range.insertNode(span);
      }

      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // No selection: insert a span with zero-width char for typing
      const span = document.createElement("span");
      span.style.color = hex;
      span.appendChild(document.createTextNode("\u200B")); // zero-width space

      if (editorRef.current) {
        const sel = window.getSelection();
        const range = sel.rangeCount ? sel.getRangeAt(0) : null;
        if (range) {
          range.insertNode(span);
          sel.removeAllRanges();
          sel.collapse(span, 1); // cursor inside the span
        } else {
          editorRef.current.appendChild(span);
          const newRange = document.createRange();
          newRange.setStart(span, 1);
          newRange.collapse(true);
          sel.removeAllRanges();
          sel.addRange(newRange);
        }
      }
    }

    focus();
  };

  /* ---------------- Remove Format ---------------- */
  const clearFormatting = () => exec("removeFormat");

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
