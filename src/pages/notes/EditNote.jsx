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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RichTextEditor from "../../components/RichTextEditor";
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
import AIModal from "../../components/AiModal";

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef();
  const { user } = useAppContext();

  const { generateNote, aiResponses, loading: aiLoading } = useNoteAiAgent();

  const quickPrompts = [
    { key: "meeting_notes", value: "Create a professional meeting notes template with agenda, key points, decisions, and action items." },
    { key: "study_summary", value: "Generate a study summary outline with main topics, key concepts, and short explanations." },
    { key: "project_ideas", value: "Brainstorm a list of creative project ideas, including purpose, tools, and potential challenges." },
    { key: "daily_reflection", value: "Create a daily reflection note layout including gratitude, highlights, and lessons learned." },
    { key: "shopping_list", value: "Make a categorized shopping list with sections for groceries, cleaning, and essentials." },
    { key: "recipe_notes", value: "Generate a recipe note format with ingredients, step-by-step instructions, and cooking tips." },
    { key: "book_summary", value: "Write a book summary template with title, author, main idea, and favorite quotes." },
    { key: "goal_tracker", value: "Design a goal tracking note with short-term, long-term goals, and progress milestones." },
    { key: "workout_log", value: "Create a workout log with date, exercises, sets, reps, and performance notes." },
    { key: "habit_tracker", value: "Generate a daily habit tracker layout for consistency and motivation." },
    { key: "travel_plan", value: "Make a travel planning note including destinations, itinerary, budget, and must-see places." },
    { key: "content_ideas", value: "Brainstorm social media or blog content ideas with topics, captions, and hashtags." },
    { key: "project_plan", value: "Create a project planning note with objectives, timeline, deliverables, and status updates." },
    { key: "learning_journal", value: "Generate a learning journal layout to capture what was learned, challenges, and takeaways." },
    { key: "gratitude_journal", value: "Design a gratitude journal entry with sections for things you're thankful for and reflections." },
    { key: "bug_report", value: "Make a structured bug report template with issue details, reproduction steps, and status." },
    { key: "meeting_agenda", value: "Create a meeting agenda format with objectives, discussion points, and expected outcomes." },
    { key: "idea_brainstorm", value: "Generate an idea brainstorming sheet for creative projects and innovation sessions." },
    { key: "financial_tracker", value: "Design a financial tracker note with income, expenses, and savings breakdowns." },
    { key: "study_plan", value: "Create a study plan layout with topics, deadlines, and completion progress." },
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

  // ✅ Fetch note
  useEffect(() => {
    const fetchNote = async () => {
      if (!user?.id) return;
      setLoadingNote(true);
      try {
        const response = await getSingleNote(user.id, id);
        if (response.id) {
          setTitle(response.title || "");
          setContent(response.content || "");
          setTimeout(() => {
            if (editorRef.current?.setEditorContent)
              editorRef.current.setEditorContent(response.content || "");
          }, 100);
        }
      } catch (err) {
        console.error("Failed to load note:", err);
      } finally {
        setLoadingNote(false);
      }
    };
    fetchNote();
  }, [id, user]);

  // ✅ Word count
  useEffect(() => {
    const words = (title + " " + content)
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
    setWordCount(words);
  }, [title, content]);

  // ✅ Save note
  const handleUpdate = async () => {
    if (!user?.id) {
      toast.error("User not found. Please log in again.");
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
      await updateNote(user.id, id, updatedNote);
      setLastSaved(new Date());
      navigate("/notes");
    } catch (err) {
      console.error("Error updating note:", err);
      toast.error("Failed to update note.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Export HTML
  const exportNote = () => {
    const html = `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${title}</title></head>
<body>
  <h1>${title}</h1>
  <div>${content}</div>
</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\W+/g, "_")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ✅ Export TXT
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

  // ✅ Import file
  const importContent = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".html,.txt,.md";
    input.onchange = (e) => {
      const file = e.target.files && e.target.files[0];
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
        if (editorRef.current?.setEditorContent)
          editorRef.current.setEditorContent(text);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // ✅ Clear editor
  const clearContent = () => {
    if (window.confirm("Clear all content?")) {
      setContent("");
      if (editorRef.current?.setEditorContent)
        editorRef.current.setEditorContent("");
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
    setNoteLoading(true);

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


  if (loading) return <CustomLoader message="Saving Note..." />;

  return (
    <>
      <Metadata
        title={title ? `${title} — Edit Note | Notlix` : "Edit Note | Notlix"}
        description="Edit your note with AI support."
      />

      <div className="min-h-screen bg-white dark:bg-zinc-950 text-black dark:text-white">
        <header className="sticky top-0 z-40 border-b border-gray-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-black backdrop-blur-md">
          <div className="max-w-6xl mx-auto grid grid-cols-3 items-center px-4 py-3">
            <div className="flex items-center">
              <Link
                to="/notes"
                className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition"
              >
                <ArrowLeft className="w-4 h-4" />
                {!mobileView && <span>Back</span>}
              </Link>
            </div>

            <div className="text-center">
              <h1 className="text-lg font-semibold">Edit Note</h1>
            </div>

            <div className="flex items-center justify-end gap-1.5 text-xs text-gray-600 dark:text-gray-400">
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

        {loadingNote ? (
          <CustomLoader message="Loading Note..." />
        ) : (
          <main className="max-w-6xl mx-auto px-4 py-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="w-full text-2xl font-bold bg-transparent border-b border-gray-300 mb-4 outline-none"
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
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </main>
        )}

        {/* ✅ Floating Toolbar */}
        <motion.div
          className="fixed bottom-6 inset-x-0 flex justify-center z-50"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border rounded-full px-5 py-3">
            {[
              {
                icon: isPreview ? <Edit3 size={18} /> : <Eye size={18} />,
                onClick: () => setIsPreview(!isPreview),
              },
              {
                icon: <Sparkles size={18} className="text-amber-500" />,
                onClick: () => setShowModal(true),
              },
              {
                icon: <Save size={18} className="text-green-500" />,
                onClick: handleUpdate,
              },
              {
                icon: <Download size={18} className="text-blue-500" />,
                onClick: exportNote,
              },
              {
                icon: <MoreVertical size={18} />,
                onClick: () => setMoreMenuOpen(!moreMenuOpen),
              },
            ].map((item, i) => (
              <button
                key={i}
                onClick={item.onClick}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
              >
                {item.icon}
              </button>
            ))}

            <AnimatePresence>
              {moreMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-16 right-0 bg-white dark:bg-zinc-800 border rounded-2xl shadow-2xl overflow-hidden"
                >
                  <button
                    onClick={exportAsText}
                    className="flex items-center gap-2 px-4 py-3 text-sm w-full hover:bg-gray-100 dark:hover:bg-zinc-700"
                  >
                    <FileText size={16} className="text-blue-500" /> Export TXT
                  </button>
                  <button
                    onClick={importContent}
                    className="flex items-center gap-2 px-4 py-3 text-sm w-full hover:bg-gray-100 dark:hover:bg-zinc-700"
                  >
                    <Upload size={16} className="text-amber-500" /> Import
                  </button>
                  <button
                    onClick={clearContent}
                    className="flex items-center gap-2 px-4 py-3 text-sm w-full hover:bg-gray-100 dark:hover:bg-zinc-700 text-red-500"
                  >
                    <Trash2 size={16} /> Clear
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <AIModal
          show={showModal}
          onClose={() => setShowModal(false)}
          aiPrompt={aiPrompt}
          setAiPrompt={setAiPrompt}
          quickPrompts={quickPrompts}
          handleAIGenerate={handleAIGenerate}
          loading={aiLoading || loading}
        />
      </div>
    </>
  );
};

export default EditNote;
