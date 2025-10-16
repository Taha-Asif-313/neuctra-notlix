import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { decryptData } from "../../utils/cryptoUtils";
import { getSingleNote, updateNote } from "../../authix/authixinit";
import RichTextEditor from "../../components/RichTextEditor";
import { Save, Loader2, Share2, Users, Clock } from "lucide-react";

const CollaborateNote = () => {
  const { token } = useParams();
  const editorRef = useRef();
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    const decryptAndFetch = async () => {
      const decrypted = decryptData(decodeURIComponent(token));
      if (!decrypted) {
        alert("Invalid collaboration link.");
        return;
      }

      const { userId, noteId } = decrypted;
      try {
        const response = await getSingleNote(userId, noteId);
        if (response.success && response.data) {
          setNote({ ...response.data, userId, noteId });
          setTitle(response.data.title);
          setContent(response.data.content);
          setLastSaved(new Date(response.data.date));
          setTimeout(() => {
            editorRef.current?.setEditorContent(response.data.content);
          }, 100);
        } else {
          alert("Note not found or access denied.");
        }
      } catch (err) {
        console.error(err);
        alert("Error loading note.");
      } finally {
        setLoading(false);
      }
    };
    decryptAndFetch();
  }, [token]);

  const handleSave = async () => {
    if (!note) return;
    setSaving(true);
    try {
      await updateNote(note.userId, note.noteId, {
        title,
        content,
        date: new Date().toISOString(),
      });
      setLastSaved(new Date());
    } catch (err) {
      console.error(err);
      alert("Failed to save note.");
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 transition-colors p-4">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-300 font-medium text-lg">Loading shared note</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Preparing your collaboration workspace...</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 transition-colors duration-300 pb-10">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Share2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Collaborative Editing
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Users size={14} />
                  Shared note access
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock size={14} />
                {lastSaved && `Last saved ${formatTime(lastSaved)}`}
              </div>
              
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 active:scale-95 transition-all duration-200 shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed min-w-[140px]"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl shadow-black/5 overflow-hidden transition-all duration-300 hover:shadow-3xl">
          
          {/* Note Header */}
          <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-zinc-800 bg-gradient-to-r from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                Live Collaboration Active
              </div>
              
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                className="w-full text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white bg-transparent border-none focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 resize-none overflow-hidden"
              />
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Real-time updates
                </div>
                <div className="hidden sm:block">•</div>
                <div className="flex items-center gap-2">
                  <Users size={14} />
                  Multiple collaborators
                </div>
              </div>
            </div>
          </div>

          {/* Rich Text Editor */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <RichTextEditor
              ref={editorRef}
              content={content}
              setContent={setContent}
              mobileOptimized={true}
              className="min-h-[500px]"
            />
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
              <p className="text-gray-500 dark:text-gray-400">
                Changes are saved automatically and visible to all collaborators
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {saving ? "Saving..." : "Save Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Save FAB */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 hover:bg-primary/90 active:scale-95 transition-all duration-200 disabled:opacity-70"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save size={20} />
          )}
        </button>
      </div>
    </div>
  );
};

export default CollaborateNote;