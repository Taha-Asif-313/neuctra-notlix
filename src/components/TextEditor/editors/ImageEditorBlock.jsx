import React, { useState } from "react";
import { Trash2, Check, X, Link } from "lucide-react";

const ImageEditorBlock = ({ initialUrl = "", onDone, onCancel }) => {
  const [url, setUrl] = useState(initialUrl);

  const handleSave = () => {
    if (!url) return;
    onDone && onDone(url);
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 sm:p-6 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md shrink-0">
          <Link className="w-4 h-4 text-zinc-500" />
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste image URL here..."
          className="w-full px-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
        />
      </div>

      {/* Image Preview + Inner Actions */}
      <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40">
        {url ? (
          <img
            src={url}
            alt="Preview"
            className="w-full max-h-[220px] sm:max-h-[300px] object-contain"
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

        {/* Inner Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={() => setUrl("")}
            className="p-2 bg-red-50 dark:bg-red-900/30 rounded shadow hover:bg-red-100 dark:hover:bg-red-900/50 transition"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={handleSave}
            disabled={!url}
            className="p-2 bg-primary text-white rounded shadow hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Save"
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => onCancel && onCancel()}
            className="p-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded shadow hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
            title="Cancel"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditorBlock;
