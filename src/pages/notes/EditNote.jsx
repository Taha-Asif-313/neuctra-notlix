import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Eye,
  Edit3,
  Sparkles,
  Clock,
  Download,
  Upload,
  FileText,
  MoreVertical,
  Trash2,
  X,
  Send,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RichTextEditor from "../../components/RichTextEditor";
import { CreateNoteAiAgent } from "../../agent/NoteMaker";
import { getPackage, getSingleNote, updateNote, updatePackageUsage } from "../../authix/authixinit";
import { useAppContext } from "../../context/useAppContext";
import Metadata from "../../MetaData";
import CustomLoader from "../../components/CustomLoader";
import toast from "react-hot-toast";

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef();
  const { user } = useAppContext();

  const quickPrompts = [
    "Meeting notes template",
    "Study summary outline",
    "Project ideas brainstorm",
    "Daily reflection template",
    "Shopping list organizer",
    "Recipe instructions",
  ];

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [mobileView, setMobileView] = useState(false);
  const [loadingNote, setLoadingNote] = useState(true);

  // ✅ Detect mobile view
  useEffect(() => {
    const checkMobile = () => setMobileView(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchNote = async () => {
      if (!user?.id) return;

      setLoadingNote(true);
      try {
        const response = await getSingleNote(user.id, id);
        console.log("Fetched note:", response);

        if (response.id) {
          const existing = response;
          setTitle(existing.title || "");
          setContent(existing.content || "");

          // ✅ Ensure editor updates after mount
          setTimeout(() => {
            editorRef.current?.setEditorContent(existing.content || "");
          }, 100);
        } else {
          console.warn("No note data found for this ID");
        }
      } catch (err) {
        console.error("Failed to load note:", err);
      } finally {
        setLoadingNote(false);
      }
    };
    fetchNote();
  }, [id, user]);

  // ✅ Word count watcher
  useEffect(() => {
    const words = (title + " " + content)
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
    setWordCount(words);
  }, [title, content]);

  // ✅ UPDATE EXISTING NOTE
  const handleUpdate = async () => {
    if (!user?.id) {
      alert("User not found. Please log in again.");
      return;
    }

    try {
      setLoading(true);

      const updatedNote = {
        title: title.trim(),
        content,
        date: new Date().toISOString(),
        wordCount,
      };

      const response = await updateNote(user.id, id, updatedNote);
      console.log("Note updated:", response);

      setLastSaved(new Date());
      navigate("/notes");
    } catch (err) {
      console.error("Error updating note:", err);
      alert("Failed to update note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Export as HTML
  const exportNote = () => {
    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>
  body { font-family: system-ui, sans-serif; line-height: 1.6; padding: 20px; }
  h1 { font-size: 1.8em; }
  .meta { color: gray; font-size: 0.9em; margin-bottom: 1em; }
</style>
</head>
<body>
  <h1>${title}</h1>
  <div class="meta">Words: ${wordCount} | Exported: ${new Date().toLocaleDateString()}</div>
  <div>${content}</div>
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\W+/g, "_")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ✅ Export as plain text
  const exportAsText = () => {
    const plain = `# ${title}\n\n${content.replace(/<[^>]+>/g, "")}`;
    const blob = new Blob([plain], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\W+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ✅ Import note content
  const importContent = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".html,.txt,.md";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        let text = event.target.result;
        const ext = file.name.split(".").pop().toLowerCase();
        if (ext === "html") {
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, "text/html");
          text = doc.body.innerHTML;
        } else {
          text = text.replace(/\n/g, "<br>");
        }
        setContent(text);
        editorRef.current?.setEditorContent(text);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // ✅ Clear note content
  const clearContent = () => {
    if (window.confirm("Clear all content?")) {
      setContent("");
      editorRef.current?.setEditorContent("");
    }
  };

 const handleAIGenerate = async () => {
  if (!aiPrompt.trim()) {
    toast.error("Please enter a prompt first!");
    return;
  }

  try {
    setLoading(true);

    // 🔹 Fetch package info
    const pkg = await getPackage(user.id);
    if (!pkg) {
      toast.error("Failed to verify your package.");
      return;
    }

    const used = pkg?.usage?.aiPromptsUsed ?? 0;
    const limit = pkg?.aiPromptsPerMonth ?? 5;

    if (used >= limit) {
      toast.error(`AI prompt limit reached (${limit}/month). Upgrade to continue.`);
      return;
    }

    // 🧠 Generate AI Note
    const aiResponse = await generateNote(aiPrompt);
    console.log("✅ AI response received:", aiResponse);

    // 🔼 Update AI usage
    await updatePackageUsage(user.id, "ai", "increment");

    // 📝 Set AI content into editor
    setContent(aiResponse || "");
    editorRef.current?.setEditorContent(aiResponse || "");
    toast.success("AI note generated successfully!");
  } catch (err) {
    console.error("❌ AI generation failed:", err);
    toast.error("Failed to generate note. Please try again.");
  } finally {
    setLoading(false);
  }
};

  // 🔹 LOADING JSX
  if (loading)  return <CustomLoader message="Saving Note Please Wait" />

  // ✅ UI
  return (
    <>
      <Metadata
        title={
          title ? `${title} — Edit Note | NoteCraft` : "Edit Note | NoteCraft"
        }
        description={
          content
            ? `Continue editing your note titled "${title}". Write, preview, and use AI tools to refine your content easily.`
            : "Edit or create a new note with AI assistance, export tools, and a rich text editor."
        }
        keywords="Edit Note, AI Writer, Note Editor, NoteCraft, Rich Text Editor, Markdown, Productivity"
        image="https://yourdomain.com/assets/og/edit-note-preview.png" // optional image
      />
      <div className="min-h-screen bg-white dark:bg-zinc-950 text-black dark:text-white transition-colors">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-gray-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-black backdrop-blur-md">
          <div className="max-w-6xl mx-auto grid grid-cols-3 items-center px-4 py-3">
            {/* 🔙 Back Button */}
            <div className="flex items-center">
              <Link
                to="/notes"
                className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                {!mobileView && <span className="font-medium">Back</span>}
              </Link>
            </div>

            {/* 📝 Title */}
            <div className="text-center">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
                Edit Note
              </h1>
            </div>

            {/* ⏰ Last Saved */}
            <div className="flex items-center justify-end gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              <Clock size={13} />
              <span className="truncate">
                {lastSaved.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Editor */}
        {loadingNote ? (
      <CustomLoader message="Loading Note Please Wait" />
        ) : (
          <>
            <main className="max-w-6xl mx-auto px-4 py-6">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title..."
                className="w-full text-2xl font-bold bg-transparent border-0 border-b border-gray-200/60 dark:border-white/60 outline-none mb-4"
              />

              {!isPreview ? (
                <RichTextEditor
                  ref={editorRef}
                  content={content}
                  setContent={setContent}
                  mobileOptimized={mobileView}
                  key={id || "new-note"}
                />
              ) : (
                <div
                  className="prose dark:prose-invert max-w-none border p-4 rounded-xl"
                  dangerouslySetInnerHTML={{
                    __html:
                      content ||
                      '<p class="text-gray-400 italic">Start writing or import content...</p>',
                  }}
                />
              )}
            </main>
          </>
        )}

        {/* Floating Toolbar */}
        <motion.div
          className="fixed bottom-6 inset-x-0 flex justify-center z-50"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between gap-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border border-gray-200/50 dark:border-zinc-700/50 shadow-lg rounded-full px-5 py-3">
            {[
              {
                icon: isPreview ? <Edit3 size={18} /> : <Eye size={18} />,
                onClick: () => setIsPreview(!isPreview),
                label: isPreview ? "Edit" : "Preview",
              },
              {
                icon: <Sparkles size={18} className="text-amber-500" />,
                onClick: () => setShowModal(true),
                label: "AI Assist",
              },
              {
                icon: <Save size={18} className="text-green-500" />,
                onClick: handleUpdate,
                label: "Save",
              },
              {
                icon: <Download size={18} className="text-blue-500" />,
                onClick: exportNote,
                label: "Export HTML",
              },
              {
                icon: <MoreVertical size={18} />,
                onClick: () => setMoreMenuOpen(!moreMenuOpen),
                label: "More",
              },
            ].map((item, i) => (
              <button
                key={i}
                onClick={item.onClick}
                className="relative group p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
              >
                {item.icon}
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs py-1 px-2 rounded-md whitespace-nowrap transition">
                  {item.label}
                </span>
              </button>
            ))}

            <AnimatePresence>
              {moreMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-16 right-0 bg-white dark:bg-zinc-800 border border-gray-200/60 dark:border-zinc-700/60 rounded-2xl shadow-2xl overflow-hidden"
                >
                  <button
                    onClick={exportAsText}
                    className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 w-full"
                  >
                    <FileText size={16} className="text-blue-500" />
                    Export TXT
                  </button>
                  <button
                    onClick={importContent}
                    className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 w-full"
                  >
                    <Upload size={16} className="text-amber-500" />
                    Import
                  </button>
                  <button
                    onClick={clearContent}
                    className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 text-red-500 w-full"
                  >
                    <Trash2 size={16} />
                    Clear
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* AI Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center lg:p-4">
              <div
                onClick={() => setShowModal(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <div className="relative w-full lg:max-w-2xl bg-white dark:bg-zinc-900 rounded-t-3xl lg:rounded-3xl border border-gray-200/80 dark:border-zinc-700/80 shadow-2xl flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-200/60 dark:border-zinc-700/60">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-amber-500" />
                    <div>
                      <h2 className="text-xl font-bold">AI Note Assistant</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Let AI help you write better
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <textarea
                    rows={4}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="What would you like to write about?"
                    className="w-full p-4 rounded-xl border dark:border-zinc-600 bg-transparent resize-none outline-none"
                  />
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {quickPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => setAiPrompt(prompt)}
                        className="p-3 text-left rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-amber-100/60 dark:hover:bg-amber-500/10 transition"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/50">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-4 rounded-xl border text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAIGenerate}
                    disabled={loading || !aiPrompt.trim()}
                    className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-green-500 text-white font-semibold shadow hover:scale-105 transition disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={18} /> Generate
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default EditNote;
