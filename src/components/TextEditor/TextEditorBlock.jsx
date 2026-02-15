import React, { useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

const TextEditorBlock = ({ value = "", onChange }) => {
  const editorRef = useRef(null);

  // Keep editor synced with external value
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const exec = (command) => {
    document.execCommand(command, false, null);
    editorRef.current?.focus();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const plainTextLength =
    editorRef.current?.innerText?.length || 0;

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex gap-2 flex-wrap p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md">
        <button
          onClick={() => exec("bold")}
          className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
        >
          <Bold size={16} />
        </button>

        <button
          onClick={() => exec("italic")}
          className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
        >
          <Italic size={16} />
        </button>

        <button
          onClick={() => exec("underline")}
          className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
        >
          <Underline size={16} />
        </button>

        <button
          onClick={() => exec("justifyLeft")}
          className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
        >
          <AlignLeft size={16} />
        </button>

        <button
          onClick={() => exec("justifyCenter")}
          className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
        >
          <AlignCenter size={16} />
        </button>

        <button
          onClick={() => exec("justifyRight")}
          className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
        >
          <AlignRight size={16} />
        </button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="w-full min-h-[140px] p-4 text-base bg-white dark:bg-zinc-800 border-2 border-dashed border-blue-400 dark:border-blue-500/50 rounded-lg focus:outline-none focus:border-solid focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-zinc-900 dark:text-zinc-100"
      />

      {/* Character Count */}
      <div className="flex justify-end text-xs text-zinc-500 dark:text-zinc-400">
        {plainTextLength} characters
      </div>
    </div>
  );
};

export default TextEditorBlock;
