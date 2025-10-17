import React, { useState, useRef, useEffect } from "react";
import {
  Edit,
  Trash2,
  Download,
  Copy,
  FileText,
  CodeXml,
  Loader2,
  UserRoundPlus,
} from "lucide-react";
import toast from "react-hot-toast";
import { encryptData } from "../utils/cryptoUtils";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";
import { createNote } from "../authix/authixinit";

const NoteCard = ({ note, onDelete, onDownload, viewMode = "grid" }) => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [modal, setModal] = useState({
    show: false,
    loading: false,
    message: "",
    onConfirm: null,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const formattedDate = new Date(note.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const formattedTime = new Date(note.date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // ✅ Universal Copy Function (works even if clipboard API is blocked)
  const copyToClipboard = async (text) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      toast.success("🔗 Collaboration link copied!");
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      toast.error("❌ Copy failed — try manually!");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showModal = (message, onConfirm) => {
    setModal({ show: true, message, onConfirm, loading: false });
  };
  const hideModal = () =>
    setModal({ show: false, message: "", onConfirm: null, loading: false });

  // --- DUPLICATE NOTE ---
  const duplicateNote = async (note) => {
    try {
      // Optional: show a loading toast
      toast.loading("Duplicating note...");

      // Prepare duplicated note data
      const duplicatedData = {
        title: `${note.title || "Untitled"} (Copy)`,
        content: note.content || "",
        date: new Date().toISOString(),
        wordCount: note.wordCount || 0,
      };

      // Call the same createNote API you used for saving
      const response = await createNote(user.id, duplicatedData);

      // Success feedback
      toast.dismiss(); // remove loading toast
      toast.success("✅ Note duplicated successfully!");

      console.log("Duplicated Note:", response);

      // Optional: navigate to the new note or refresh notes list
      navigate("/notes");
    } catch (err) {
      console.error("Error duplicating note:", err);
      toast.dismiss();
      toast.error("❌ Failed to duplicate note!");
    }
  };

  const handleDelete = () => {
    showModal("Are you sure you want to delete this note?", async () => {
      try {
        setModal((m) => ({ ...m, loading: true }));
        await new Promise((resolve) => setTimeout(resolve, 800));
        await onDelete(note.id);
        hideModal();
        toast.success("🗑️ Note deleted successfully!");
      } catch (err) {
        console.error(err);
        hideModal();
        toast.error("❌ Failed to delete note!");
      }
    });
  };

  const handleDownload = (format) => {
    setDropdownOpen(false);
    onDownload(note, format);
  };

  const handleShare = async () => {
    const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
    const encrypted = encryptData({
      userId: user?.id,
      noteId: note?.id,
      expiry,
    });

    const link = `${window.location.origin}/collab/${encodeURIComponent(
      encrypted
    )}`;
    await copyToClipboard(link);
    toast.success("🔗 Collaboration link (valid for 24 hours) copied!");
  };

  const Modal = () =>
    modal.show && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 w-[90%] max-w-sm text-center border border-gray-200 dark:border-zinc-800 animate-fadeInUp">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
            {modal.loading ? "Deleting..." : "Confirm Deletion"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {modal.loading
              ? "Please wait while we remove your note..."
              : modal.message}
          </p>

          {modal.loading ? (
            <div className="flex justify-center py-2">
              <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
            </div>
          ) : (
            <div className="flex justify-center gap-4">
              <button
                onClick={modal.onConfirm}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
              >
                Delete
              </button>
              <button
                onClick={hideModal}
                className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    );

  return (
    <>
      <Modal />
      <div
        className={`bg-white dark:bg-zinc-950 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 
  hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between w-full font-[Arial] ${
    viewMode === "list"
      ? "md:flex-row md:items-center md:justify-between md:gap-6"
      : "gap-3"
  }`}
      >
        {/* Header */}
        <div className="flex justify-center items-center text-center">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white truncate hover:text-primary transition-colors duration-200">
            {note.title || "Untitled Note"}
          </h3>
        </div>

        {/* Content */}
        <div
          dangerouslySetInnerHTML={{
            __html: note.content || "<p>Nothing to preview</p>",
          }}
          className="text-gray-600 dark:text-gray-400 text-center line-clamp-3 text-sm sm:text-base leading-relaxed px-2"
        />

        {/* Footer */}
        <div className="flex flex-col-reverse justify-between items-center gap-3 mt-2">
          {/* Date & Time */}
          <div className="text-xs sm:text-sm flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{formattedTime}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 relative" ref={dropdownRef}>
            {/* Download Dropdown */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-2 rounded-lg text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition"
            >
              <Download size={18} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 text-sm overflow-hidden">
                <button
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  onClick={() => handleDownload("txt")}
                >
                  <FileText size={16} /> Download as TXT
                </button>
                <button
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  onClick={() => handleDownload("html")}
                >
                  <CodeXml size={16} /> Download as HTML
                </button>
              </div>
            )}

            {/* Other Actions */}
            <button
              onClick={() => duplicateNote(note)}
              className="p-2 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition"
            >
              <Copy size={18} />
            </button>

            <Link
              to={`/notes/edit/${note.id}`}
              className="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
            >
              <Edit size={18} />
            </Link>

            <button
              onClick={handleDelete}
              className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
            >
              <Trash2 size={18} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition"
            >
              <UserRoundPlus size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoteCard;
