import { useState, useEffect, useRef } from "react";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { ArrowLeft, Save, View, X, Zap } from "lucide-react";
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

  const existingNote = isEditing
    ? notes.find((note) => note.id.toString() === id)
    : null;

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setContent(existingNote.content);
      if (editorRef.current) {
        editorRef.current.setEditorContent(existingNote.content); // sync editor
      }
    }
  }, [existingNote]);

  const handleSubmit = (e) => {
    e?.preventDefault();

    if (!title.trim()) return;

    const noteData = {
      id: isEditing ? id : Date.now().toString(),
      title: title.trim(),
      content,
      date: new Date().toISOString(),
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
        editorRef.current?.setEditorContent(content + aiResponse); // update editor
      }

      setShowModal(false);
      setAiPrompt("");
    } catch (err) {
      console.error("AI generation failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-2xl overflow-hidden">
          {/* Title Section */}
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-4">
              <Link to={"/"}>
                <ArrowLeft className="w-7 h-7 text-primary sm:w-6 sm:h-6" />
              </Link>
              {isEditing ? "Edit Note" : "Create New Note"}
            </h2>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              autoFocus
              className="w-full px-0 py-2 sm:py-3 text-base sm:text-lg md:text-xl font-semibold bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 focus:border-primary dark:focus:border-primary outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Editor */}
          <div className="grid grid-cols-1 gap-3 mb-5">
            {!isPreview ? (
              <div className="rounded-xl border border-gray-200 dark:border-gray-700">
                <RichTextEditor content={content} setContent={setContent} />
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 overflow-y-auto">
                <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Preview
                </h3>
                <div
                  className="prose dark:prose-invert max-w-none text-gray-900 dark:text-white"
                  dangerouslySetInnerHTML={{
                    __html: content || "<p>Nothing to preview</p>",
                  }}
                />
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <span>Last saved: {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 text-sm w-full sm:w-auto">
              <button
                onClick={handleSubmit}
                className="inline-flex items-center justify-center px-5 sm:px-6 py-2 sm:py-3 bg-primary text-white font-medium rounded-xl"
              >
                <Save size={16} className="sm:mr-2" />
                {isEditing ? "Update Note" : "Create Note"}
              </button>

              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center justify-center px-5 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-500 to-primary text-white font-medium rounded-xl"
              >
                <Zap size={16} className="sm:mr-2" />
                Generate Using AI
              </button>

              <button
                onClick={() => setIsPreview((prev) => !prev)}
                className="inline-flex items-center justify-center px-5 sm:px-6 py-2 sm:py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-xl"
              >
                <View size={16} className="sm:mr-2" />
                {isPreview ? "Back to Edit" : "Preview"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex">
          {/* 🔹 Backdrop */}
          <div
            onClick={() => setShowModal(false)}
            className="flex-1 bg-black/50 backdrop-blur-sm transition-opacity"
          />

          {/* 🔹 Drawer */}
          <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl bg-white dark:bg-zinc-950 shadow-2xl h-full p-4 sm:p-6 flex flex-col animate-slideIn">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 sm:pb-4 mb-4">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                Generate Note with AI
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Input */}
            <textarea
              rows={5}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask AI to create a note (e.g. 'Write about time management')"
              className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm sm:text-base"
            />

            {/* Footer */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm sm:text-base"
              >
                <X size={16} />
                Cancel
              </button>

              <button
                onClick={handleAIGenerate}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm sm:text-base rounded-lg bg-gradient-to-r from-amber-500 to-primary text-white font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap size={18} className={loading ? "animate-spin" : ""} />
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNote;
