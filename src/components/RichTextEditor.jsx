import React, {
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import {
  Table,
  Trash2,
  Plus,
  ImagePlus,
  Stars,
  Edit2,
  Pen,
} from "lucide-react";
import EditableTable from "./TextEditor/EditableTable";
import EditImage from "./TextEditor/EditImage";
import TextEditorBlock from "./TextEditor/TextEditorBlock";

/* -------------------------------- */
/* Add Block Button */
/* -------------------------------- */

const AddBlockButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="group w-full cursor-pointer border border-dashed 
    border-zinc-300 dark:border-zinc-700 
    rounded-xl py-8 flex flex-col items-center justify-center 
    gap-3 transition-all duration-300 
    hover:border-primary hover:bg-primary/5"
  >
    <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 
      shadow flex items-center justify-center 
      transition-all duration-300 group-hover:bg-primary group-hover:text-white"
    >
      {icon}
    </div>

    <span className="text-sm text-zinc-500 dark:text-zinc-400">
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

    /* Sync with parent */
    const updateState = (newBlocks) => {
      setBlocks(newBlocks);
      setParentBlocks?.(newBlocks);
    };

    useImperativeHandle(ref, () => ({
      getBlocks: () => blocks,
      setBlocks: (newBlocks) => updateState(newBlocks),
    }));

    /* Add Block */
    const addBlock = (type) => {
      const newBlock = { id: Date.now(), type, content: null };

      if (type === "text")
        newBlock.content = { html: "", isEditing: true };

      if (type === "image")
        newBlock.content = { url: "", isEditing: true };

      if (type === "table")
        newBlock.content = {
          headers: ["Column 1", "Column 2"],
          rows: [
            ["", ""],
            ["", ""],
          ],
          isEditing: true,
        };

      const updated = [...blocks, newBlock];
      updateState(updated);
    };

    /* Update Block */
    const updateBlock = (id, content) => {
      const updated = blocks.map((b) =>
        b.id === id ? { ...b, content } : b
      );
      updateState(updated);
    };

    /* Delete Block */
    const deleteBlock = (id) => {
      const updated = blocks.filter((b) => b.id !== id);
      updateState(updated);
    };

    return (
      <div className="w-full">
        <div className="max-w-7xl mx-auto space-y-8 px-4 pb-20">

          {/* Blocks */}
          {blocks.map((block) => (
            <div key={block.id} className="relative group">

              {/* TEXT BLOCK */}
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
                    <div className="relative cursor-text">
                      <div
                        className="prose dark:prose-invert max-w-none py-2"
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

                      {/* Hover Controls */}
                      <div className="absolute -right-12 top-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() =>
                            updateBlock(block.id, {
                              ...block.content,
                              isEditing: true,
                            })
                          }
                          className="p-1.5 bg-white dark:bg-zinc-900 rounded-lg shadow hover:bg-sky-50 dark:hover:bg-zinc-800"
                        >
                          <Pen size={15} />
                        </button>

                        <button
                          onClick={() => deleteBlock(block.id)}
                          className="p-1.5 bg-white dark:bg-zinc-900 rounded-lg shadow hover:bg-red-50 dark:hover:bg-zinc-800 text-red-500"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* IMAGE BLOCK */}
              {block.type === "image" && (
                <>
                  {block.content?.isEditing ? (
                    <EditImage
                      initialUrl={block.content.url || ""}
                      onDone={(url) =>
                        updateBlock(block.id, { url, isEditing: false })
                      }
                      onCancel={() =>
                        updateBlock(block.id, {
                          ...block.content,
                          isEditing: false,
                        })
                      }
                    />
                  ) : (
                    <div className="relative">
                      {block.content?.url ? (
                        <>
                          <img
                            src={block.content.url}
                            alt=""
                            className="w-full rounded-xl border dark:border-zinc-700"
                          />

                          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                            <button
                              onClick={() =>
                                updateBlock(block.id, {
                                  ...block.content,
                                  isEditing: true,
                                })
                              }
                              className="p-1.5 bg-white dark:bg-zinc-900 rounded-lg shadow"
                            >
                              <Edit2 size={15} />
                            </button>

                            <button
                              onClick={() => deleteBlock(block.id)}
                              className="p-1.5 bg-white dark:bg-zinc-900 rounded-lg shadow text-red-500"
                            >
                              <Trash2 size={15} />
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
                          className="cursor-pointer min-h-[160px] border-2 border-dashed 
                          dark:border-zinc-600 rounded-xl 
                          flex items-center justify-center text-zinc-400"
                        >
                          Click to add image
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* TABLE BLOCK */}
              {block.type === "table" && (
                <>
                  {block.content?.isEditing ? (
                    <EditableTable
                      initialData={block.content}
                      onDone={(data) =>
                        updateBlock(block.id, { ...data, isEditing: false })
                      }
                    />
                  ) : (
                    <div className="overflow-x-auto rounded-xl border dark:border-zinc-700">
                      <table className="w-full text-sm border-collapse">
                        <thead className="bg-zinc-100 dark:bg-zinc-800">
                          <tr>
                            {block.content.headers.map((h, i) => (
                              <th key={i} className="px-4 py-2 border-b dark:border-zinc-700">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {block.content.rows.map((row, i) => (
                            <tr key={i} className="border-b dark:border-zinc-700">
                              {row.map((cell, j) => (
                                <td key={j} className="px-4 py-2">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              {/* AI BLOCK */}
              {block.type === "ai" && (
                <div className="relative p-4 rounded-xl border border-dashed border-purple-500 text-center text-purple-500">
                  AI Generated Content
                  <button
                    onClick={() => deleteBlock(block.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white dark:bg-zinc-900 rounded-lg shadow text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
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
  }
);

export default RichTextEditor;
