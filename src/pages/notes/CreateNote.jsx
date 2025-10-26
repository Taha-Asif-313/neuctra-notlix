import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import RichTextEditor from "../../components/RichTextEditor";
import AIModal from "../../components/AiModal";
import CustomLoader from "../../components/CustomLoader";
import Metadata from "../../MetaData";

import {
  createNote,
  getPackage,
  updatePackageUsage,
} from "../../authix/authixinit";
import { useAppContext } from "../../context/useAppContext";
import { useNoteAiAgent } from "../../hooks/useNoteAiAgent";

const CreateNote = () => {
  const navigate = useNavigate();
  const editorRef = useRef();
  const { user } = useAppContext();

  // -----------------------------
  // 🔹 Local States
  // -----------------------------
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [mobileView, setMobileView] = useState(false);

  // 🔹 AI Agent Hook
  const { generateNote, aiLoading } = useNoteAiAgent();

  // Quick Prompts
  const quickPrompts = [
    {
      key: "meeting_notes",
      value: "Create a professional meeting notes template...",
    },
    { key: "study_summary", value: "Generate a study summary outline..." },
    {
      key: "project_ideas",
      value: "Brainstorm a list of creative project ideas...",
    },
    {
      key: "daily_reflection",
      value: "Create a daily reflection note layout...",
    },
  ];

  // -----------------------------
  // 🔹 Effects
  // -----------------------------
  useEffect(() => {
    const checkMobile = () => setMobileView(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const words = (title + " " + content)
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
    setWordCount(words);
  }, [title, content]);

  // -----------------------------
  // ✏️ Save Note
  // -----------------------------
  const handleSaveNote = async (e) => {
    e?.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a title before saving!");
      return;
    }

    try {
      setNoteLoading(true);

      if (!user || !user.id) {
        toast.error("User not found. Please log in again.");
        navigate("/login");
        return;
      }

      if (!user.isVerified && !user.verified) {
        toast.error("Please verify your email before creating a note.");
        navigate("/notes/profile");
        return;
      }

      const pkg = await getPackage(user.id);
      if (!pkg) {
        toast.error("Failed to verify your package.");
        return;
      }

      const notesUsed = pkg?.usage?.notesUsed ?? 0;
      const notesLimit = parseInt(
        pkg?.features?.find((f) => f.includes("Up to"))?.match(/\d+/)?.[0] ||
          100
      );

      if (notesUsed >= notesLimit) {
        toast.error(`Note limit reached (${notesLimit}). Upgrade your plan.`);
        return;
      }

      const noteData = { title: title.trim(), content, wordCount };
      const response = await createNote(user.id, noteData);

      if (!response) throw new Error("Failed to save note.");

      await updatePackageUsage(user.id, "notes", "increment");
      setLastSaved(new Date());
      toast.success("Note saved successfully!");
      navigate("/notes");
    } catch (err) {
      console.error("❌ Save Note Error:", err);
      toast.error("Failed to save note. Please try again.");
    } finally {
      setNoteLoading(false);
    }
  };

  // -----------------------------
  // 🤖 Generate with AI (Daily Limit)
  // -----------------------------
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a prompt first!");
      return;
    }

    try {
      const pkg = await getPackage(user.id);
      if (!pkg) {
        toast.error("Failed to verify your package.");
        return;
      }

      // 🧠 Use daily prompt limit instead of monthly
      const used = pkg?.usage?.aiPromptsUsed ?? 0;
      const limit = pkg?.aiPromptsPerDay ?? 5;

      if (used >= limit) {
        toast.error(`AI prompt limit reached (${limit}/day).`);
        return;
      }

      // 🚀 Generate AI content
      const aiResult = await generateNote(aiPrompt);
      if (!aiResult) {
        toast.error("AI did not return a valid response.");
        return;
      }

      // 📊 Increment usage count
      await updatePackageUsage(user.id, "ai", "increment");

      // 📝 Update editor content
      setContent(aiResult);
      editorRef.current?.setEditorContent(aiResult);

      toast.success("AI note generated successfully!");
      setShowModal(false);
    } catch (err) {
      console.error("❌ AI Generation Error:", err);
      toast.error("AI failed to generate note.");
    } finally {
      setNoteLoading(false);
    }
  };

  // -----------------------------
  // 📤 Export / Import Helpers
  // -----------------------------
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

  const clearContent = () => {
    if (window.confirm("Clear all content?")) {
      setContent("");
      editorRef.current?.setEditorContent("");
    }
  };

  // -----------------------------
  // 🌀 Loading Screens
  // -----------------------------
  if (noteLoading)
    return <CustomLoader message="Saving your note, please wait..." />;
  if (aiLoading) return <CustomLoader message="Generating AI content..." />;

  // -----------------------------
  // 🧠 UI
  // -----------------------------
  return (
    <>
      <Metadata
        title="Create New Note – Neuctra Notlix"
        description="Create and organize your ideas effortlessly with Neuctra Notlix — the AI-powered note editor."
      />

      <div className="min-h-screen bg-white dark:bg-zinc-950 text-black dark:text-white">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-gray-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-black backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
            <Link
              to="/notes"
              className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-primary rounded-md transition"
            >
              <ArrowLeft className="w-4 h-4" />
              {!mobileView && <span className="font-medium">Back</span>}
            </Link>

            <h1 className="text-lg sm:text-xl font-semibold">New Note</h1>

            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <Clock size={13} />
              <span>
                {lastSaved.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Editor */}
        <main className="max-w-7xl mx-auto px-4 py-6">
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

        {/* Floating Toolbar */}
        <motion.div
          className="fixed bottom-6 inset-x-0 flex justify-center z-50"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
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
                onClick: handleSaveNote,
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
                  className="absolute bottom-16 right-0 bg-white dark:bg-zinc-800 border border-gray-200/60 dark:border-zinc-700/60 rounded-2xl shadow-2xl overflow-hidden"
                >
                  <button
                    onClick={exportAsText}
                    className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 w-full"
                  >
                    <FileText size={16} className="text-blue-500" /> Export TXT
                  </button>
                  <button
                    onClick={importContent}
                    className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 w-full"
                  >
                    <Upload size={16} className="text-amber-500" /> Import
                  </button>
                  <button
                    onClick={clearContent}
                    className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 text-red-500 w-full"
                  >
                    <Trash2 size={16} /> Clear
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* 🤖 AI Modal */}
        <AIModal
          show={showModal}
          onClose={() => setShowModal(false)}
          aiPrompt={aiPrompt}
          setAiPrompt={setAiPrompt}
          quickPrompts={quickPrompts}
          handleAIGenerate={handleAIGenerate}
          loading={aiLoading}
        />
      </div>
    </>
  );
};

export default CreateNote;
