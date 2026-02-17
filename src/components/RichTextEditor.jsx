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
import TableEditorBlock from "./TextEditor/editors/TableEditorBlock";
import TextEditorBlock from "./TextEditor/editors/TextEditorBlock";
import ImageEditorBlock from "./TextEditor/editors/ImageEditorBlock";
import ImagePreview from "./TextEditor/previews/ImagePreview";
import ImageTextPreview from "./TextEditor/previews/ImageTextPreview";
import TablePreview from "./TextEditor/previews/TablePreview";
import TextPreview from "./TextEditor/previews/TextPreview";
import ImageTextEditorBlock from "./TextEditor/editors/ImageTextEditorBlock";

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
        newBlock.content = {
          url: "",
          html: "",
          isEditing: true,
          direction: "left", // default: image left, text right
        };

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
            <div key={block.id} className="relative group mb-6">
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
                    <div
                      className="relative cursor-text"
                      onClick={() =>
                        updateBlock(block.id, {
                          ...block.content,
                          isEditing: true,
                        })
                      }
                    >
                      <TextPreview content={block.content} />
                      <div className="absolute top-2 right-2 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateBlock(block.id, {
                              ...block.content,
                              isEditing: true,
                            });
                          }}
                          className="p-2 bg-white dark:bg-zinc-900 rounded-lg shadow hover:bg-sky-50 dark:hover:bg-zinc-800"
                        >
                          <Pen size={16} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteBlock(block.id);
                          }}
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
                          <ImagePreview content={block.content} />
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
                            updateBlock(block.id, { url: "", isEditing: true })
                          }
                          className="cursor-pointer min-h-[160px] sm:min-h-[220px] border-2 border-dashed dark:border-zinc-600 rounded-xl flex items-center justify-center text-zinc-400 text-sm"
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
  <div className="relative group">
    {block.content?.isEditing ? (
      <ImageTextEditorBlock
        initialUrl={block.content.url || ""}
        initialHtml={block.content.html || ""}
        initialDirection={block.content.direction || "left"}
        onDone={({ url, html, direction }) =>
          updateBlock(block.id, { url, html, direction, isEditing: false })
        }
        onCancel={() =>
          updateBlock(block.id, { ...block.content, isEditing: false })
        }
      />
    ) : (
      <>
        <ImageTextPreview content={block.content} />
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
    )}
  </div>
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
                    <>
                      <TablePreview content={block.content} />
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
                  )}
                </div>
              )}
            </div>
          ))}

          {/* ---------------- Add Buttons ---------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-8">
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
          </div>
        </div>
      </div>
    );
  },
);

export default RichTextEditor;
