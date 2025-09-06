import { Edit, Trash2, Download, Calendar, Clock, Copy } from "lucide-react";
import { Link } from "react-router-dom";

const NoteCard = ({
  note,
  onDelete,
  onDownload,
  onDuplicate,
  viewMode = "grid",
}) => {
  const formattedDate = new Date(note.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedTime = new Date(note.date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (viewMode === "list") {
    return (
      <div className="bg-white dark:bg-black rounded-xl p-4 hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate mb-1">
            {note.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 truncate mb-2">
            {note.content}
          </p>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
            <Calendar size={14} className="mr-1" />
            <span className="mr-3">{formattedDate}</span>
            <Clock size={14} className="mr-1" />
            <span>{formattedTime}</span>
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onDuplicate(note)}
            className="p-2 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors duration-200"
            aria-label="Duplicate note"
            title="Duplicate note"
          >
            <Copy size={18} />
          </button>
          <Link
            to={`/notes/edit/${note.id}`}
            className="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
            aria-label="Edit note"
            title="Edit note"
          >
            <Edit size={18} />
          </Link>
          <button
            onClick={() => onDownload(note)}
            className="p-2 rounded-lg text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors duration-200"
            aria-label="Download note"
            title="Download note"
          >
            <Download size={18} />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200"
            aria-label="Delete note"
            title="Delete note"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-950 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-black group">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate group-hover:text-primary dark:group-hover:text-primary transition-colors duration-200">
            {note.title}
          </h3>
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: note.content || "<p>Nothing to preview</p>",
          }}
          className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3"
        />

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-500">
            {formattedDate} • {formattedTime}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onDuplicate(note)}
              className="p-2 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors duration-200"
              aria-label="Duplicate note"
              title="Duplicate note"
            >
              <Copy size={18} />
            </button>
            <Link
              to={`/notes/edit/${note.id}`}
              className="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
              aria-label="Edit note"
              title="Edit note"
            >
              <Edit size={18} />
            </Link>
            <button
              onClick={() => onDownload(note)}
              className="p-2 rounded-lg text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors duration-200"
              aria-label="Download note"
              title="Download note"
            >
              <Download size={18} />
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200"
              aria-label="Delete note"
              title="Delete note"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
