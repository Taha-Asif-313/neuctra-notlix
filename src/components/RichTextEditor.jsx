import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Table,
  Trash2,
  Plus,
  ImagePlus,
  Stars,
  Edit2,
  Pen,
} from "lucide-react";
import TableEditorBlock from "./TextEditor/TableEditorBlock";
import TextEditorBlock from "./TextEditor/TextEditorBlock";
import ImageEditorBlock from "./TextEditor/ImageEditorBlock";

const divProseStyles = `
  prose dark:prose-invert max-w-full w-full py-2
  text-sm sm:text-base
  break-words overflow-hidden
  [&_*]:max-w-full [&_*]:break-words
  [&_*]:whitespace-normal [&_*]:overflow-hidden
  [&_img]:w-full [&_img]:h-auto
  [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto
`;

/* -------------------------------- */
/* Add Block Button */
/* -------------------------------- */
const AddBlockButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="group w-full cursor-pointer border border-dashed
      border-zinc-300 dark:border-zinc-700
      rounded-xl py-6 sm:py-8
      flex flex-col items-center justify-center
      gap-2 sm:gap-3
      transition-all duration-300
      hover:border-primary hover:bg-primary/5"
  >
    <div
      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full
        bg-white dark:bg-zinc-900
        shadow flex items-center justify-center
        transition-all duration-300
        group-hover:bg-primary group-hover:text-white"
    >
      {icon}
    </div>
    <span className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
      {label}
    </span>
  </button>
);

/* -------------------------------- */
/* Main Editor */
/* -------------------------------- */
const RichTextEditor = forwardRef(
  ({ blocks: initialBlocks = [], setBlocks: setParentBlocks }, ref) => {
    const [blocks, setBlocks] = useState(initialBlocks);

    const updateState = (newBlocks) => {
      setBlocks(newBlocks);
      setParentBlocks?.(newBlocks);
    };

    useImperativeHandle(ref, () => ({
      getBlocks: () => blocks,
      setBlocks: (newBlocks) => updateState(newBlocks),
    }));

    const addBlock = (type) => {
      const newBlock = { id: Date.now(), type, content: null };

      if (type === "text") newBlock.content = { html: "", isEditing: true };
      if (type === "image") newBlock.content = { url: "", isEditing: true };
      if (type === "imageText")
        newBlock.content = { url: "", html: "", isEditing: true };
      if (type === "table")
        newBlock.content = {
          headers: ["Column 1", "Column 2"],
          rows: [
            ["", ""],
            ["", ""],
          ],
          headerAlign: ["center", "center"],
          cellAlign: ["left", "left"],
          isEditing: true,
        };

      updateState([...blocks, newBlock]);
    };

    const updateBlock = (id, content) => {
      updateState(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
    };

    const deleteBlock = (id) => {
      updateState(blocks.filter((b) => b.id !== id));
    };

    return (
      <div className="w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-10 px-0 sm:px-6 pb-24">
          {/* Render Blocks */}
          {blocks.map((block) => (
            <div key={block.id} className="relative group">
              {/* ---------------- TEXT BLOCK ---------------- */}
              {block.type === "text" && (
                <>
                  {block.content?.isEditing ? (
                    <TextEditorBlock
                      initialValue={block.content.html || ""}
                      onDone={(html) =>
                        updateBlock(block.id, { html, isEditing: false })
                      }
                      onCancel={() =>
                        updateBlock(block.id, {
                          ...block.content,
                          isEditing: false,
                        })
                      }
                    />
                  ) : (
                    <div className="relative cursor-text rounded-xl">
                      <div
                        className={divProseStyles}
                        dangerouslySetInnerHTML={{
                          __html:
                            block.content.html ||
                            "<p class='text-gray-400'>Click to write something...</p>",
                        }}
                        onClick={() =>
                          updateBlock(block.id, {
                            ...block.content,
                            isEditing: true,
                          })
                        }
                      />
                      <div className="absolute top-2 right-2 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                        <button
                          onClick={() =>
                            updateBlock(block.id, {
                              ...block.content,
                              isEditing: true,
                            })
                          }
                          className="p-2 bg-white dark:bg-zinc-900 rounded-lg shadow hover:bg-sky-50 dark:hover:bg-zinc-800"
                        >
                          <Pen size={16} />
                        </button>

                        <button
                          onClick={() => deleteBlock(block.id)}
                          className="p-2 bg-white dark:bg-zinc-900 rounded-lg shadow hover:bg-red-50 dark:hover:bg-zinc-800 text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ---------------- IMAGE BLOCK ---------------- */}
              {block.type === "image" && (
                <>
                  {block.content?.isEditing ? (
                    <ImageEditorBlock
                      initialUrl={block.content.url || ""}
                      onDone={(url) =>
                        updateBlock(block.id, { url, isEditing: false })
                      }
                    />
                  ) : (
                    <div className="relative">
                      {block.content?.url ? (
                        <>
                          <img
                            src={block.content.url}
                            alt=""
                            className="w-full rounded-2xl border dark:border-zinc-700 object-cover"
                          />
                          <div className="absolute top-2 right-2 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                            <button
                              onClick={() =>
                                updateBlock(block.id, {
                                  ...block.content,
                                  isEditing: true,
                                })
                              }
                              className="p-2 bg-white dark:bg-zinc-900 rounded-lg shadow"
                            >
                              <Edit2 size={16} />
                            </button>

                            <button
                              onClick={() => deleteBlock(block.id)}
                              className="p-2 bg-white dark:bg-zinc-900 rounded-lg shadow text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div
                          onClick={() =>
                            updateBlock(block.id, {
                              url: "",
                              isEditing: true,
                            })
                          }
                          className="cursor-pointer min-h-[160px] sm:min-h-[220px]
                          border-2 border-dashed dark:border-zinc-600
                          rounded-xl flex items-center justify-center
                          text-zinc-400 text-sm"
                        >
                          Click to add image
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* ---------------- IMAGE + TEXT ---------------- */}
              {block.type === "imageText" && (
                <>
                  {block.content?.isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                      <ImageEditorBlock
                        initialUrl={block.content.url || ""}
                        onDone={(url) =>
                          updateBlock(block.id, { ...block.content, url })
                        }
                      />
                      <TextEditorBlock
                        initialValue={block.content.html || ""}
                        onDone={(html) =>
                          updateBlock(block.id, {
                            ...block.content,
                            html,
                            isEditing: false,
                          })
                        }
                      />
                    </div>
                  ) : (
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                      {block.content.url ? (
                        <img
                          src={block.content.url}
                          alt=""
                          className="w-full rounded-2xl shadow border dark:border-zinc-700"
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
                            block.content.html ||
                            "<p class='text-gray-400'>Add some content...</p>",
                        }}
                      />
                    </div>
                  )}
                </>
              )}

              {/* ---------------- TABLE BLOCK ---------------- */}
              {block.type === "table" && (
                <div className="relative">
                  {block.content?.isEditing ? (
                    <TableEditorBlock
                      initialData={block.content}
                      onDone={(data) =>
                        updateBlock(block.id, { ...data, isEditing: false })
                      }
                    />
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-zinc-300 dark:border-zinc-700">
                      <table className="w-full text-xs sm:text-sm border-collapse border border-zinc-300 dark:border-zinc-600">
                        <thead className="bg-zinc-100 dark:bg-zinc-800">
                          <tr>
                            {block.content.headers.map((h, i) => (
                              <th
                                key={i}
                                className="px-4 py-2 border border-zinc-300 dark:border-zinc-600"
                                style={{
                                  textAlign: block.content.headerAlign[i],
                                }}
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {block.content.rows.map((row, i) => (
                            <tr key={i}>
                              {row.map((cell, j) => (
                                <td
                                  key={j}
                                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-600"
                                  style={{
                                    textAlign: block.content.cellAlign[j],
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
                  {/* Table controls */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                    <button
                      onClick={() =>
                        updateBlock(block.id, {
                          ...block.content,
                          isEditing: true,
                        })
                      }
                      className="p-2 bg-white dark:bg-zinc-900 rounded-lg shadow"
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      onClick={() => deleteBlock(block.id)}
                      className="p-2 bg-white dark:bg-zinc-900 rounded-lg shadow text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* ---------------- Add Buttons ---------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 pt-8">
            <AddBlockButton
              icon={<Plus size={18} />}
              label="Text"
              onClick={() => addBlock("text")}
            />
            <AddBlockButton
              icon={<ImagePlus size={18} />}
              label="Image"
              onClick={() => addBlock("image")}
            />
            <AddBlockButton
              icon={<ImagePlus size={18} />}
              label="Image + Text"
              onClick={() => addBlock("imageText")}
            />
            <AddBlockButton
              icon={<Table size={18} />}
              label="Table"
              onClick={() => addBlock("table")}
            />
            <AddBlockButton
              icon={<Stars size={18} />}
              label="AI"
              onClick={() => addBlock("ai")}
            />
          </div>
        </div>
      </div>
    );
  },
);

export default RichTextEditor;
