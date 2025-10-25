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
import {
  getPackage,
  getSingleNote,
  updateNote,
  updatePackageUsage,
} from "../../authix/authixinit";
import { useAppContext } from "../../context/useAppContext";
import Metadata from "../../MetaData";
import CustomLoader from "../../components/CustomLoader";
import toast from "react-hot-toast";
import { useNoteAiAgent } from "../../hooks/useNoteAiAgent";

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef();
  const { user } = useAppContext();

  const quickPrompts = [
    {
      key: "meeting_notes",
      value:
        "Create a professional meeting notes template with agenda, key points, decisions, and action items.",
    },
    {
      key: "study_summary",
      value:
        "Generate a study summary outline with main topics, key concepts, and short explanations.",
    },
    {
      key: "project_ideas",
      value:
        "Brainstorm a list of creative project ideas, including purpose, tools, and potential challenges.",
    },
    {
      key: "daily_reflection",
      value:
        "Create a daily reflection note layout including gratitude, highlights, and lessons learned.",
    },
    {
      key: "shopping_list",
      value:
        "Make a categorized shopping list with sections for groceries, cleaning, and essentials.",
    },
    {
      key: "recipe_notes",
      value:
        "Generate a recipe note format with ingredients, step-by-step instructions, and cooking tips.",
    },
    {
      key: "book_summary",
      value:
        "Write a book summary template with title, author, main idea, and favorite quotes.",
    },
    {
      key: "goal_tracker",
      value:
        "Design a goal tracking note with short-term, long-term goals, and progress milestones.",
    },
    {
      key: "workout_log",
      value:
        "Create a workout log with date, exercises, sets, reps, and performance notes.",
    },
    {
      key: "habit_tracker",
      value:
        "Generate a daily habit tracker layout for consistency and motivation.",
    },
    {
      key: "travel_plan",
      value:
        "Make a travel planning note including destinations, itinerary, budget, and must-see places.",
    },
    {
      key: "content_ideas",
      value:
        "Brainstorm social media or blog content ideas with topics, captions, and hashtags.",
    },
    {
      key: "project_plan",
      value:
        "Create a project planning note with objectives, timeline, deliverables, and status updates.",
    },
    {
      key: "learning_journal",
      value:
        "Generate a learning journal layout to capture what was learned, challenges, and takeaways.",
    },
    {
      key: "gratitude_journal",
      value:
        "Design a gratitude journal entry with sections for things you're thankful for and reflections.",
    },
    {
      key: "bug_report",
      value:
        "Make a structured bug report template with issue details, reproduction steps, and status.",
    },
    {
      key: "meeting_agenda",
      value:
        "Create a meeting agenda format with objectives, discussion points, and expected outcomes.",
    },
    {
      key: "idea_brainstorm",
      value:
        "Generate an idea brainstorming sheet for creative projects and innovation sessions.",
    },
    {
      key: "financial_tracker",
      value:
        "Design a financial tracker note with income, expenses, and savings breakdowns.",
    },
    {
      key: "study_plan",
      value:
        "Create a study plan layout with topics, deadlines, and completion progress.",
    },
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

  const { generateNote, aiLoading, aiError } = useNoteAiAgent();

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
        toast.error(
          `AI prompt limit reached (${limit}/month). Upgrade to continue.`
        );
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
      setShowModal(false);
    } catch (err) {
      console.error("❌ AI generation failed:", err);
      toast.error("Failed to generate note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 LOADING JSX
  if (loading) return <CustomLoader message="Saving Note Please Wait" />;

  // ✅ UI
  return (
    <>
      {/* 🧠 Metadata for SEO & Social */}
      <Metadata
        title={
          title
            ? `${title} — Edit Note | Neuctra Notlix`
            : "Edit Note | Neuctra Notlix"
        }
        description={
          content
            ? `Continue editing your note titled "${title}" with Neuctra Notlix — use AI tools to refine, organize, and perfect your content effortlessly in the cloud.`
            : "Edit or create a new note in Neuctra Notlix with AI-powered writing, real-time collaboration, and advanced formatting tools."
        }
        keywords="Edit note, Neuctra Notlix editor, AI note writing, cloud note app, smart notes, markdown editor, productivity tool, collaborative editing"
        image="https://yourdomain.com/assets/og/edit-note-preview.png"
        ogTitle={
          title
            ? `${title} — Edit Note | Neuctra Notlix`
            : "Edit Note | Neuctra Notlix"
        }
        ogDescription={
          content
            ? `Continue editing "${title}" with Neuctra Notlix’s AI-powered editor — refine and organize your notes seamlessly.`
            : "Edit or create notes using Neuctra Notlix — the AI-powered cloud editor for smart, collaborative writing."
        }
        twitterTitle={
          title
            ? `${title} — Edit Note | Neuctra Notlix`
            : "Edit Note | Neuctra Notlix"
        }
        twitterDescription={
          content
            ? `Keep improving your note "${title}" with AI and smart formatting in Neuctra Notlix.`
            : "Create or edit notes in Neuctra Notlix — the AI-powered workspace for writing and collaboration."
        }
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex flex-col justify-end"
            >
              {/* Background overlay */}
              <div
                onClick={() => setShowModal(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />

              {/* Drawer */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 100, damping: 22 }}
                className="relative w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border-t border-gray-200/50 dark:border-zinc-700/50 shadow-2xl rounded-t-3xl flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/60 dark:border-zinc-700/60">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-green-500 shadow-md">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        AI Note Assistant
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Generate ideas, summaries, or outlines instantly.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Prompt Input */}
                <div className="p-6 flex-1 max-h-80 overflow-y-auto">
                  <textarea
                    rows={4}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ask AI to write meeting notes, summaries, ideas..."
                    className="w-full p-4 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/70 outline-none resize-none text-sm sm:text-base focus:ring-2 focus:ring-amber-500 transition"
                  />

                  {/* Quick Prompts */}
                  <div className="mt-6">
                    <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                      Quick Prompts
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {quickPrompts.map((prompt) => (
                        <button
                          key={prompt.key}
                          onClick={() => setAiPrompt(prompt.value)}
                          className="p-3 text-left text-sm rounded-xl bg-gray-100/70 dark:bg-zinc-800/70 hover:bg-amber-100/60 dark:hover:bg-amber-500/10 transition border border-transparent hover:border-amber-300 dark:hover:border-amber-500"
                        >
                          {prompt.key
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 border-t border-gray-200 dark:border-zinc-700 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-6 py-4 rounded-xl border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAIGenerate}
                      disabled={loading || !aiPrompt.trim()}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-5 h-5" /> Generate with AI
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default EditNote;
