import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
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

const AddBlockButton = ({ icon, label, onClick }) => (
  <div className="w-full max-w-6xl mx-auto flex items-center justify-center">
    <div
      onClick={onClick}
      className="group w-full cursor-pointer border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl h-36 flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:border-primary hover:bg-primary/5"
    >
      <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-900 shadow-lg flex items-center justify-center transition-all duration-300 group-hover:bg-primary">
        {icon}
      </div>
      <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        {label}
      </div>
    </div>
  </div>
);

const RichTextEditor = forwardRef(
  ({ blocks: initialBlocks = [], setBlocks: setParentBlocks }, ref) => {
    const [blocks, setBlocks] = useState(initialBlocks);

    useImperativeHandle(ref, () => ({
      getBlocks: () => blocks,
      setBlocks: (newBlocks) => setBlocks(newBlocks),
    }));

    const addBlock = (index, type) => {
      const newBlock = { id: Date.now(), type, content: null };
      if (type === "text") newBlock.content = { html: "", isEditing: true };
      if (type === "image") newBlock.content = { url: "", isEditing: true };
      if (type === "table")
        newBlock.content = {
          headers: ["Col 1", "Col 2"],
          rows: [
            ["", ""],
            ["", ""],
          ],
          isEditing: true,
        };
      setBlocks((prev) => {
        const copy = [...prev];
        copy.splice(index + 1, 0, newBlock);
        setParentBlocks?.(copy);
        return copy;
      });
    };

    const updateBlock = (id, content) => {
      setBlocks((prev) => {
        const updated = prev.map((b) => (b.id === id ? { ...b, content } : b));
        setParentBlocks?.(updated);
        return updated;
      });
    };

    const deleteBlock = (id) => {
      setBlocks((prev) => prev.filter((b) => b.id !== id));
    };

    return (
      <div className="w-full h-full overflow-hidden">
        <div className="">
          <div className="space-y-6">
            {blocks.map((block, index) => (
              <div key={block.id} className="relative group">
                {/* Text */}
                {block.type === "text" && (
                  <div className="relative">
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
                      <div className="relative group cursor-text">
                        <div
                          className="prose p-4 dark:prose-invert max-w-none"
                          dangerouslySetInnerHTML={{
                            __html:
                              block.content.html ||
                              "<p class='text-gray-400'>Click to edit text...</p>",
                          }}
                          onClick={() =>
                            updateBlock(block.id, {
                              ...block.content,
                              isEditing: true,
                            })
                          }
                        />
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() =>
                              updateBlock(block.id, {
                                ...block.content,
                                isEditing: true,
                              })
                            }
                            className="p-1 text-sky-600 hover:text-sky-700 rounded-full bg-white dark:bg-zinc-900 shadow transition"
                          >
                            <Pen size={16} />
                          </button>
                          <button
                            onClick={() => deleteBlock(block.id)}
                            className="p-1 text-red-600 hover:text-red-700 rounded-full bg-white dark:bg-zinc-900 shadow transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Image */}
                {block.type === "image" && (
                  <div className="relative">
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
                      <div className="relative group">
                        {block.content?.url ? (
                          <>
                            <img
                              src={block.content.url}
                              alt="User"
                              className="w-full max-h-[300px] object-contain rounded-lg border dark:border-zinc-700"
                            />
                            <div className="absolute top-2 right-2 flex gap-2">
                              <button
                                onClick={() =>
                                  updateBlock(block.id, {
                                    ...block.content,
                                    isEditing: true,
                                  })
                                }
                                className="p-1 text-sky-600 hover:text-sky-700 rounded-full bg-white dark:bg-zinc-900 shadow transition"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => deleteBlock(block.id)}
                                className="p-1 text-red-600 hover:text-red-700 rounded-full bg-white dark:bg-zinc-900 shadow transition"
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
                            className="cursor-pointer min-h-[180px] border-2 border-dashed dark:border-zinc-600 rounded-lg flex flex-col items-center justify-center gap-3 bg-zinc-50 dark:bg-zinc-800/50"
                          >
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              Click to add image
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Table */}
                {block.type === "table" && (
                  <div className="relative">
                    {block.content?.isEditing ? (
                      <EditableTable
                        initialData={block.content}
                        onDone={(data) =>
                          updateBlock(block.id, { ...data, isEditing: false })
                        }
                      />
                    ) : (
                      <div className="relative overflow-x-auto rounded-lg border dark:border-zinc-700 shadow-sm bg-white dark:bg-zinc-900">
                        <table className="w-full text-sm text-left text-zinc-700 dark:text-zinc-200 border-collapse">
                          <thead className="bg-zinc-100 dark:bg-zinc-800">
                            <tr>
                              {block.content.headers.map((h, i) => (
                                <th
                                  key={i}
                                  className="px-4 py-2 border-b dark:border-zinc-600"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {block.content.rows.map((row, i) => (
                              <tr
                                key={i}
                                className={`hover:bg-emerald-50 dark:hover:bg-emerald-900/20 ${i % 2 === 0 ? "" : "bg-zinc-50 dark:bg-zinc-800/50"}`}
                              >
                                {row.map((cell, j) => (
                                  <td
                                    key={j}
                                    className="px-4 py-2 border-b dark:border-zinc-700"
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
                )}

                {/* AI */}
                {block.type === "ai" && (
                  <div className="min-h-[80px] p-4 rounded-lg border-2 border-dashed border-purple-500 flex items-center justify-center text-gray-500">
                    AI Generated Content
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => deleteBlock(block.id)}
                        className="p-1 text-red-600 hover:text-red-700 rounded-full bg-white dark:bg-zinc-900 shadow transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add Block Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-0">
              <AddBlockButton
                icon={<Plus size={20} />}
                label="Add Text"
                onClick={() => addBlock(blocks.length - 1, "text")}
              />
              <AddBlockButton
                icon={<ImagePlus size={20} />}
                label="Add Image"
                onClick={() => addBlock(blocks.length - 1, "image")}
              />
              <AddBlockButton
                icon={<Table size={20} />}
                label="Add Table"
                onClick={() => addBlock(blocks.length - 1, "table")}
              />
              <AddBlockButton
                icon={<Stars size={20} />}
                label="Add AI Content"
                onClick={() => addBlock(blocks.length - 1, "ai")}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default RichTextEditor;
