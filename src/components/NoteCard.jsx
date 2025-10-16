import React, { useState, useRef, useEffect } from "react";
import {
  Edit,
  Trash2,
  Download,
  Copy,
  FileText,
  CodeXml,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

const NoteCard = ({
  note,
  onDelete,
  onDownload,
  onDuplicate,
  viewMode = "grid",
}) => {
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

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showModal = (message, onConfirm) => {
    setModal({ show: true, message, onConfirm, loading: false });
  };

  const hideModal = () =>
    setModal({ show: false, loading: false, message: "", onConfirm: null });

  const handleDelete = () => {
    showModal("Are you sure you want to delete this note?", async () => {
      try {
        setModal((m) => ({ ...m, loading: true }));
        await new Promise((resolve) => setTimeout(resolve, 1000)); // fake delay
        await onDelete(note.id);
        hideModal();
      } catch (err) {
        console.error("Error deleting note:", err);
        hideModal();
      }
    });
  };

  const handleDownload = (format) => {
    setDropdownOpen(false);
    onDownload(note, format);
  };

  // Modern Modal Component
  const Modal = () =>
    modal.show ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 max-w-sm w-full text-center transform transition-all animate-slideUp border border-gray-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
            {modal.loading ? "Deleting..." : "Confirm Deletion"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {modal.loading ? "Please wait while we remove your note..." : modal.message}
          </p>

          {modal.loading ? (
            <div className="flex justify-center py-2">
              <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
            </div>
          ) : (
            <div className="flex justify-center space-x-4">
              <button
                onClick={modal.onConfirm}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
              >
                Delete
              </button>
              <button
                onClick={hideModal}
                className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    ) : null;

  const content = (
    <div
      dangerouslySetInnerHTML={{
        __html: note.content || "<p>Nothing to preview</p>",
      }}
      className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3"
    />
  );

  return (
    <>
      <Modal />
      <div className="bg-white flex flex-col justify-between dark:bg-zinc-950 rounded-xl shadow-sm overflow-visible hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-black group p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg group-hover:text-blue-500 font-semibold text-gray-800 dark:text-white truncate">
            {note.title}
          </h3>
        </div>

        <span className="text-xs">{content}</span>

        <div className="flex justify-between items-center mt-3">
          <div className="text-sm flex max-md:flex-col md:gap-2 text-gray-500 dark:text-gray-500">
            <span>{formattedDate},</span>
            <span>{formattedTime}</span>
          </div>

          <div className="flex items-center space-x-2 relative" ref={dropdownRef}>
            {/* Download Button */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-2 rounded-lg text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors duration-200"
            >
              <Download size={18} />
            </button>

            {/* Custom Dropdown */}
            {dropdownOpen && (
              <div className="absolute -right-10 top-full mt-1 w-48 bg-white text-black dark:text-white text-xs dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50">
                <button
                  className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => handleDownload("txt")}
                >
                  <FileText size={16} /> Download as TXT
                </button>
                <button
                  className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => handleDownload("html")}
                >
                  <CodeXml size={16} /> Download as HTML
                </button>
              </div>
            )}

            <button
              onClick={() => onDuplicate(note)}
              className="p-2 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors duration-200"
            >
              <Copy size={18} />
            </button>
            <Link
              to={`/notes/edit/${note.id}`}
              className="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
            >
              <Edit size={18} />
            </Link>
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoteCard;
