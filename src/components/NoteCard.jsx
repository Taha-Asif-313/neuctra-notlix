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
} from "lucide-react";
import toast from "react-hot-toast";
import { encryptData } from "../utils/cryptoUtils";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";
import { createNote } from "../authix/authixinit";

const NoteCard = ({ note, onDelete, onDownload, viewMode = "grid" }) => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modal, setModal] = useState({ show: false, type: "", link: "" });
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    message: "",
    onConfirm: null,
    loading: false,
  });
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

  // ✅ Safe Copy
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("✅ Link copied!");
    } catch {
      toast.error("❌ Failed to copy!");
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
        content: note.content || "",
        date: new Date().toISOString(),
        wordCount: note.wordCount || 0,
      };
      await createNote(user.id, duplicatedData);
      toast.dismiss();
      toast.success("✅ Note duplicated!");
      navigate("/notes");
    } catch {
      toast.dismiss();
      toast.error("❌ Duplication failed!");
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
          setConfirmModal({ show: false, message: "", onConfirm: null });
          toast.success("🗑️ Deleted!");
        } catch {
          toast.error("❌ Failed to delete!");
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
    const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
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

// --- MODERN LINK MODAL ---
const LinkModal = () =>
  modal.show && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-[92%] max-w-lg border border-gray-100 dark:border-zinc-700 p-6 sm:p-8 animate-scaleIn">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`p-3 rounded-2xl ${
              modal.type === "collab"
                ? "bg-blue-500/10 text-blue-500"
                : "bg-primary/10 text-primary"
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
              {modal.type === "collab" ? "Collaboration Link" : "Preview Link"}
            </h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
              <Clock className="w-4 h-4 mr-1" />
              Expires in 24 hours
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
          Share this link to{" "}
          {modal.type === "collab"
            ? "collaborate in real-time with others."
            : "provide read-only access to your note."}
        </p>

        {/* Link Display */}
        <div className="bg-gray-50 dark:bg-zinc-800 rounded-2xl p-4 mb-6 border border-gray-200 dark:border-zinc-600">
          <div className="flex items-center gap-3">
            <p className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
              {modal.link}
            </p>
            <button
              onClick={() => copyToClipboard(modal.link)}
              className="flex-shrink-0 text-primary hover:text-primary/80 transition-all duration-200 hover:scale-105 active:scale-95"
              title="Copy link"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setModal({ show: false, type: "", link: "" })}
            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium border border-transparent hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all duration-200"
          >
            Close
          </button>
          <button
            onClick={() => copyToClipboard(modal.link)}
            className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
          >
            <Copy className="w-4 h-4" />
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );


  // --- CONFIRM DELETE MODAL ---
  const ConfirmModal = () =>
    confirmModal.show && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 w-[90%] max-w-sm text-center border border-gray-200 dark:border-zinc-800 animate-fadeInUp">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Confirm Deletion
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {confirmModal.message}
          </p>

          {confirmModal.loading ? (
            <Loader2 className="w-6 h-6 text-red-600 animate-spin mx-auto" />
          ) : (
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmModal.onConfirm}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
              >
                Delete
              </button>
              <button
                onClick={() =>
                  setConfirmModal({ show: false, message: "", onConfirm: null })
                }
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
      <LinkModal />
      <ConfirmModal />

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
          <div className="text-xs sm:text-sm flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{formattedTime}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 relative" ref={dropdownRef}>
            {/* Download */}
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

            {/* Duplicate */}
            <button
              onClick={() => duplicateNote(note)}
              className="p-2 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition"
            >
              <Copy size={18} />
            </button>

            {/* Edit */}
            <Link
              to={`/notes/edit/${note.id}`}
              className="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
            >
              <Edit size={18} />
            </Link>

            {/* Delete */}
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
            >
              <Trash2 size={18} />
            </button>

            {/* Collaboration Link */}
            <button
              onClick={() => generateLink("collab")}
              className="p-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition"
              title="Generate Collaboration Link"
            >
              <UserRoundPlus size={18} />
            </button>

            {/* Preview Link */}
            <button
              onClick={() => generateLink("preview")}
              className="p-2 rounded-lg text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition"
              title="Generate Preview Link"
            >
              <Eye size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoteCard;
