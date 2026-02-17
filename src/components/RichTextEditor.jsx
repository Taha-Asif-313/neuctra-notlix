import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import {
  Table,
  Trash2,
  Plus,
  ImagePlus,
  Edit2,
  Pen,
  Stars,
  Send,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import TableEditorBlock from "./TextEditor/editors/TableEditorBlock";
import TextEditorBlock from "./TextEditor/editors/TextEditorBlock";
import ImageEditorBlock from "./TextEditor/editors/ImageEditorBlock";
import ImageTextEditorBlock from "./TextEditor/editors/ImageTextEditorBlock";
import ImagePreview from "./TextEditor/previews/ImagePreview";
import ImageTextPreview from "./TextEditor/previews/ImageTextPreview";
import TablePreview from "./TextEditor/previews/TablePreview";
import TextPreview from "./TextEditor/previews/TextPreview";

import { useNoteAiAgent } from "../hooks/useNoteAiAgent";
import { AnimatePresence, motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";

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
/* Main Editor with AI Support */
/* -------------------------------- */
const RichTextEditor = forwardRef(
  ({ blocks: initialBlocks = [], setBlocks: setParentBlocks }, ref) => {
    const {user} = useAppContext();
    const [blocks, setBlocks] = useState(initialBlocks);
    const [history, setHistory] = useState([]);
    const [future, setFuture] = useState([]);

    const [aiOpen, setAiOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");

    const { generateBlock, aiLoading, aiError } = useNoteAiAgent();

    const updateState = (newBlocks, saveToHistory = true) => {
      if (saveToHistory) {
        setHistory((prev) => [...prev, blocks]);
        setFuture([]); // clear redo stack on new action
      }

      setBlocks(newBlocks);
      setParentBlocks?.(newBlocks);
    };

    const undo = () => {
      if (history.length === 0) return;

      const previous = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setFuture((prev) => [blocks, ...prev]);

      updateState(previous, false);
    };

    const redo = () => {
      if (future.length === 0) return;

      const next = future[0];
      setFuture((prev) => prev.slice(1));
      setHistory((prev) => [...prev, blocks]);

      updateState(next, false);
    };

    useImperativeHandle(ref, () => ({
      getBlocks: () => blocks,
      setBlocks: (newBlocks) => updateState(newBlocks),
    }));

    useEffect(() => {
      const handleKeyDown = (e) => {
        const isCtrl = e.ctrlKey || e.metaKey;

        if (!isCtrl) return;

        if (e.key.toLowerCase() === "z") {
          e.preventDefault();
          undo();
        }

        if (e.key.toLowerCase() === "y") {
          e.preventDefault();
          redo();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [history, future, blocks]);

    /* ---------------- Add Block ---------------- */
    const addBlock = (type) => {
      const newBlock = { id: Date.now(), type, content: null };
      if (type === "text") newBlock.content = { html: "", isEditing: true };
      if (type === "image") newBlock.content = { url: "", isEditing: true };
      if (type === "imageText")
        newBlock.content = {
          url: "",
          html: "",
          isEditing: true,
          direction: "left",
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

    /* ---------------- AI Generate Blocks ---------------- */
    const addAiBlock = async (prompt) => {
      if (!prompt?.trim()) return;

      const aiBlock = await generateBlock(prompt);
      if (!aiBlock) return;

      const id = Date.now();

      let newBlock = {
        id,
        type: aiBlock.type,
        content: null,
      };

      switch (aiBlock.type) {
        case "text":
          newBlock.content = {
            html: aiBlock.content?.html || "<p></p>",
            isEditing: false,
          };
          break;

        case "image":
          newBlock.content = {
            url: "",
            isEditing: true, // let user insert image manually
          };
          break;

        case "imageText":
          newBlock.content = {
            url: "",
            html: aiBlock.content?.html || "<p></p>",
            direction: aiBlock.content?.direction || "left",
            isEditing: true,
          };
          break;

        case "table":
          newBlock.content = {
            headers: aiBlock.content?.headers || ["Column 1", "Column 2"],
            rows: aiBlock.content?.rows || [["", ""]],
            headerAlign: (aiBlock.content?.headers || []).map(() => "center"),
            cellAlign: (aiBlock.content?.headers || []).map(() => "left"),
            isEditing: false,
          };
          break;

        default:
          return;
      }

      updateState([...blocks, newBlock]);
    };

    return (
      <div className="w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-10 pb-24">
          {/* Render Blocks */}
          {blocks.map((block) => (
            <div key={block.id} className="relative group mb-6">
              {/* ---------------- TEXT ---------------- */}
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

              {/* ---------------- IMAGE ---------------- */}
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
                        updateBlock(block.id, {
                          url,
                          html,
                          direction,
                          isEditing: false,
                        })
                      }
                      onCancel={() =>
                        updateBlock(block.id, {
                          ...block.content,
                          isEditing: false,
                        })
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

              {/* ---------------- TABLE ---------------- */}
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

          {/* ================= AI GENIE ================= */}
          {user && (
            <div className="fixed bottom-6 right-6 z-50">
              {/* Floating Button with Framer Motion */}
              <AnimatePresence>
                {!aiOpen && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setAiOpen(true)}
                    className="w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center relative group"
                  >
                    <Stars className="w-6 h-6" />
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 0, x: 10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="absolute right-full mr-3 bg-gray-800 text-white text-sm py-1 px-3 rounded-lg whitespace-nowrap pointer-events-none"
                    >
                      AI Assistant
                    </motion.span>
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Chat Box with Framer Motion */}
              <AnimatePresence>
                {aiOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", duration: 0.3 }}
                    className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl border dark:border-zinc-700 overflow-hidden"
                  >
                    {/* Chat Header with Bubble Effect */}
                    <div className="relative">
                      {/* Chat Bubble Triangle */}
                      <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white dark:bg-zinc-900 border-r border-b dark:border-zinc-700 transform rotate-45" />

                      <div className="bg-primary p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                              <Stars className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white flex items-center gap-2">
                                AI Assistant
                                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                  Online
                                </span>
                              </h3>
                              <p className="text-xs text-white/80">
                                How can I help you?
                              </p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setAiOpen(false)}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Message Input Area */}
                      <div className="relative">
                        <textarea
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder="What block do you want? (e.g., 'Create a hero section with image')"
                          className="w-full h-24 resize-none px-4 py-3 rounded-xl border dark:bg-zinc-800 dark:border-zinc-600 text-black dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              if (aiPrompt.trim()) {
                                addAiBlock(aiPrompt);
                                setAiPrompt("");
                                setAiOpen(false);
                              }
                            }
                          }}
                        />

                        {/* Character Count */}
                        <div className="absolute bottom-2 right-3 text-xs text-zinc-400">
                          {aiPrompt.length}/200
                        </div>
                      </div>

                      {/* Quick Suggestions */}
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Write a hero heading with subtitle",
                          "Create a paragraph about our services",
                          "Generate a feature comparison table",
                          "Add an image with text on left side",
                          "Write a testimonial paragraph",
                        ].map((suggestion) => (
                          <motion.button
                            key={suggestion}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setAiPrompt(suggestion);
                            }}
                            className="text-xs px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-primary hover:text-white transition-colors"
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>

                      {aiError && (
                        <motion.p
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-red-500 text-sm flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {aiError}
                        </motion.p>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={async () => {
                          if (!aiPrompt.trim()) return;
                          await addAiBlock(aiPrompt);
                          setAiPrompt("");
                          setAiOpen(false);
                        }}
                        disabled={aiLoading || !aiPrompt.trim()}
                        className={`w-full py-3 rounded-xl bg-primary text-white font-medium flex items-center justify-center gap-2 transition-all ${
                          aiLoading || !aiPrompt.trim()
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:opacity-90"
                        }`}
                      >
                        {aiLoading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <Loader2 className="w-5 h-5" />
                            </motion.div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Generate Block
                          </>
                        )}
                      </motion.button>

                      {/* Footer Note */}
                      <p className="text-xs text-center text-zinc-400">
                        Press Enter to send • Shift + Enter for new line
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    );
  },
);

export default RichTextEditor;
