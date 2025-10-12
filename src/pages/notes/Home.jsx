import { useState, useMemo } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Plus } from "lucide-react";
import NoteCard from "../../components/NoteCard";
import SearchBar from "../../components/SearchBar";

const Home = () => {
  const { notes, setNotes } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const filteredNotes = useMemo(() => {
    if (!searchTerm) return notes;
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [notes, searchTerm]);

  const handleDeleteNote = (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setNotes(notes.filter((note) => note.id !== id));
    }
  };

  const handleDownloadNote = (note) => {
    const element = document.createElement("a");
    const file = new Blob([`# ${note.title}\n\n${note.content}`], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${note.title.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDuplicateNote = (note) => {
    const duplicatedNote = {
      ...note,
      id: Date.now(),
      title: `${note.title} (Copy)`,
      date: new Date().toISOString(),
    };
    setNotes([duplicatedNote, ...notes]);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Your Notes
            </h2>
            <Link
              to="/notes/create"
              className="flex items-center text-sm px-4 py-2 bg-primary text-white font-medium rounded transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus size={20} className="mr-2" />
              New Note
            </Link>
          </div>

          <SearchBar value={searchTerm} onChange={setSearchTerm} />

          {filteredNotes.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-zinc-950 rounded-2xl shadow-sm border border-gray-100 dark:border-black transition-all duration-300">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg
                  className="w-20 h-20 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                {notes.length === 0
                  ? "You don't have any notes yet. Create your first note!"
                  : "No notes match your search."}
              </p>
              {notes.length === 0 && (
                <Link
                  to="/notes/create"
                  className="px-5 py-2.5 w-60 mx-auto flex items-center justify-center gap-2 bg-primary text-sm text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Plus />
                  Create Your First Note
                </Link>
              )}
            </div>
          ) : (
            <div
              className={`grid gap-5 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={handleDeleteNote}
                  onDownload={handleDownloadNote}
                  onDuplicate={handleDuplicateNote}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
