import { useState, useEffect, useRef } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, Edit3, Clock, Image, X, Menu } from "lucide-react";
import RichTextEditor from "../../components/RichTextEditor";
import Metadata from "../../MetaData";
import CustomLoader from "../../components/CustomLoader";
import toast from "react-hot-toast";
import BlocksPreview from "../../components/TextEditor/previews/BlockPreview";
import { useAppContext } from "../../context/AppContext";
import { ReactSignedIn } from "@neuctra/authix";
import { getSingleNote, updateNote } from "../../utils/authixInit";
import { motion, AnimatePresence } from "framer-motion";

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef();
  const { user } = useAppContext();

  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [noteThumbnail, setNoteThumbnail] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [loadingNote, setLoadingNote] = useState(true);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ✅ Fetch note
  useEffect(() => {
    const fetchNote = async () => {
      if (!user?.id) return;
      setLoadingNote(true);
      try {
        const response = await getSingleNote(user.id, id);
        console.log(response);

        if (response.id) {
          setTitle(response.title || "");
          setBlocks(response.blocks);
          setNoteThumbnail(response.noteThumbnail || ""); // ✅ add this
        }
      } catch (err) {
        console.error("Failed to load note:", err);
      } finally {
        setLoadingNote(false);
      }
    };
    fetchNote();
  }, [id, user]);

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
        blocks,
        noteThumbnail, // ✅ include thumbnail
        date: new Date().toISOString(),
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

  if (loading) return <CustomLoader message="Saving Note..." />;

  return (
    <ReactSignedIn fallback={<Navigate to={"/login"} />}>
      <Metadata
        title={title ? `${title} — Edit Note | Notlix` : "Edit Note | Notlix"}
        description="Edit your note with AI support."
      />

      <div className="min-h-screen bg-white dark:bg-zinc-950 text-black dark:text-white">
        <header className="sticky top-0 z-40 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
            {/* Left: Back Button & Title */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                to="/notes"
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
              >
                <ArrowLeft className="w-4 h-4" />
                {/* Hide text on mobile */}
                <span className="hidden sm:inline">Back</span>
              </Link>

              {/* Divider (only on sm+) */}
              <div className="hidden sm:block h-5 w-px bg-gray-300 dark:bg-zinc-700" />

              <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                Edit Note
              </h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Last Saved (hide on mobile) */}
              <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-mono">
                <Clock size={14} />
                <span>
                  {lastSaved.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Divider (hide on mobile) */}
              <div className="hidden sm:block h-5 w-px bg-gray-300 dark:bg-zinc-700" />

              {/* Icon Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsPreview(!isPreview)}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                  title={isPreview ? "Edit" : "Preview"}
                >
                  {isPreview ? <Edit3 size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Divider (hide on mobile) */}
              <div className="hidden sm:block h-5 w-px bg-gray-300 dark:bg-zinc-700" />

              {/* Thumbnail & Update Buttons: hide on very small screens */}
              <div className="hidden sm:flex items-center justify-center gap-2">
                <button
                  onClick={() => setImageModalOpen(true)}
                  className="px-3 py-2 text-sm font-medium border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  Set Thumbnail
                </button>

                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:opacity-90 transition"
                >
                  Update
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
                <button
                  onClick={() => setImageModalOpen(true)}
                  className="w-full px-3 py-2 text-center text-sm font-medium border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  Set Thumbnail
                </button>

                <button
                  onClick={handleUpdate}
                  className="w-full px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:opacity-90 transition"
                >
                  Update
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {loadingNote ? (
          <CustomLoader message="Loading Note..." />
        ) : (
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="space-y-8">
              {/* Title Input */}
              <div className="w-full">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Untitled Note"
                  className="
      w-full

      text-2xl
      sm:text-3xl
      md:text-4xl
      lg:text-5xl

      font-bold
      bg-transparent
      border-none
      outline-none
      focus:ring-0

      px-2 sm:px-1
      py-2 sm:py-3

      leading-tight
      break-words

      placeholder-slate-300
      dark:placeholder-zinc-700

      transition-all"
                />
              </div>

              {/* Editor / Preview */}
              {!isPreview ? (
                <RichTextEditor
                  ref={editorRef}
                  blocks={blocks}
                  setBlocks={setBlocks}
                  key={id || "edit-note"}
                />
              ) : (
                <BlocksPreview blocks={blocks} />
              )}
            </div>
          </main>
        )}

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
                    Edit Note Thumbnail
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
                    onClick={() => setImageModalOpen(false)}
                    className="px-5 py-2 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-md hover:opacity-90 transition"
                  >
                    Save Thumbnail
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

export default EditNote;
