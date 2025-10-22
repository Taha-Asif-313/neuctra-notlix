import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { decryptData } from "../../utils/cryptoUtils";
import { getSingleNote } from "../../authix/authixinit";
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

const SharedNotePreview = () => {
  const { token } = useParams();
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [copied, setCopied] = useState(false);

  // 🌓 Toggle theme
  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
  };

  // 📋 Copy link to clipboard
  // 📋 Copy link to clipboard (fixed version)
  const copyLink = async () => {
    try {
      const link = window.location.href;

      if (navigator.clipboard && window.isSecureContext) {
        // ✅ Modern secure way
        await navigator.clipboard.writeText(link);
      } else {
        // ⚙️ Fallback for non-HTTPS or older browsers
        const textarea = document.createElement("textarea");
        textarea.value = link;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopied(true);
      toast.success("🔗 Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy link 😢");
    }
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
          toast.success("✅ Shared note loaded!");
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
  if (loading) return <CustomLoader message="Loading Note Please Wait" />

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
      {/* 🧠 Auto-generated SEO Metadata */}
      <Metadata
        title={`${title || "Shared Note"} | Notexa`}
        description={(() => {
          // 🧹 Step 1: Remove HTML tags from content
          const cleanText =
            content
              ?.replace(/<[^>]*>/g, " ") // remove HTML tags
              ?.replace(/\s+/g, " ") // collapse whitespace
              ?.trim() || "";

          // 🪄 Step 2: Analyze and make human-readable summary
          if (!cleanText) return "View this shared note securely on Notexa.";

          // 🧠 Step 3: Smart summary logic
          const sentences = cleanText.split(/[.!?]\s/);
          let summary = "";

          if (sentences.length > 1) {
            // take first 1–2 meaningful sentences
            summary = sentences.slice(0, 2).join(". ");
          } else {
            summary = cleanText.slice(0, 160);
          }

          // 🧱 Step 4: Trim long content
          if (summary.length > 160) summary = summary.slice(0, 157) + "...";

          return summary || "A shared note available for viewing on Notexa.";
        })()}
        keywords="shared note, Notexa, collaboration, real-time notes, secure sharing"
        image="/collab-preview.png"
      />

      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300 pb-10">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-gray-200/50 dark:border-zinc-700/50 supports-backdrop-blur:bg-white/60 dark:supports-backdrop-blur:bg-black/60 transition-all duration-300">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                {/* Copy Link Button */}
                <button
                  onClick={copyLink}
                  className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all duration-200 group"
                  title="Copy link to clipboard"
                >
                  {copied ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  )}
                </button>

                {/* Theme Toggle */}
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
        <main className="max-w-4xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border dark:text-white border-gray-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
            <article
              className="prose prose-zinc dark:prose-invert max-w-none p-6 sm:p-8 lg:p-10 min-h-[50vh] leading-relaxed
              prose-headings:font-semibold
              prose-h1:text-3xl sm:prose-h1:text-4xl
              prose-h2:text-2xl sm:prose-h2:text-3xl
              prose-h3:text-xl sm:prose-h3:text-2xl
              prose-p:text-gray-700 dark:prose-p:text-gray-300
              prose-a:text-primary hover:prose-a:text-primary/80
              prose-strong:text-gray-900 dark:prose-strong:text-white
              prose-code:bg-gray-100 dark:prose-code:bg-zinc-700
              prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
              prose-pre:bg-gray-900 prose-pre:text-gray-100
              prose-blockquote:border-primary prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-zinc-700/50
              prose-ul:marker:text-gray-400 dark:prose-ul:marker:text-gray-500
              prose-ol:marker:text-gray-400 dark:prose-ol:marker:text-gray-500"
              dangerouslySetInnerHTML={{ __html: content }}
            />
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
