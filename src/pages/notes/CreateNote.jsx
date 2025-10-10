import { useState, useEffect, useRef } from "react";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  X,
  Zap,
  Sparkles,
  Clock,
  Edit3,
  Type,
  Wand2,
  Send,
  MoreVertical,
  Download,
  Share,
  FileText,
  Upload,
  Trash2,
  Settings,
  Palette,
  Layout,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  Languages,
} from "lucide-react";
import RichTextEditor from "../../components/RichTextEditor";
import { CreateNoteAiAgent } from "../../agent/NoteMaker";

const CreateNote = () => {
  const { id } = useParams();
  const { notes, setNotes } = useOutletContext();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

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
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const existingNote = isEditing
    ? notes.find((note) => note.id.toString() === id)
    : null;

  // Auto-detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setMobileView(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setContent(existingNote.content);
      if (editorRef.current) {
        editorRef.current.setEditorContent(existingNote.content);
      }
    }
  }, [existingNote]);

  // Auto-save and word count
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

  useEffect(() => {
    const words = (title + " " + content)
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    setWordCount(words);
  }, [title, content]);

  useEffect(() => {
    if (showModal) setIsAnimating(true);
  }, [showModal]);

  const handleSubmit = (e) => {
    e?.preventDefault();

    if (!title.trim()) {
      const titleInput = document.querySelector('input[type="text"]');
      titleInput.classList.add("animate-pulse", "border-red-400");
      setTimeout(() => {
        titleInput.classList.remove("animate-pulse", "border-red-400");
      }, 1000);
      return;
    }

    const noteData = {
      id: isEditing ? id : Date.now().toString(),
      title: title.trim(),
      content,
      date: new Date().toISOString(),
      wordCount,
    };

    if (isEditing) {
      setNotes(
        notes.map((note) => (note.id.toString() === id ? noteData : note))
      );
    } else {
      setNotes([noteData, ...notes]);
    }

    setLastSaved(new Date());
    navigate("/notes");
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setLoading(true);

    try {
      const aiResponse = await CreateNoteAiAgent(aiPrompt);

      if (aiResponse) {
        setContent((prev) => prev + aiResponse);
        editorRef.current?.setEditorContent(content + aiResponse);
      }

      setShowModal(false);
      setAiPrompt("");
    } catch (err) {
      console.error("AI generation failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => setIsAnimating(false), 500); // sync with transition
  };

  // Export note as HTML
  const exportNote = () => {
    const noteHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <meta charset="UTF-8">
          <style>
            body { font-family: system-ui, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
            .note-title { font-size: 2em; font-weight: bold; margin-bottom: 1em; color: #1f2937; }
            .note-content { font-size: 16px; }
            .note-meta { color: #6b7280; font-size: 14px; margin-bottom: 2em; border-bottom: 1px solid #e5e7eb; padding-bottom: 1em; }
          </style>
        </head>
        <body>
          <div class="note-title">${title}</div>
          <div class="note-meta">
            Created: ${new Date().toLocaleDateString()} | 
            Words: ${wordCount} |
            Exported from Neuctra Notes
          </div>
          <div class="note-content">${content}</div>
        </body>
      </html>
    `;

    const blob = new Blob([noteHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_${
      new Date().toISOString().split("T")[0]
    }.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export as plain text
  const exportAsText = () => {
    const plainText = `# ${title}\n\n${content.replace(/<[^>]*>/g, "")}`;
    const blob = new Blob([plainText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import content from file
  const importContent = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".html,.txt,.md";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newContent = event.target.result;
          setContent(newContent);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Clear all content
  const clearContent = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all content? This action cannot be undone."
      )
    ) {
      const emptyContent = "<p><br></p>";
      setContent(emptyContent);
      if (editorRef.current) {
        editorRef.current.setEditorContent(emptyContent);
      }
    }
  };

  const quickPrompts = [
    "Meeting notes template",
    "Study summary outline",
    "Project ideas brainstorm",
    "Daily reflection template",
    "Shopping list organizer",
    "Recipe instructions",
  ];

  // Unified Bottom Navigation for both desktop and mobile
  const BottomNavigation = () => (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg border-t border-gray-200/60 dark:border-zinc-700/60 z-40 safe-area-bottom ${
        mobileView ? "lg:hidden" : "hidden lg:block"
      }`}
    >
      {/* Stats Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200/40 dark:border-zinc-700/40">
        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Type className="w-3 h-3" />
            <span>{wordCount} words</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>
              Saved{" "}
              {lastSaved.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {isTyping && (
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse ml-1"></div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div
            className={`w-2 h-2 rounded-full ${
              title.trim() ? "bg-green-500" : "bg-amber-500"
            }`}
          ></div>
          <span>{title.trim() ? "Ready" : "Need title"}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-around p-3">
        {/* Preview/Edit Toggle */}
        <button
          onClick={() => setIsPreview((prev) => !prev)}
          className="flex flex-col items-center p-3 rounded-2xl active:scale-95 transition-transform group"
        >
          {isPreview ? (
            <Edit3 className="w-6 h-6 text-primary mb-1 group-hover:scale-110 transition-transform" />
          ) : (
            <Eye className="w-6 h-6 text-gray-600 dark:text-gray-400 mb-1 group-hover:scale-110 transition-transform" />
          )}
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {isPreview ? "Edit" : "Preview"}
          </span>
        </button>

        {/* AI Assist */}
        <button
          onClick={() => setShowModal(true)}
          className="flex flex-col items-center p-3 rounded-2xl active:scale-95 transition-transform group"
        >
          <Sparkles className="w-6 h-6 text-amber-500 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            AI Assist
          </span>
        </button>

        {/* Save Note */}
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="flex flex-col items-center p-3 rounded-2xl active:scale-95 transition-transform disabled:opacity-30 group"
        >
          <Save className="w-6 h-6 text-green-500 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {isEditing ? "Update" : "Save"}
          </span>
        </button>

        {/* Export */}
        <button
          onClick={exportNote}
          disabled={!title.trim() && !content.trim()}
          className="flex flex-col items-center p-3 rounded-2xl active:scale-95 transition-transform disabled:opacity-30 group"
        >
          <Download className="w-6 h-6 text-blue-500 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Export
          </span>
        </button>

        {/* More Actions */}
        <div className="relative">
          <button
            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            className="flex flex-col items-center p-3 rounded-2xl active:scale-95 transition-transform group"
          >
            <MoreVertical className="w-6 h-6 text-gray-600 dark:text-gray-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              More
            </span>
          </button>

          {/* More Actions Menu */}
          {moreMenuOpen && (
            <div
              className={`absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-zinc-800 border border-gray-200/60 dark:border-zinc-700/60 rounded-2xl shadow-2xl backdrop-blur-lg z-50 ${
                mobileView ? "animate-slide-up" : "animate-scale-in"
              }`}
            >
              <div className="p-2 space-y-1">
                <button
                  onClick={() => {
                    exportAsText();
                    setMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors text-left text-sm"
                >
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>Export as Text</span>
                </button>

                <button
                  onClick={() => {
                    // Share functionality would go here
                    setMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors text-left text-sm"
                >
                  <Share className="w-4 h-4 text-green-500" />
                  <span>Share Note</span>
                </button>

                <button
                  onClick={() => {
                    importContent();
                    setMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors text-left text-sm"
                >
                  <Upload className="w-4 h-4 text-amber-500" />
                  <span>Import File</span>
                </button>

                <div className="h-px bg-gray-200 dark:bg-zinc-700 my-1"></div>

                <button
                  onClick={() => {
                    clearContent();
                    setMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors text-left text-sm text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 transition-colors duration-300 lg:bg-gray-50 lg:dark:bg-zinc-950">
   {/* Modern Header with Dark/Light Mode Support */}
<header className="sticky top-0 z-40 border-b border-gray-200/60 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-lg transition-colors duration-500">
  <div className="max-w-6xl mx-auto grid grid-cols-3 items-center px-4 py-4 lg:px-6 lg:py-5">
    
    {/* Back Button */}
    <Link
      to="/notes"
      className="flex items-center gap-3 group p-2 rounded-xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-zinc-800 active:scale-95"
    >
      <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors" />
      {!mobileView && (
        <span className="font-semibold text-gray-700 dark:text-gray-300 group-hover:text-primary">
          Back to Notes
        </span>
      )}
    </Link>

    {/* Title */}
    <div className="text-center select-none">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
        {isEditing ? "Edit Note" : "New Note"}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 max-sm:hidden text-xs sm:text-sm mt-0.5">
        {isEditing ? "Update your thoughts" : "Start capturing your ideas"}
      </p>
    </div>

    {/* Status & Info */}
    <div className="flex items-center justify-end gap-4">
      {isTyping && (
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 animate-fade-in">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-primary">Saving...</span>
        </div>
      )}

      {/* Word Count + Last Saved */}
      {mobileView ? (
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {wordCount} words
        </span>
      ) : (
        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-zinc-800/80 backdrop-blur-sm">
            <Languages size={12}  />
            <span>{wordCount} words</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-zinc-800/80 backdrop-blur-sm">
            <Clock size={12} />
            <span>
              Saved{" "}
              {lastSaved.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  </div>
</header>


      <main
        className={`max-w-6xl mx-auto ${
          mobileView ? "px-4 pb-24" : "px-6 pb-32 lg:pb-20"
        }`}
      >
        {/* Title Section */}
        <div className="mb-6 lg:mb-8">
          <div className="relative">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              autoFocus
              className="w-full text-xl lg:text-2xl font-bold bg-transparent border-0 outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 pb-3 border-b-2 border-gray-200/60 dark:border-zinc-700/60 focus:border-primary transition-colors"
            />
            {!title.trim() && (
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        </div>

        {/* Editor/Preview Area */}
        <div className="mb-6 lg:mb-8">
          {!isPreview ? (

              <RichTextEditor
                ref={editorRef}
                content={content}
                setContent={setContent}
                mobileOptimized={mobileView}
              />
      
          ) : (
            <div className="bg-gray-50/50 dark:bg-zinc-900/50 rounded-2xl lg:rounded-3xl border border-gray-200/60 dark:border-zinc-700/60 p-6 min-h-[50vh] lg:min-h-[60vh]">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Preview
                </h3>
              </div>
              <div
                className="prose prose-sm lg:prose-base dark:prose-invert max-w-none text-gray-900 dark:text-white"
                dangerouslySetInnerHTML={{
                  __html:
                    content ||
                    '<p class="text-gray-500 dark:text-gray-400 italic">Start writing or use AI to generate content...</p>',
                }}
              />
            </div>
          )}
        </div>
      </main>

      {/* Unified Bottom Navigation */}
      <BottomNavigation />

      {/* AI Drawer Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-end lg:items-center justify-center lg:p-4 
  transition-all duration-500 ease-in-out ${
    showModal ? "pointer-events-auto" : "pointer-events-none"
  }`}
      >
        {/* Overlay */}
        <div
          onClick={handleCloseModal}
          className={`absolute inset-0 bg-transparent backdrop-blur-sm lg:bg-black/40 ${
            showModal ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Drawer Content */}
        <div
          className={`relative w-full lg:max-w-2xl bg-white dark:bg-zinc-900 
    rounded-t-3xl lg:rounded-3xl border border-gray-200/80 dark:border-zinc-700/80 shadow-2xl
    transform !transition-transform duration-100 ease-in-out
    ${showModal ? "translate-y-0" : "translate-y-full"}  ${
            showModal ? "opacity-100" : "opacity-0"
          }
    max-h-[90vh] lg:max-h-[80vh] flex flex-col`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/60 dark:border-zinc-700/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-primary/10">
                <Sparkles className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  AI Note Assistant
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Let AI help you write better
                </p>
              </div>
            </div>
            <button
              onClick={handleCloseModal}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            <textarea
              rows={4}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="What would you like to write about?"
              className="w-full p-4 rounded-2xl border-2 border-gray-300/60 dark:border-zinc-600/60 bg-transparent text-gray-900 dark:text-white resize-none focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all duration-300 text-base"
            />

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Quick Templates
              </h3>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setAiPrompt(prompt)}
                    className="text-left p-3 rounded-xl bg-gray-100/80 dark:bg-zinc-800/80 text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary dark:hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200/60 dark:border-zinc-700/60 bg-gray-50/50 dark:bg-zinc-800/50 rounded-b-3xl">
            <button
              onClick={handleCloseModal}
              className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-300/60 dark:border-zinc-600/60 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-300 font-medium text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleAIGenerate}
              disabled={loading || !aiPrompt.trim()}
              className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-primary text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNote;
