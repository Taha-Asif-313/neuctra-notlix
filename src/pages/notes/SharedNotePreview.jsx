import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { decryptData } from "../../utils/cryptoUtils";
import { getSingleNote } from "../../utils/authixInit";
import {
  Share2,
  Users,
  Clock,
  Moon,
  Sun,
  Copy,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import Metadata from "../../MetaData";
import CustomLoader from "../../components/CustomLoader";
import BlocksPreview from "../../components/TextEditor/previews/BlockPreview";

const SharedNotePreview = () => {
  const { token } = useParams();
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  const [copied, setCopied] = useState(false);

  // 🌓 Toggle theme
  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
  };

  useEffect(() => {
    // Set initial theme
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme ? savedTheme === "dark" : darkMode;
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    const decryptAndFetch = async () => {
      if (!token) {
        toast.error("Invalid shared link.");
        setLoading(false);
        return;
      }

      try {
        const decrypted = decryptData(decodeURIComponent(token));
        if (!decrypted) {
          toast.error("Invalid shared link.");
          setLoading(false);
          return;
        }

        const { userId, noteId, expiry } = decrypted;
        if (!expiry || Date.now() > expiry) {
          setExpired(true);
          setLoading(false);
          return;
        }

        const response = await getSingleNote(userId, noteId);
        if (response?.id) {
          setNote(response);
          setTitle(response.title);
          setContent(response.content);
          toast.success("Shared note loaded!");
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

  // ⏳ Loading screen
  if (loading) return <CustomLoader message="Loading Note Please Wait" />;

  // ⌛ Expired screen
  if (expired)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-950 p-6 transition-colors duration-300">
        <div className="max-w-md space-y-6">
          <div className="relative">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Link Expired
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              This shared note link has expired. Please ask the author to
              generate a new one.
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  // 📝 Main view
  return (
    <>
      {/* 🧠 Auto-Generated SEO Metadata */}
      <Metadata
        title={`${title || "Shared Note"} | Neuctra Notlix`}
        description={
          "View this shared note securely on Neuctra Notlix — your AI-powered cloud workspace for collaboration and creativity."
        }
        keywords="shared note, Neuctra Notlix, AI collaboration, cloud notes, secure sharing, real-time editing, team notes, productivity app"
        ogTitle={`${title || "Shared Note"} | Neuctra Notlix`}
        ogDescription="View and collaborate on this shared note using Neuctra Notlix — the AI-powered cloud platform for smart notes and teamwork."
        twitterTitle={`${title || "Shared Note"} | Neuctra Notlix`}
        twitterDescription="Open and view this shared note securely in Neuctra Notlix — collaborate, comment, and organize smarter with AI."
      />

      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300 pb-10">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-gray-200/50 dark:border-zinc-700/50 supports-backdrop-blur:bg-white/60 dark:supports-backdrop-blur:bg-black/60 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 bg-primary/10 rounded-xl shrink-0">
                  <Share2 className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                    {title || "Untitled Note"}
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <Users size={12} />
                    Read-only shared note
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all duration-200"
                  title={
                    darkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
          {/* Title Input - Modern minimalist */}
          <div className=" dark:text-white">
            <div className="relative space-y-3">
              <h1 className="w-full text-4xl sm:text-5xl font-bold bg-transparent border-none outline-none placeholder-slate-300 dark:placeholder-zinc-700 focus:ring-0 px-1 transition-all">
                {note.title}
              </h1>
              {/* Animated underline */}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
            <BlocksPreview blocks={note.blocks} />
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-xs text-primary font-medium">
                Shared securely • View only
              </span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SharedNotePreview;
