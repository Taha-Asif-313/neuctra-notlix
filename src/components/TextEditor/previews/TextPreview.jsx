import React from "react";

const divProseStyles = `
  prose dark:prose-invert max-w-full w-full py-2
  text-sm sm:text-base
  break-words overflow-hidden
  [&_*]:max-w-full [&_*]:break-words
  [&_*]:whitespace-normal [&_*]:overflow-hidden
  [&_img]:w-full [&_img]:h-auto
  [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto
`;

const TextPreview = ({ content }) => (
  <div className="p-4">
    <div
      className={divProseStyles}
      dangerouslySetInnerHTML={{
        __html: content?.html || "<p class='text-gray-400'>No content</p>",
      }}
    />
  </div>
);

export default TextPreview;
