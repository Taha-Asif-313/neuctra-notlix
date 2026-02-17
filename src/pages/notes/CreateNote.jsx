import { useState, useEffect, useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  Edit3,
  Clock,
  FileText,
  X,
  Image,
  Menu,
} from "lucide-react";
import {
  createNote,
  getPackage,
  updatePackageUsage,
} from "../../utils/authixInit";
import toast from "react-hot-toast";
import RichTextEditor from "../../components/RichTextEditor";
import CustomLoader from "../../components/CustomLoader";
import Metadata from "../../MetaData";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../../context/AppContext";
import { ReactSignedIn } from "@neuctra/authix";

const CreateNote = () => {
  const navigate = useNavigate();
  const editorRef = useRef();
  const { user } = useAppContext();

  // -----------------------------
  // 🔹 Local States
  // -----------------------------
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState([]); // ✅ blocks instead of raw content
  const [noteThumbnail, setNoteThumbnail] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [noteLoading, setNoteLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [mobileView, setMobileView] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    // Update word count based on blocks
    const text = blocks
      .map((b) => {
        if (b.type === "text") return b.content?.html || "";
        if (b.type === "image") return "";
        if (b.type === "table") return b.content?.rows?.flat().join(" ") || "";
        return "";
      })
      .join(" ");
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  }, [blocks]);

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

      if (!user?.id) {
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
      if (!pkg) throw new Error("Failed to verify your package.");

      const notesUsed = pkg?.usage?.notesUsed ?? 0;
      const notesLimit = parseInt(
        pkg?.features?.find((f) => f.includes("Up to"))?.match(/\d+/)?.[0] ||
          100,
      );

      if (notesUsed >= notesLimit) {
        toast.error(`Note limit reached (${notesLimit}). Upgrade your plan.`);
        return;
      }

      // Save blocks instead of raw content
      const noteData = {
        title: title.trim(),
        blocks,
        noteThumbnail: noteThumbnail,
        wordCount,
      };
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

  if (noteLoading)
    return <CustomLoader message="Saving your note, please wait..." />;

  return (
    <ReactSignedIn fallback={<Navigate to={"/login"} />}>
      <Metadata
        title="Create New Note – Neuctra Notlix"
        description="Create and organize your ideas effortlessly with Neuctra Notlix — the AI-powered note editor."
      />

      <div className="min-h-screen bg-slate-50 dark:bg-black text-gray-900 dark:text-white">
        <header className="sticky top-0 z-40 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-4">
              <Link
                to="/notes"
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Link>

              {/* Divider */}
              <div className="hidden sm:block h-5 w-px bg-gray-300 dark:bg-zinc-700" />

              <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                New Note
              </h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Last Saved (md+) */}
              <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-mono">
                <Clock size={14} />
                <span>
                  {lastSaved.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Divider (sm+) */}
              <div className="hidden sm:block h-5 w-px bg-gray-300 dark:bg-zinc-700" />

              {/* Desktop Actions */}
              <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                {/* Icon Actions */}
                <button
                  onClick={() => setIsPreview(!isPreview)}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                  title={isPreview ? "Edit" : "Preview"}
                >
                  {isPreview ? <Edit3 size={18} /> : <Eye size={18} />}
                </button>

                {/* Divider */}
                <div className="h-5 w-px bg-gray-300 dark:bg-zinc-700" />

                {/* Secondary & Primary Buttons */}
                <button
                  onClick={() => setImageModalOpen(true)}
                  className="px-3 py-2 text-sm font-medium border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  Set Thumbnail
                </button>

                <button
                  onClick={handleSaveNote}
                  className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:opacity-90 transition"
                >
                  Save
                </button>
              </div>

              {/* Mobile Menu Toggle */}
              <div className="sm:hidden">
                <button
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  className="p-2 rounded-md bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden px-4 py-3 bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 flex flex-col gap-2 sm:hidden"
              >
                {/* Icon Actions */}
                <button
                  onClick={() => setIsPreview(!isPreview)}
                  className="w-full px-3 py-2 text-left rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  {isPreview ? (
                    <div className="flex items-center gap-2">
                      <Edit3 size={16} /> Edit
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Eye size={16} /> Preview
                    </div>
                  )}
                </button>

                {/* Thumbnail & Save */}
                <button
                  onClick={() => setImageModalOpen(true)}
                  className="w-full px-3 py-2 text-center text-sm font-medium border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  Set Thumbnail
                </button>

                <button
                  onClick={handleSaveNote}
                  className="w-full px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:opacity-90 transition"
                >
                  Save
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Editor Section */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="space-y-8">
            {/* Title Input - Modern minimalist */}
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled Note"
                className="w-full text-4xl sm:text-5xl font-bold bg-transparent border-none outline-none placeholder-slate-300 dark:placeholder-zinc-700 focus:ring-0 px-1 transition-all"
              />
              {/* Animated underline */}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left" />
            </div>

    

            {/* Editor/Preview Area */}
            {!isPreview ? (
              <div className="relative">
                {/* Floating toolbar hint - only shows on hover */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-white dark:bg-zinc-800 text-xs px-3 py-1.5 rounded-full shadow-lg border border-slate-200 dark:border-zinc-700">
                    Start typing or use / for commands
                  </div>
                </div>

                <RichTextEditor
                  ref={editorRef}
                  blocks={blocks}
                  setBlocks={setBlocks}
                  showAiButton = {true}
                />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {blocks.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                      <FileText
                        size={32}
                        className="text-slate-400 dark:text-zinc-600"
                      />
                    </div>
                    <p className="text-slate-400 dark:text-zinc-600 text-lg">
                      Nothing to preview yet
                    </p>
                    <p className="text-sm text-slate-300 dark:text-zinc-700 mt-1">
                      Start writing or add content to your note
                    </p>
                  </div>
                ) : (
                  blocks.map((b, index) => {
                    if (b.type === "text")
                      return (
                        <motion.div
                          key={b.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="prose prose-slate dark:prose-invert max-w-none bg-white dark:bg-zinc-800/50 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-zinc-700/50 hover:shadow-md transition-all duration-200"
                          dangerouslySetInnerHTML={{
                            __html: b.content?.html || "",
                          }}
                        />
                      );

                    if (b.type === "image")
                      return (
                        <motion.div
                          key={b.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="rounded-2xl overflow-hidden shadow-lg border border-slate-200/50 dark:border-zinc-700/50"
                        >
                          <img
                            src={b.content?.url}
                            alt={b.content?.alt || "user-uploaded"}
                            className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </motion.div>
                      );

                    if (b.type === "table") {
                      const headers = b.content?.headers || [];
                      const rows = b.content?.rows || [];
                      return (
                        <motion.div
                          key={b.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="overflow-x-auto rounded-2xl shadow-lg border border-slate-200/50 dark:border-zinc-700/50 bg-white dark:bg-zinc-800"
                        >
                          <table className="w-full text-sm border-collapse">
                            <thead className="bg-slate-50 dark:bg-zinc-700/50">
                              <tr>
                                {headers.map((h, i) => (
                                  <th
                                    key={i}
                                    className="border border-slate-200 dark:border-zinc-700 px-4 py-3 text-left font-medium text-slate-700 dark:text-slate-300"
                                  >
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {rows.map((r, i) => (
                                <tr
                                  key={i}
                                  className="hover:bg-slate-50 dark:hover:bg-zinc-700/30 transition-colors"
                                >
                                  {r.map((c, j) => (
                                    <td
                                      key={j}
                                      className="border border-slate-200 dark:border-zinc-700 px-4 py-3 text-slate-600 dark:text-slate-400"
                                    >
                                      {c}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </motion.div>
                      );
                    }

                    return null;
                  })
                )}
              </motion.div>
            )}
          </div>
        </main>

        {/* Modern Image Modal - Clean Version */}
        <AnimatePresence>
          {imageModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={() => setImageModalOpen(false)}
            >
              <motion.div
                initial={{ y: 20, scale: 0.96 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 20, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-800">
                  <h3 className="text-base flex items-center gap-2 font-semibold">
                    <Image size={20} />
                    Add Note Thumbnail
                  </h3>
                  <button
                    onClick={() => setImageModalOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                  {/* URL Input */}
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                      Image URL
                    </label>

                    <input
                      type="url"
                      value={noteThumbnail}
                      onChange={(e) => setNoteThumbnail(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 text-sm rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    />
                  </div>

                  {/* Preview */}
                  {noteThumbnail && (
                    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-700">
                      <img
                        src={noteThumbnail}
                        alt="Preview"
                        className="w-full h-44 object-cover"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-zinc-800 border-t border-gray-200 dark:border-zinc-800">
                  <button
                    onClick={() => setImageModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      if (!noteThumbnail) return;

                      try {
                        new URL(noteThumbnail);

                        setBlocks((prev) => [
                          ...prev,
                          {
                            id: crypto.randomUUID(),
                            type: "image",
                            content: {
                              url: noteThumbnail,
                              alt: "Image from URL",
                            },
                          },
                        ]);

                        setImageModalOpen(false);
                        setNoteThumbnail("");
                      } catch {
                        alert("Please enter a valid URL");
                      }
                    }}
                    className="px-5 py-2 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-md hover:opacity-90 transition"
                  >
                    Add Image
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ReactSignedIn>
  );
};

export default CreateNote;
