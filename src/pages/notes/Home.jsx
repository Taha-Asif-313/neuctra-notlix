import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import NoteCard from "../../components/NoteCard";
import SearchBar from "../../components/SearchBar";
import { useAppContext } from "../../context/useAppContext";
import { deleteNote, getAllNotes } from "../../authix/authixinit";

const Home = () => {
  const { notes, setNotes, user } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(false);
  const hasFetched = useRef(false); // ✅ Prevents infinite re-fetch loop

  // 🔹 Filter notes by title/content
  const filteredNotes = useMemo(() => {
    if (!searchTerm) return notes;
    const lower = searchTerm.toLowerCase();
    return notes.filter(
      (note) =>
        note.title?.toLowerCase().includes(lower) ||
        note.content?.toLowerCase().includes(lower)
    );
  }, [notes, searchTerm]);

  // 🔹 Fetch user notes (only once)
  useEffect(() => {
    if (!user?.id || hasFetched.current) return;
    hasFetched.current = true;

    const fetchNotes = async () => {
      setLoading(true);
      try {
        const fetchedNotes = await getAllNotes(user.id);
        if (Array.isArray(fetchedNotes)) {
          setNotes(fetchedNotes);
        } else {
          console.warn("⚠️ Unexpected notes format:", fetchedNotes);
          setNotes([]);
        }
      } catch (error) {
        console.error("❌ Failed to fetch notes:", error);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user?.id]); // ✅ Only depends on user.id

  // 🔹 Delete note
  const handleDeleteNote = async (noteId) => {
    if (!user?.id || !noteId) return;
    try {
      setLoading(true);
      await deleteNote(user.id, noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch (error) {
      console.error("❌ Delete failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Download note
  const handleDownloadNote = (note) => {
    const blob = new Blob([`# ${note.title}\n\n${note.content}`], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${note.title.replace(/\s+/g, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 🔹 Duplicate locally
  const handleDuplicateNote = (note) => {
    const duplicatedNote = {
      ...note,
      id: Date.now().toString(),
      title: `${note.title} (Copy)`,
      date: new Date().toISOString(),
    };
    setNotes((prev) => [duplicatedNote, ...prev]);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row gap-8">
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Your Notes
            </h2>

            <Link
              to="/notes/create"
              className="flex items-center text-sm px-4 py-2 bg-primary text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus size={20} className="mr-2" />
              New Note
            </Link>
          </div>

          <SearchBar value={searchTerm} onChange={setSearchTerm} />

          {/* Empty State */}
          {filteredNotes.length === 0 && !loading ? (
            <div className="text-center py-16 bg-white dark:bg-zinc-950 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-all duration-300">
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
              <p className="text-gray-500 dark:text-gray-400 text-sm px-10 mb-4">
                {notes.length === 0
                  ? "You don't have any notes yet. Create your first note!"
                  : "No notes match your search."}
              </p>
              {notes.length === 0 && (
                <Link
                  to="/notes/create"
                  className="px-5 py-2.5 text-sm w-60 mx-auto flex items-center justify-center gap-2 bg-primary font-bold text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
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

          {loading && (
            <div className="text-center text-sm text-gray-500 mt-4">
              Loading notes...
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
