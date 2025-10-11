import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Eye,
  Edit3,
  Sparkles,
  Clock,
  Type,
  Download,
  Upload,
  FileText,
  MoreVertical,
  Trash2,
  X,
  Send,
  Languages,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RichTextEditor from "../../components/RichTextEditor";
import { CreateNoteAiAgent } from "../../agent/NoteMaker";

const CreateNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [isTyping, setIsTyping] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [mobileView, setMobileView] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => setMobileView(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-save typing indicator
  useEffect(() => {
    if (title.trim() || content.trim()) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
        setLastSaved(new Date());
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [title, content]);

  // Word count
  useEffect(() => {
    const words = (title + " " + content)
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
    setWordCount(words);
  }, [title, content]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!title.trim()) {
      alert("Please enter a title before saving!");
      return;
    }

    const noteData = {
      id: id || Date.now().toString(),
      title: title.trim(),
      content,
      date: new Date().toISOString(),
      wordCount,
    };

    localStorage.setItem(`note_${noteData.id}`, JSON.stringify(noteData));
    setLastSaved(new Date());
    navigate("/notes");
  };

  // --- Export Note as HTML ---
  const exportNote = () => {
    const noteHTML = `
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
  <div class="meta">
    Words: ${wordCount} | Exported: ${new Date().toLocaleDateString()}
  </div>
  <div>${content}</div>
</body>
</html>`;
    const blob = new Blob([noteHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\W+/g, "_")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Export Note as Text ---
  const exportAsText = () => {
    const plainText = `# ${title}\n\n${content.replace(/<[^>]+>/g, "")}`;
    const blob = new Blob([plainText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\W+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Import File (HTML, TXT, MD) ---
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

  // --- Clear all content ---
  const clearContent = () => {
    if (window.confirm("Clear all content? This cannot be undone.")) {
      setContent("");
      editorRef.current?.setEditorContent("");
    }
  };

  // --- AI Generation ---
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setLoading(true);
    try {
      const aiResponse = await CreateNoteAiAgent(aiPrompt);
      if (aiResponse) {
        const newContent = content + aiResponse;
        setContent(newContent);
        editorRef.current?.setEditorContent(newContent);
      }
      setShowModal(false);
      setAiPrompt("");
    } catch (err) {
      console.error("AI generation failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto grid grid-cols-3 items-center px-4 py-4">
          <Link
            to="/notes"
            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            {!mobileView && <span>Back</span>}
          </Link>

          <div className="text-center">
            <h1 className="text-xl lg:text-2xl font-bold">
              {id ? "Edit Note" : "New Note"}
            </h1>
          </div>

          <div className="flex items-center justify-end gap-3 text-xs text-gray-600 dark:text-gray-400">
            <Type size={14} />
            <span>{wordCount} words</span>
            <Clock size={14} />
            <span>
              {lastSaved.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="w-full text-2xl font-bold bg-transparent border-0 border-b border-gray-200/60 dark:border-zinc-700/60 outline-none mb-4"
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

      {/* Bottom Actions */}
      <motion.div
        className="fixed bottom-6 inset-x-0 flex justify-center z-50"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div
          className="flex items-center justify-between gap-4
               bg-white/70 dark:bg-zinc-900/70 
               backdrop-blur-xl border border-gray-200/50 dark:border-zinc-700/50
               shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]
               rounded-full px-5 py-3 
               transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]"
          style={{ width: "fit-content" }}
        >
          {[
            {
              icon: isPreview ? <Edit3 size={18} /> : <Eye size={18} />,
              onClick: () => setIsPreview(!isPreview),
              label: isPreview ? "Edit mode" : "Preview",
            },
            {
              icon: <Sparkles size={18} className="text-amber-500" />,
              onClick: () => setShowModal(true),
              label: "AI Assist",
            },
            {
              icon: <Save size={18} className="text-green-500" />,
              onClick: handleSubmit,
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
              className="relative group p-2 rounded-full transition-all duration-200
                   hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              {item.icon}
              {/* Tooltip */}
              <span
                className="absolute -top-8 left-1/2 -translate-x-1/2 
                     opacity-0 group-hover:opacity-100
                     bg-gray-800 text-white text-xs py-1 px-2 rounded-md 
                     whitespace-nowrap pointer-events-none 
                     transition-opacity duration-200"
              >
                {item.label}
              </span>
            </button>
          ))}

          {/* More Menu */}
          <AnimatePresence>
            {moreMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-16 right-0 
                     bg-white dark:bg-zinc-800 
                     border border-gray-200/60 dark:border-zinc-700/60 
                     rounded-2xl shadow-2xl overflow-hidden"
              >
                <button
                  onClick={exportAsText}
                  className="flex items-center gap-2 px-4 py-3 text-sm
                       hover:bg-gray-100 dark:hover:bg-zinc-700 w-full"
                >
                  <FileText size={16} className="text-blue-500" />
                  Export TXT
                </button>
                <button
                  onClick={importContent}
                  className="flex items-center gap-2 px-4 py-3 text-sm
                       hover:bg-gray-100 dark:hover:bg-zinc-700 w-full"
                >
                  <Upload size={16} className="text-amber-500" />
                  Import File
                </button>
                <button
                  onClick={clearContent}
                  className="flex items-center gap-2 px-4 py-3 text-sm
                       hover:bg-gray-100 dark:hover:bg-zinc-700 text-red-500 w-full"
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
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl max-w-lg w-full relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4"
              >
                <X />
              </button>
              <h2 className="text-lg font-semibold mb-3">AI Note Assistant</h2>
              <textarea
                rows={4}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Write about..."
                className="w-full p-3 border rounded-xl bg-transparent"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={handleCloseModal} className="px-4 py-2">
                  Cancel
                </button>
                <button
                  onClick={handleAIGenerate}
                  disabled={loading || !aiPrompt.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-xl"
                >
                  {loading ? "Generating..." : "Generate"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateNote;
