import React, { useState, useRef, useEffect } from "react";
import {
  Save,
  Eye,
  EyeOff,
  Download,
  Upload,
  FileText,
  Trash2,
} from "lucide-react";

const RichTextEditor = ({ content = "<p><br></p>", setContent }) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isQuillLoaded, setIsQuillLoaded] = useState(false);
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  // Custom toolbar configuration
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

  // Load Quill dynamically
  useEffect(() => {
    const loadQuill = async () => {
      if (typeof window !== "undefined" && !window.Quill) {
        // Load Quill CSS
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css";
        document.head.appendChild(link);

        // Load Quill JS
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js";
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

  // Initialize Quill editor when loaded
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

      // Set initial content
      if (content) {
        quill.root.innerHTML = content;
        updateCounts(quill.getText());
      }

      // Handle content changes
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

  // Update content when prop changes
  useEffect(() => {
    if (quillRef.current && content !== undefined) {
      const currentContent = quillRef.current.root.innerHTML;
      if (currentContent !== content) {
        quillRef.current.root.innerHTML = content;
        updateCounts(quillRef.current.getText());
      }
    }
  }, [content]);

  // Update word and character counts
  const updateCounts = (text) => {
    const cleanText = text.trim();
    const words = cleanText.split(/\s+/).filter((word) => word.length > 0);
    setWordCount(cleanText === "" ? 0 : words.length);
    setCharCount(text.length);
  };

  // Save content as HTML
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

  // Load content from file
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

  // Clear all content
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

  // Export as plain text
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
    <div className="w-full">
      <div className="max-w-full">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between max-md:flex-col px-6 py-5 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">
                Rich Text Editor
              </h1>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 text-xs mt-4 md:mt-0">
              {/* Stats */}
              <div className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {wordCount} words • {charCount} characters
              </div>

              {/* Dropdown for mobile */}
              <div className="md:hidden relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors flex items-center space-x-2"
                >
                  <span>Actions</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg flex flex-col gap-2 p-2 z-10 border">
                    <button
                      onClick={() => {
                        setIsPreviewMode(!isPreviewMode);
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded text-left"
                    >
                      {isPreviewMode ? <EyeOff size={16} /> : <Eye size={16} />}
                      <span>{isPreviewMode ? "Edit" : "Preview"}</span>
                    </button>

                    <button
                      onClick={() => {
                        saveContent();
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded text-left"
                    >
                      <Download size={16} />
                      <span>Export HTML</span>
                    </button>

                    <button
                      onClick={() => {
                        exportAsText();
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded text-left"
                    >
                      <FileText size={16} />
                      <span>Export Text</span>
                    </button>

                    <button
                      onClick={() => {
                        loadContent();
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded text-left"
                    >
                      <Upload size={16} />
                      <span>Import</span>
                    </button>

                    <button
                      onClick={() => {
                        clearContent();
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded text-left"
                    >
                      <Trash2 size={16} />
                      <span>Clear</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Horizontal buttons for desktop */}
              <div className="hidden md:flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  {isPreviewMode ? <EyeOff size={18} /> : <Eye size={18} />}
                  <span>{isPreviewMode ? "Edit" : "Preview"}</span>
                </button>

                <button
                  onClick={saveContent}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <Download size={18} />
                  <span>Export HTML</span>
                </button>

                <button
                  onClick={exportAsText}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <FileText size={18} />
                  <span>Export Text</span>
                </button>

                <button
                  onClick={loadContent}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                >
                  <Upload size={18} />
                  <span>Import</span>
                </button>

                <button
                  onClick={clearContent}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 size={18} />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Editor Container */}
        <div className="bg-white rounded-b-2xl shadow-lg border-l border-r border-b border-gray-200">
          {isPreviewMode ? (
            // Preview Mode
            <div className="p-8">
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-indigo-600" />
                  Preview
                </h2>
                <div
                  className="border border-gray-200 rounded-lg p-6 bg-gray-50 min-h-[400px]"
                  dangerouslySetInnerHTML={{ __html: content || "<p><br></p>" }}
                />
              </div>
            </div>
          ) : (
            // Editor Mode
            <div className="py-4 px-6">
              {!isQuillLoaded && (
                <div className="min-h-[500px] flex items-center justify-center">
                  <div className="text-gray-500">Loading editor...</div>
                </div>
              )}
              <div
                ref={editorRef}
                style={{
                  minHeight: "500px",
                  fontSize: "16px",
                  lineHeight: "1.6",
                  display: isQuillLoaded ? "block" : "none",
                }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-sm text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg p-4">
          <p>
            💡 <strong>Tips:</strong> Use formatting toolbar • Drag and drop images
            • Rich formatting with keyboard shortcuts • Export in multiple
            formats
          </p>
        </div>
      </div>

      {/* Custom Styles for Quill */}
      <style jsx>{`
        .ql-editor {
          font-size: 16px !important;
          line-height: 1.6 !important;
          color: #374151 !important;
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
          background-color: #f9fafb !important;
        }

        .ql-container.ql-snow {
          border: none !important;
          font-size: 16px !important;
        }

        .ql-editor.ql-blank::before {
          color: #9ca3af !important;
          font-style: italic !important;
        }
      `}</style>
    </div>
  );
};



export default RichTextEditor;