import React, { useState } from "react";
import { Trash2, Check, X, Link } from "lucide-react";

const ImageEditorBlock = ({ initialUrl = "", onDone, onCancel }) => {
  const [url, setUrl] = useState(initialUrl);

  const handleSave = () => {
    if (!url) return;
    onDone && onDone(url);
  };

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 space-y-4 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Image Settings
        </h3>

        {url && (
          <button
            onClick={() => setUrl("")}
            className="p-1.5 rounded-md bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition"
            title="Remove image"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* URL Input */}
      <div className="flex items-center gap-2">
        <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md">
          <Link size={16} className="text-zinc-500" />
        </div>

        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste image URL here..."
          className="flex-1 px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
        />
      </div>

      {/* Preview */}
      <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40">
        {url ? (
          <img
            src={url}
            alt="Preview"
            className="w-full max-h-[280px] object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/600x300?text=Invalid+Image+URL";
            }}
          />
        ) : (
          <div className="min-h-[180px] flex items-center justify-center text-sm text-zinc-400">
            Image preview will appear here
          </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={() => onCancel && onCancel()}
          className="px-4 py-2 text-sm rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition flex items-center gap-1"
        >
          <X size={16} /> Cancel
        </button>

        <button
          onClick={handleSave}
          disabled={!url}
          className="px-4 py-2 text-sm rounded-md bg-primary text-white hover:opacity-90 transition flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check size={16} /> Save
        </button>
      </div>
    </div>
  );
};

export default ImageEditorBlock;
