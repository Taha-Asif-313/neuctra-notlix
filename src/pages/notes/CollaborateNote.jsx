import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { decryptData } from "../../utils/cryptoUtils";
import { getSingleNote, updateNote } from "../../authix/authixinit";
import RichTextEditor from "../../components/RichTextEditor";
import { Save, Loader2, Share2, Users, Clock } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

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
        toast.error("Invalid collaboration link.");
        setLoading(false);
        return;
      }

      const { userId, noteId } = decrypted;

      try {
        const response = await getSingleNote(userId, noteId);

        if (response?.success && response?.data) {
          setNote({ ...response.data, userId, noteId });
          setTitle(response.data.title);
          setContent(response.data.content);
          setLastSaved(new Date(response.data.date));

          // delay to let editor mount
          setTimeout(() => {
            editorRef.current?.setEditorContent(response.data.content);
          }, 100);

          toast.success("Shared note loaded successfully!");
        } else {
          toast.error("Note not found or access denied.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error loading note.");
      } finally {
        setLoading(false);
      }
    };

    decryptAndFetch();
  }, [token]);

  const handleSave = async () => {
    if (!note) return;
    setSaving(true);

    const savingToast = toast.loading("Saving changes...");

    try {
      const response = await updateNote(note.userId, note.noteId, {
        title, // Keep the original title
        content,
        date: new Date().toISOString(),
      });

      if (response?.success) {
        setLastSaved(new Date());
        toast.success(response?.message || "Note saved successfully!");
      } else {
        toast.error(response?.message || "Failed to save note.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving note.");
    } finally {
      toast.dismiss(savingToast);
      setSaving(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 transition-colors p-4">
        <div className="text-center">
          <div className="relative mb-10">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-300 font-medium text-sm">
              Loading shared note
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              Preparing your collaboration workspace...
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 transition-colors duration-300 pb-10">
    
      
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-zinc-800/50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-4">
          {/* Main Row - Title and Button in same line */}
          <div className="flex items-center justify-between gap-3 w-full">
            {/* Left Section - Title and Icon */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="p-2 bg-primary/10 rounded-xl flex-shrink-0">
                  <Share2 className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white truncate">
                    {title || "Untitled Note"}
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                    <Users size={12} />
                    Shared note access
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section - Save Button */}
            <div className="flex-shrink-0">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 active:scale-95 transition-all duration-200 shadow-md shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span className="inline">Save</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto mt-2 max-sm:px-3">
        <div className="shadow-2xl shadow-black/5 overflow-hidden transition-all duration-300 hover:shadow-3xl rounded-2xl">

          {/* Rich Text Editor - Content editing only */}
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