import React, { useState } from "react";
import { Trash2, Check, X } from "lucide-react";
import TextEditorBlock from "./TextEditorBlock";

const ImageTextEditorBlock = ({ initialUrl = "", initialHtml = "", initialDirection = "left", onDone, onCancel }) => {
  const [url, setUrl] = useState(initialUrl);
  const [html, setHtml] = useState(initialHtml);
  const [direction, setDirection] = useState(initialDirection);

  const handleSave = () => {
    if (!url && !html) return;
    onDone && onDone({ url, html, direction });
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 sm:p-6 space-y-4 shadow-sm">
  {/* Image URL & Direction */}
<div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full">
  {/* URL Input */}
  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 w-full">
    <label className="text-sm text-zinc-600 dark:text-zinc-300 min-w-[100px]">
      Image URL:
    </label>
    <input
      type="url"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      placeholder="Paste image URL here..."
      className="flex-1 px-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 w-full"
    />
  </div>

  {/* Direction Toggle */}
  <div className="flex items-center gap-2 mt-3 sm:mt-0">
    <span className="text-sm text-zinc-600 dark:text-zinc-300">Image Position:</span>
    <button
      onClick={() => setDirection("left")}
      className={`px-3 py-1 rounded shadow transition-colors ${
        direction === "left"
          ? "bg-primary text-white hover:bg-primary/90"
          : "bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600"
      }`}
    >
      Left
    </button>
    <button
      onClick={() => setDirection("right")}
      className={`px-3 py-1 rounded shadow transition-colors ${
        direction === "right"
          ? "bg-primary text-white hover:bg-primary/90"
          : "bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600"
      }`}
    >
      Right
    </button>
  </div>
</div>


      {/* Editor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
        {direction === "left" ? (
          <>
            <div className="flex justify-center items-center">
              {url ? (
                <img
                  src={url}
                  alt="Preview"
                  className="w-full rounded-2xl shadow border border-zinc-300 dark:border-zinc-700 object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://via.placeholder.com/600x300?text=Invalid+Image+URL";
                  }}
                />
              ) : (
                <div className="min-h-[200px] border-2 border-dashed rounded-2xl flex items-center justify-center text-zinc-400">
                  No Image
                </div>
              )}
            </div>
            <TextEditorBlock
              initialValue={html}
              onDone={(newHtml) => setHtml(newHtml)}
            />
          </>
        ) : (
          <>
            <TextEditorBlock
              initialValue={html}
              onDone={(newHtml) => setHtml(newHtml)}
            />
            <div className="flex justify-center items-center">
              {url ? (
                <img
                  src={url}
                  alt="Preview"
                  className="w-full rounded-2xl shadow border border-zinc-300 dark:border-zinc-700 object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://via.placeholder.com/600x300?text=Invalid+Image+URL";
                  }}
                />
              ) : (
                <div className="min-h-[200px] border-2 border-dashed rounded-2xl flex items-center justify-center text-zinc-400">
                  No Image
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary text-white rounded shadow hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!url && !html}
        >
          <Check size={16} />
        </button>
        <button
          onClick={() => onCancel && onCancel()}
          className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded shadow hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
        >
          <X size={16} />
        </button>
        <button
          onClick={() => setUrl("")}
          className="px-4 py-2 bg-red-50 dark:bg-red-900/30 rounded shadow hover:bg-red-100 dark:hover:bg-red-900/50 transition"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ImageTextEditorBlock;
