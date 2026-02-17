import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react"; // ⚡ Add spinner icon
import NoteCard from "../../components/NoteCard";
import SearchBar from "../../components/SearchBar";
import { useAppContext } from "../../context/AppContext";
import { deleteNote, getAllNotes } from "../../utils/authixInit";
import Metadata from "../../MetaData";
import CustomLoader from "../../components/CustomLoader";

const AllNotes = () => {
  const { notes, setNotes, user } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(false);
  const hasFetched = useRef(false);

  // 🔹 Filter notes
  const filteredNotes = useMemo(() => {
    if (!searchTerm) return notes;
    const lower = searchTerm.toLowerCase();
    return notes.filter(
      (note) =>
        note.title?.toLowerCase().includes(lower) ||
        note.content?.toLowerCase().includes(lower)
    );
  }, [notes, searchTerm]);

  // 🔹 Delete note
  const handleDeleteNote = async (noteId) => {
    if (!user?.id || !noteId) return;
    try {
      setLoading(true);
      await deleteNote(user.id, noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch (error) {
      console.error("Delete failed:", error);
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

  // 🔹 Duplicate note
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
    <>
      {/* 🧠 Metadata for SEO & Social */}
      <Metadata
        title="All Notes – Neuctra Notlix | Smart Cloud Note Manager"
        description="Access and manage all your notes in one intelligent workspace. With Neuctra Notlix, you can search, edit, organize, and collaborate effortlessly — powered by AI and the cloud."
        keywords="Neuctra all notes, Notlix dashboard, manage notes, AI note manager, note organization, cloud notes app, collaborative notes, productivity workspace, Neuctra Notes"
        ogTitle="All Notes – Neuctra Notlix | AI Cloud Note Manager"
        ogDescription="Browse, search, and organize your notes in Neuctra Notlix — the AI-powered note manager for seamless productivity and collaboration."
        twitterTitle="All Notes – Neuctra Notlix"
        twitterDescription="View and manage all your Neuctra Notlix notes — smart, secure, and AI-driven for ultimate productivity."
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <main className="flex-1">
         

            <SearchBar value={searchTerm} onChange={setSearchTerm} />

            {/* 🔹 Loading State */}
            {loading ? (
              <CustomLoader message="Loading notes please wait" />
            ) : filteredNotes.length === 0 ? (
              // 🔹 Empty State
              <div className="text-center py-16 bg-white dark:bg-zinc-950 rounded-2xl shadow-sm transition-all duration-300">
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
              // 🔹 Notes Grid
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
    </>
  );
};

export default AllNotes;
