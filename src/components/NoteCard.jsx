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
  Eye,
  Clock,
  Users,
  ChevronDown,
  ImageIcon,
  MoreVertical,
} from "lucide-react";
import toast from "react-hot-toast";
import { encryptData } from "../utils/cryptoUtils";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { createNote, updatePackageUsage } from "../utils/authixInit";
import { AnimatePresence, motion } from "framer-motion";

const NoteCard = ({ note, onDelete, onDownload }) => {
  const navigate = useNavigate();
  const { user, setNotes } = useAppContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modal, setModal] = useState({ show: false, type: "", link: "" });
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    message: "",
    onConfirm: null,
    loading: false,
  });

  const dropdownRef = useRef(null);

  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedTime = new Date(note.createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // ✅ Safe copy using hidden textarea
  const copyToClipboard = async (text) => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success("Link copied!");
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Failed to copy!");
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

  // --- DUPLICATE NOTE ---
  const duplicateNote = async (note) => {
    try {
      toast.loading("Duplicating note...");
      const duplicatedData = {
        title: `${note.title || "Untitled"} (Copy)`,
        blocks: note.blocks || "",
        date: new Date().toISOString(),
        wordCount: note.wordCount || 0,
      };
      const newNote = await createNote(user.id, duplicatedData);
      if (newNote) {
        setNotes((prev) => [newNote, ...prev]);
        toast.dismiss();
        toast.success("Note duplicated!");
      } else throw new Error("No response");
    } catch (err) {
      console.error("Duplication failed:", err);
      toast.dismiss();
      toast.error("Duplication failed!");
    }
  };

  // --- DELETE NOTE ---
  const handleDelete = () => {
    setConfirmModal({
      show: true,
      message: "Are you sure you want to delete this note?",
      onConfirm: async () => {
        try {
          setConfirmModal((m) => ({ ...m, loading: true }));
          await onDelete(note.id);
          await updatePackageUsage(user.id, "notes", "decrement");
          setConfirmModal({ show: false, message: "", onConfirm: null });
          toast.success("Deleted!");
        } catch {
          toast.error("Failed to delete!");
        }
      },
    });
  };

  const handleDownload = (format) => {
    setDropdownOpen(false);
    onDownload(note, format);
  };

  // --- GENERATE LINKS ---
  const generateLink = (type) => {
    const expiry = Date.now() + 24 * 60 * 60 * 1000;
    const encrypted = encryptData({
      userId: user?.id,
      noteId: note?.id,
      expiry,
    });
    const base = window.location.origin;
    const path = type === "collab" ? "/collab/" : "/preview/";
    const link = `${base}${path}${encodeURIComponent(encrypted)}`;
    setModal({ show: true, type, link });
  };

  // --- MODALS (Preview / Collaboration / Confirm Delete) ---
  const LinkModal = () =>
    modal.show && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-[92%] max-w-lg border border-gray-100 dark:border-zinc-700 p-6 sm:p-8 animate-scaleIn">
          <div className="flex items-center gap-3 mb-6">
            <div
              className={`p-3 rounded-2xl ${
                modal.type === "collab"
                  ? "bg-purple-500/10 text-purple-500"
                  : "bg-teal-500/10 text-teal-500"
              }`}
            >
              {modal.type === "collab" ? (
                <Users className="w-6 h-6" />
              ) : (
                <Eye className="w-6 h-6" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                {modal.type === "collab"
                  ? "Collaboration Link"
                  : "Preview Link"}
              </h3>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <Clock className="w-4 h-4 mr-1" />
                Expires in 24 hours
              </div>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
            Share this link to{" "}
            {modal.type === "collab"
              ? "collaborate in real-time with others."
              : "provide read-only access to your note."}
          </p>

          <div className="bg-gray-50 dark:bg-zinc-800 rounded-2xl p-4 mb-6 border border-gray-200 dark:border-zinc-600">
            <div className="flex items-center gap-3">
              <p className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                {modal.link}
              </p>
              <button
                onClick={() => copyToClipboard(modal.link)}
                className={`flex-shrink-0 ${
                  modal.type === "collab"
                    ? "text-purple-500 hover:text-purple-400"
                    : "text-teal-500 hover:text-teal-400"
                } transition-all duration-200 hover:scale-105 active:scale-95`}
                title="Copy link"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setModal({ show: false, type: "", link: "" })}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium border border-transparent hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all duration-200"
            >
              Close
            </button>
            <button
              onClick={() => copyToClipboard(modal.link)}
              className={`flex-1 px-4 py-3 ${
                modal.type === "collab"
                  ? "bg-purple-500 hover:bg-purple-600"
                  : "bg-teal-500 hover:bg-teal-600"
              } text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg active:scale-[0.98]`}
            >
              <Copy className="w-4 h-4" />
              Copy Link
            </button>
          </div>
        </div>
      </div>
    );

  const ConfirmModal = () =>
    confirmModal.show && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-[90%] max-w-md border border-gray-100 dark:border-zinc-700 p-6 sm:p-8 animate-scaleIn">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-red-500/10 text-red-500">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                Confirm Deletion
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
            {confirmModal.message ||
              "Are you sure you want to delete this item?"}
          </p>

          {confirmModal.loading ? (
            <div className="flex justify-center py-3">
              <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={confirmModal.onConfirm}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
              >
                Delete
              </button>
              <button
                onClick={() =>
                  setConfirmModal({
                    show: false,
                    message: "",
                    onConfirm: null,
                    loading: false,
                  })
                }
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    );
console.log(note);

  return (
    <>
      <LinkModal />
      <ConfirmModal />

      <motion.div
        onClick={() => navigate(`/note/edit/${note.id}`)}
        transition={{ type: "spring", stiffness: 250, damping: 18 }}
        className="group cursor-pointer relative rounded-3xl overflow-visible bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-md hover:shadow-2xl transition-all duration-500"
      >
        {/* Image Section */}
        <div className="relative h-40 w-full overflow-hidden rounded-t-3xl">
          {note.noteThumbnail ? (
            <img
              src={note.noteThumbnail}
              alt={note.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-gray-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          )}

          {/* Floating Action Button */}
          <div className="absolute top-3 right-3" ref={dropdownRef}>
            <button
          onClick={(e) => {
    e.stopPropagation();
    setDropdownOpen((prev) => !prev);
  }}
              className="p-2 rounded-lg bg-white/70 dark:bg-zinc-950/70 border border-gray-200 dark:border-zinc-800 shadow-md hover:scale-105 transition"
            >
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-5 flex flex-col gap-3">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors duration-300">
            {note.title || "Untitled Note"}
          </h3>

          {/* Preview */}
          <div
            dangerouslySetInnerHTML={{
              __html:
                note.blocks?.[0]?.content?.html ||
                "<p class='text-gray-400'>Nothing to preview</p>",
            }}
            className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed"
          />

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-zinc-700 to-transparent" />

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{formattedTime}</span>
            </div>

            {/* Subtle Badge */}
            <div className="px-3 py-1 rounded-full bg-primary/80 text-white text-[11px] font-medium">
              Note
            </div>
          </div>
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-12 right-3 w-56 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-2xl overflow-visible z-50"
            >
              <div className="py-1 text-sm">
                <Link
                  to={`/note/edit/${note.id}`}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  <Edit size={16} /> Edit
                </Link>

                <button
                  onClick={() => duplicateNote(note)}
                  className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  <Copy size={16} /> Duplicate
                </button>

                <div className="h-px bg-gray-200 dark:bg-zinc-700 my-1" />

                <button
                  onClick={() => handleDownload("txt")}
                  className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  <FileText size={16} /> Download TXT
                </button>

                <div className="h-px bg-gray-200 dark:bg-zinc-700 my-1" />

                <button
                  onClick={() => generateLink("collab")}
                  className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  <UserRoundPlus size={16} /> Collaboration
                </button>

                <button
                  onClick={() => generateLink("preview")}
                  className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  <Eye size={16} /> Preview
                </button>

                <div className="h-px bg-gray-200 dark:bg-zinc-700 my-1" />

                <button
                  onClick={handleDelete}
                  className="flex items-center gap-3 px-4 py-2 w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default NoteCard;
