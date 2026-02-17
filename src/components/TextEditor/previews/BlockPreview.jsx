import React from "react";

const BlocksPreview = ({ blocks }) => {
  const divProseStyles = `
    prose dark:prose-invert max-w-full w-full py-2
    text-sm sm:text-base
    break-words overflow-hidden
    [&_*]:max-w-full [&_*]:break-words
    [&_*]:whitespace-normal [&_*]:overflow-hidden
    [&_img]:w-full [&_img]:h-auto
    [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto
  `;

  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        const content = block.content || {};

        return (
          <div key={block.id} className="w-full">
            {/* ---------------- TEXT BLOCK ---------------- */}
            {block.type === "text" && (
              <div className={`p-1`}>
                <div
                  className={divProseStyles}
                  dangerouslySetInnerHTML={{
                    __html:
                      content.html || "<p class='text-gray-400'>No content</p>",
                  }}
                />
              </div>
            )}

            {/* ---------------- IMAGE BLOCK ---------------- */}
            {block.type === "image" && (
              <div className="rounded-2xl overflow-hidden border border-zinc-300 dark:border-zinc-700">
                {content.url ? (
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
            )}

            {/* ---------------- IMAGE + TEXT ---------------- */}
            {block.type === "imageText" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                {content.url ? (
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
                ) : (
                  <div className="min-h-[200px] border-2 border-dashed rounded-2xl flex items-center justify-center text-zinc-400">
                    No Image
                  </div>
                )}
                <div
                  className={divProseStyles}
                  dangerouslySetInnerHTML={{
                    __html:
                      content.html || "<p class='text-gray-400'>No content</p>",
                  }}
                />
              </div>
            )}

            {/* ---------------- TABLE BLOCK ---------------- */}
            {block.type === "table" && (
              <div className="overflow-x-auto rounded-xl border border-zinc-300 dark:border-zinc-700">
                <table className="w-full text-xs sm:text-sm border-collapse border border-zinc-300 dark:border-zinc-600">
                  <thead className="bg-zinc-100 dark:bg-zinc-800">
                    <tr>
                      {(content.headers || []).map((h, i) => (
                        <th
                          key={i}
                          className="px-4 py-2 border border-zinc-300 dark:border-zinc-600"
                          style={{
                            textAlign: (content.headerAlign || [])[i] || "left",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(content.rows || []).map((row, i) => (
                      <tr key={i}>
                        {(row || []).map((cell, j) => (
                          <td
                            key={j}
                            className="px-4 py-2 border border-zinc-300 dark:border-zinc-600"
                            style={{
                              textAlign: (content.cellAlign || [])[j] || "left",
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BlocksPreview;
