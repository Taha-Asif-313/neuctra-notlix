import React, { useState } from "react";
import { Trash2, Check, X } from "lucide-react";

const EditImage = ({ initialUrl = "", onDone, onCancel }) => {
  const [url, setUrl] = useState(initialUrl);

  return (
    <div className="space-y-3">
      {/* URL Input */}
      <div className="flex items-center gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter image URL..."
          className="flex-1 px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
        />
      </div>

      {/* Preview */}
      {url ? (
        <div className="relative group">
          <img
            src={url}
            alt="User uploaded"
            className="w-full h-auto max-h-[300px] object-contain rounded-lg border border-zinc-200 dark:border-zinc-700"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/400x200?text=Invalid+Image+URL";
            }}
          />
          <button
            onClick={() => setUrl("")}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            title="Remove image"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ) : (
        <div className="min-h-[180px] border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg flex flex-col items-center justify-center gap-3 bg-zinc-50 dark:bg-zinc-800/50">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No image selected</p>
        </div>
      )}

      {/* Done / Cancel Buttons */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => onCancel && onCancel()}
          className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
        >
          <X size={16} className="inline mr-1" /> Cancel
        </button>
        <button
          onClick={() => onDone && onDone(url)}
          className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          <Check size={16} className="inline mr-1" /> Done
        </button>
      </div>
    </div>
  );
};

export default EditImage;
