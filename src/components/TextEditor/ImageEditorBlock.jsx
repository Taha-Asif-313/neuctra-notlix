import React, { useState } from "react";
import { Trash2, Check, X, Link } from "lucide-react";

const ImageEditorBlock = ({ initialUrl = "", onDone, onCancel }) => {
  const [url, setUrl] = useState(initialUrl);

  const handleSave = () => {
    if (!url) return;
    onDone && onDone(url);
  };

  return (
    <div
      className="
      w-full max-w-full
      rounded-2xl
      border border-zinc-200 dark:border-zinc-700
      bg-white dark:bg-zinc-900
      p-4 sm:p-6
      space-y-5
      shadow-sm
    "
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-medium text-zinc-700 dark:text-zinc-300">
          Image Settings
        </h3>

        {url && (
          <button
            onClick={() => setUrl("")}
            className="
            p-2 rounded-md
            bg-red-50 dark:bg-red-900/30
            text-red-500
            hover:bg-red-100 dark:hover:bg-red-900/50
            transition
          "
            title="Remove image"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
      </div>

      {/* URL Input */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md shrink-0">
            <Link className="w-4 h-4 text-zinc-500" />
          </div>

          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste image URL here..."
            className="
            w-full
            px-3 py-2.5
            text-sm
            bg-zinc-50 dark:bg-zinc-800
            border border-zinc-300 dark:border-zinc-600
            rounded-md
            focus:outline-none
            focus:ring-2 focus:ring-primary
            focus:border-transparent
            text-zinc-900 dark:text-zinc-100
            placeholder-zinc-400 dark:placeholder-zinc-500
          "
          />
        </div>
      </div>

      {/* Preview */}
      <div
        className="
        rounded-xl
        overflow-hidden
        border border-zinc-200 dark:border-zinc-700
        bg-zinc-50 dark:bg-zinc-800/40
      "
      >
        {url ? (
          <img
            src={url}
            alt="Preview"
            className="
            w-full
            max-h-[220px] sm:max-h-[300px]
            object-contain
          "
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://via.placeholder.com/600x300?text=Invalid+Image+URL";
            }}
          />
        ) : (
          <div className="min-h-[160px] sm:min-h-[200px] flex items-center justify-center text-sm text-zinc-400 px-4 text-center">
            Image preview will appear here
          </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div
        className="
        flex flex-col sm:flex-row
        gap-3
        sm:justify-end
        pt-2
      "
      >
        <button
          onClick={() => onCancel && onCancel()}
          className="
          w-full sm:w-auto
          px-4 py-2.5
          text-sm
          rounded-md
          bg-zinc-200 dark:bg-zinc-700
          text-zinc-900 dark:text-zinc-100
          hover:bg-zinc-300 dark:hover:bg-zinc-600
          transition
          flex items-center justify-center gap-2
        "
        >
          <X className="w-4 h-4" />
          Cancel
        </button>

        <button
          onClick={handleSave}
          disabled={!url}
          className="
          w-full sm:w-auto
          px-4 py-2.5
          text-sm
          rounded-md
          bg-primary text-white
          hover:opacity-90
          transition
          flex items-center justify-center gap-2
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
        >
          <Check className="w-4 h-4" />
          Save
        </button>
      </div>
    </div>
  );
};

export default ImageEditorBlock;
