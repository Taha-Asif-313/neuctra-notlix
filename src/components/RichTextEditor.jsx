import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Table,
  Trash2,
  Plus,
  ImagePlus,
  Stars,
  Edit2,
  Pen,
  Columns,
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
    className="group w-full border border-dashed 
    border-zinc-300 dark:border-zinc-700 
    rounded-xl py-8 flex flex-col items-center justify-center 
    gap-3 transition-all duration-300 
    hover:border-primary hover:bg-primary/5"
  >
    <div
      className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 
      shadow flex items-center justify-center 
      transition-all duration-300 group-hover:bg-primary group-hover:text-white"
    >
      {icon}
    </div>

    <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
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

    /* -------------------------------- */
    /* Add Block */
    /* -------------------------------- */

    const addBlock = (type) => {
      const id = Date.now();

      let newBlock = { id, type, content: null };

      if (type === "text")
        newBlock.content = { html: "", isEditing: true };

      if (type === "image")
        newBlock.content = { url: "", isEditing: true };

      if (type === "table")
        newBlock.content = {
          headers: ["Column 1", "Column 2"],
          rows: [["", ""], ["", ""]],
          isEditing: true,
        };

      /* 2 Columns */
      if (type === "columns-2") {
        newBlock.content = {
          columns: [
            { id: id + 1, blocks: [] },
            { id: id + 2, blocks: [] },
          ],
        };
      }

      /* 3 Columns */
      if (type === "columns-3") {
        newBlock.content = {
          columns: [
            { id: id + 1, blocks: [] },
            { id: id + 2, blocks: [] },
            { id: id + 3, blocks: [] },
          ],
        };
      }

      updateState([...blocks, newBlock]);
    };

    /* -------------------------------- */
    /* Update Block */
    /* -------------------------------- */

    const updateBlock = (id, content) => {
      updateState(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
    };

    const deleteBlock = (id) => {
      updateState(blocks.filter((b) => b.id !== id));
    };

    /* -------------------------------- */
    /* Nested Column Helpers */
    /* -------------------------------- */

    const addNestedBlock = (parentId, colIndex, type) => {
      const newNested = {
        id: Date.now(),
        type,
        content:
          type === "text"
            ? { html: "", isEditing: true }
            : type === "image"
            ? { url: "", isEditing: true }
            : {
                headers: ["Col 1", "Col 2"],
                rows: [["", ""], ["", ""]],
                isEditing: true,
              },
      };

      const updated = blocks.map((b) => {
        if (b.id !== parentId) return b;

        const newColumns = [...b.content.columns];
        newColumns[colIndex].blocks = [
          ...newColumns[colIndex].blocks,
          newNested,
        ];

        return { ...b, content: { columns: newColumns } };
      });

      updateState(updated);
    };

    const updateNestedBlock = (parentId, colIndex, nestedId, content) => {
      const updated = blocks.map((b) => {
        if (b.id !== parentId) return b;

        const newColumns = [...b.content.columns];

        newColumns[colIndex].blocks =
          newColumns[colIndex].blocks.map((nb) =>
            nb.id === nestedId ? { ...nb, content } : nb
          );

        return { ...b, content: { columns: newColumns } };
      });

      updateState(updated);
    };

    const deleteNestedBlock = (parentId, colIndex, nestedId) => {
      const updated = blocks.map((b) => {
        if (b.id !== parentId) return b;

        const newColumns = [...b.content.columns];
        newColumns[colIndex].blocks =
          newColumns[colIndex].blocks.filter(
            (nb) => nb.id !== nestedId
          );

        return { ...b, content: { columns: newColumns } };
      });

      updateState(updated);
    };

    /* -------------------------------- */
    /* Render */
    /* -------------------------------- */

    return (
      <div className="w-full">
        <div className="max-w-7xl mx-auto space-y-8 px-4 pb-20">

          {/* BLOCKS */}
          {blocks.map((block) => (
            <div key={block.id} className="relative group">

              {/* -------------------------------- */}
              {/* TEXT BLOCK */}
              {/* -------------------------------- */}

              {block.type === "text" && (
                block.content?.isEditing ? (
                  <TextEditorBlock
                    initialValue={block.content.html}
                    onDone={(html) =>
                      updateBlock(block.id, { html, isEditing: false })
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
                    <div
                      className="prose dark:prose-invert max-w-none py-2"
                      dangerouslySetInnerHTML={{
                        __html:
                          block.content.html ||
                          "<p class='text-gray-400'>Click to write...</p>",
                      }}
                    />

                    <button
                      onClick={() => deleteBlock(block.id)}
                      className="absolute -right-12 top-2 p-1.5 bg-white dark:bg-zinc-900 rounded-lg shadow text-red-500 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )
              )}

              {/* -------------------------------- */}
              {/* COLUMN BLOCKS */}
              {/* -------------------------------- */}

              {(block.type === "columns-2" ||
                block.type === "columns-3") && (
                <div className="relative border rounded-xl p-4 dark:border-zinc-700 group">

                  <div
                    className={`grid gap-4 ${
                      block.type === "columns-2"
                        ? "grid-cols-1 md:grid-cols-2"
                        : "grid-cols-1 md:grid-cols-3"
                    }`}
                  >
                    {block.content.columns.map((col, colIndex) => (
                      <div
                        key={col.id}
                        className="border rounded-lg p-3 dark:border-zinc-700"
                      >
                        {/* Nested Blocks */}
                        {col.blocks.map((nested) => (
                          <div key={nested.id} className="relative mb-4 group">

                            {nested.type === "text" && (
                              nested.content.isEditing ? (
                                <TextEditorBlock
                                  initialValue={nested.content.html}
                                  onDone={(html) =>
                                    updateNestedBlock(
                                      block.id,
                                      colIndex,
                                      nested.id,
                                      { html, isEditing: false }
                                    )
                                  }
                                />
                              ) : (
                                <div
                                  onClick={() =>
                                    updateNestedBlock(
                                      block.id,
                                      colIndex,
                                      nested.id,
                                      {
                                        ...nested.content,
                                        isEditing: true,
                                      }
                                    )
                                  }
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      nested.content.html ||
                                      "<p class='text-gray-400'>Click to write...</p>",
                                  }}
                                />
                              )
                            )}

                            <button
                              onClick={() =>
                                deleteNestedBlock(
                                  block.id,
                                  colIndex,
                                  nested.id
                                )
                              }
                              className="absolute -right-6 top-1 p-1 text-red-500 opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}

                        {/* Add Inside Column */}
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() =>
                              addNestedBlock(block.id, colIndex, "text")
                            }
                            className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded"
                          >
                            + Text
                          </button>
                          <button
                            onClick={() =>
                              addNestedBlock(block.id, colIndex, "image")
                            }
                            className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded"
                          >
                            + Image
                          </button>
                          <button
                            onClick={() =>
                              addNestedBlock(block.id, colIndex, "table")
                            }
                            className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded"
                          >
                            + Table
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delete Column Section */}
                  <button
                    onClick={() => deleteBlock(block.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white dark:bg-zinc-900 rounded-lg shadow text-red-500 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* -------------------------------- */}
          {/* ADD BUTTONS */}
          {/* -------------------------------- */}

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 pt-6">
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
              icon={<Columns size={18} />}
              label="2 Columns"
              onClick={() => addBlock("columns-2")}
            />
            <AddBlockButton
              icon={<Columns size={18} />}
              label="3 Columns"
              onClick={() => addBlock("columns-3")}
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