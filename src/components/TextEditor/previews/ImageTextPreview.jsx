import React from "react";

const divProseStyles = `
  prose dark:prose-invert max-w-full w-full
  px-4 py-4
  text-[16px] leading-relaxed
  focus:outline-none

  break-words
  whitespace-normal
  overflow-x-hidden

  text-black dark:text-white

  [&_*]:max-w-full
  [&_*]:break-words
  [&_*]:whitespace-normal

  [&_img]:max-w-full
  [&_img]:h-auto

  [&_table]:block
  [&_table]:w-full
  [&_table]:overflow-x-auto

  [&_ul]:list-disc [&_ul]:pl-8
  [&_ol]:list-decimal [&_ol]:pl-8

  empty:before:content-[attr(data-placeholder)]
  empty:before:text-zinc-400
  
`;

const ImageTextPreview = ({ content }) => (
  <div
    className={`flex flex-col md:flex-row ${
      content?.direction === "right" ? "md:flex-row-reverse" : ""
    } gap-6 sm:gap-10`}
  >
    {/* Image */}
    {content?.url ? (
      <div className="flex-1 flex justify-center items-center">
        <img
          src={content.url}
          alt=""
          className="w-full rounded-2xl shadow border border-zinc-300 dark:border-zinc-700 object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://via.placeholder.com/600x300?text=Invalid+Image+URL";
          }}
        />
      </div>
    ) : (
      <div className="flex-1 min-h-[200px] border-2 border-dashed rounded-2xl flex items-center justify-center text-zinc-400">
        No Image
      </div>
    )}

    {/* Text */}
    <div
      className={`flex-1 ${divProseStyles}`}
      dangerouslySetInnerHTML={{
        __html: content?.html || "<p class='text-gray-400'>No content</p>",
      }}
    />
  </div>
);

export default ImageTextPreview;
