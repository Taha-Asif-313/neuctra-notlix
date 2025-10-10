import React, { useState, useRef, useEffect } from "react";
import {
  Save,
  Eye,
  EyeOff,
  Download,
  Upload,
  FileText,
  Trash2,
  Ellipsis,
  Zap,
  Sparkles,
  Type,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  Palette,
  Layout,
  Settings,
} from "lucide-react";

const RichTextEditor = ({ content = "<p><br></p>", setContent }) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isQuillLoaded, setIsQuillLoaded] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [isTyping, setIsTyping] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  // Auto-detect mobile and auto-save
  useEffect(() => {
    const checkMobile = () => {
      setMobileView(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (content.trim()) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
        setLastSaved(new Date());
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [content]);

  // Custom toolbar configuration (unchanged)
  const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
    ["clean"],
  ];

  // Load Quill dynamically (unchanged)
  useEffect(() => {
    const loadQuill = async () => {
      if (typeof window !== "undefined" && !window.Quill) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/quill/quill.snow.min.css";
        document.head.appendChild(link);

        const script = document.createElement("script");
        script.src = "/quill/quill.min.js";
        script.onload = () => {
          setIsQuillLoaded(true);
        };
        document.head.appendChild(script);
      } else if (window.Quill) {
        setIsQuillLoaded(true);
      }
    };

    loadQuill();
  }, []);

  // Initialize Quill editor when loaded (unchanged)
  useEffect(() => {
    if (isQuillLoaded && editorRef.current && !quillRef.current) {
      const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = () => {
          const file = input.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const imageUrl = e.target.result;
              const quill = quillRef.current;
              const range = quill.getSelection();
              if (range) {
                quill.insertEmbed(range.index, "image", imageUrl);
              }
            };
            reader.readAsDataURL(file);
          }
        };
      };

      const quill = new window.Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: imageHandler,
              clean: () => {
                const range = quill.getSelection();
                if (range) {
                  quill.removeFormat(range.index, range.length);
                }
              },
            },
          },
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false,
          },
        },
        formats: [
          "header",
          "font",
          "size",
          "bold",
          "italic",
          "underline",
          "strike",
          "color",
          "background",
          "script",
          "list",
          "bullet",
          "indent",
          "direction",
          "align",
          "blockquote",
          "code-block",
          "link",
          "image",
          "video",
        ],
        placeholder: "Start writing something amazing...",
      });

      if (content) {
        quill.root.innerHTML = content;
        updateCounts(quill.getText());
      }

      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        if (setContent) {
          setContent(html);
        }
        updateCounts(quill.getText());
      });

      quillRef.current = quill;
    }
  }, [isQuillLoaded]);

  // Update content when prop changes (unchanged)
  useEffect(() => {
    if (quillRef.current && content !== undefined) {
      const currentContent = quillRef.current.root.innerHTML;
      if (currentContent !== content) {
        quillRef.current.root.innerHTML = content;
        updateCounts(quillRef.current.getText());
      }
    }
  }, [content]);

  // Update word and character counts (unchanged)
  const updateCounts = (text) => {
    const cleanText = text.trim();
    const words = cleanText.split(/\s+/).filter((word) => word.length > 0);
    setWordCount(cleanText === "" ? 0 : words.length);
    setCharCount(text.length);
  };

  // All action functions remain exactly the same
  const saveContent = () => {
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `document_${new Date().toISOString().split("T")[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadContent = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".html,.txt";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newContent = event.target.result;
          if (setContent) {
            setContent(newContent);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const clearContent = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all content? This action cannot be undone."
      )
    ) {
      const emptyContent = "<p><br></p>";
      if (setContent) {
        setContent(emptyContent);
      }
    }
  };

  const exportAsText = () => {
    const plainText = quillRef.current?.getText() || "";
    const blob = new Blob([plainText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `document_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="w-full h-full bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Mobile Header */}
      {mobileView && (
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg border-b border-gray-200/60 dark:border-zinc-700/60 safe-area-top">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-xl bg-gradient-to-br from-primary to-amber-500 p-2">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800 dark:text-white">
                  Neuctra Editor
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {wordCount} words • {charCount} chars
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isTyping && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-primary">
                    Saving...
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Desktop Header */}
      {!mobileView && (
        <div className="bg-white dark:bg-zinc-800 rounded-t-2xl shadow-lg border border-gray-200 dark:border-zinc-700">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-600">
            <div className="flex items-center justify-center w-full gap-4">
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:shadow-lg transition-all"
                >
                  {isPreviewMode ? <EyeOff size={18} /> : <Eye size={18} />}
                  <span>{isPreviewMode ? "Edit" : "Preview"}</span>
                </button>

                <button
                  onClick={saveContent}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors"
                >
                  <Download size={18} />
                  <span>Export HTML</span>
                </button>

                <button
                  onClick={exportAsText}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  <FileText size={18} />
                  <span>Export Text</span>
                </button>

                <button
                  onClick={loadContent}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                >
                  <Upload size={18} />
                  <span>Import</span>
                </button>

                <button
                  onClick={clearContent}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor Container */}
      <div
        className={`bg-white dark:bg-zinc-800 ${
          !mobileView
            ? "rounded-b-2xl shadow-lg border border-gray-200 dark:border-zinc-700 border-t-0"
            : ""
        }`}
      >
        <div
          className={
            mobileView ? "min-h-[70vh] safe-area-padding" : "min-h-[500px]"
          }
        >
          {!isQuillLoaded ? (
            <div className="min-h-[500px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">
                  Loading editor...
                </p>
              </div>
            </div>
          ) : (
            <div
              ref={editorRef}
              className="rich-text-editor"
              style={{
                minHeight: mobileView ? "60vh" : "500px",
                display: isQuillLoaded ? "block" : "none",
              }}
            />
          )}
        </div>
      </div>



      {/* Custom Styles for Quill */}
      <style jsx>{`
        .rich-text-editor {
          font-size: 16px !important;
          line-height: 1.6 !important;
        }

        .ql-editor {
          font-size: 16px !important;
          line-height: 1.6 !important;
          color: #000000 !important;
          padding: ${mobileView ? "20px 16px" : "24px"} !important;
        }

        .ql-editor h1 {
          font-size: 2em !important;
          font-weight: bold !important;
          margin-bottom: 0.5em !important;
        }

        .ql-editor h2 {
          font-size: 1.5em !important;
          font-weight: bold !important;
          margin-bottom: 0.5em !important;
        }

        .ql-editor h3 {
          font-size: 1.2em !important;
          font-weight: bold !important;
          margin-bottom: 0.5em !important;
        }

        .ql-editor blockquote {
          border-left: 4px solid #e5e7eb !important;
          margin: 1em 0 !important;
          padding-left: 1em !important;
          color: #6b7280 !important;
        }

        .ql-editor code {
          background-color: #f3f4f6 !important;
          padding: 0.2em 0.4em !important;
          border-radius: 0.25em !important;
          font-family: "Courier New", monospace !important;
        }

        .ql-editor pre {
          background-color: #1f2937 !important;
          color: #f9fafb !important;
          padding: 1em !important;
          border-radius: 0.5em !important;
          overflow-x: auto !important;
        }

        .ql-toolbar.ql-snow {
          border-top: none !important;
          border-left: none !important;
          border-right: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          padding: ${mobileView ? "8px 12px" : "12px 20px"} !important;
          background-color: #ffffff !important;
        }

        .ql-container.ql-snow {
          border: none !important;
          font-size: 16px !important;
        }

        .ql-editor.ql-blank::before {
          color: #9ca3af !important;
          font-style: italic !important;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .ql-toolbar .ql-formats {
            margin-right: 8px !important;
          }

          .ql-toolbar button {
            padding: 6px !important;
            margin: 2px !important;
          }
        }

        /* Dark mode support */
        .dark .ql-snow .ql-stroke {
          stroke: #d1d5db !important;
        }

        .dark .ql-snow .ql-fill {
          fill: #d1d5db !important;
        }

        .dark .ql-snow .ql-picker {
          color: #d1d5db !important;
        }

        .dark .ql-snow .ql-picker-options {
          background-color: #374151 !important;
          border-color: #4b5563 !important;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
