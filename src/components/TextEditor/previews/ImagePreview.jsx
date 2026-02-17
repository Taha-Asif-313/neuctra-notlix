import React from "react";

const ImagePreview = ({ content }) => (
  <div className="rounded-2xl overflow-hidden border border-zinc-300 dark:border-zinc-700">
    {content?.url ? (
      <img
        src={content.url}
        alt=""
        className="w-full object-cover rounded-2xl"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src =
            "https://via.placeholder.com/600x300?text=Invalid+Image+URL";
        }}
      />
    ) : (
      <div className="min-h-[160px] sm:min-h-[220px] flex items-center justify-center text-zinc-400 text-sm">
        No Image
      </div>
    )}
  </div>
);

export default ImagePreview;
