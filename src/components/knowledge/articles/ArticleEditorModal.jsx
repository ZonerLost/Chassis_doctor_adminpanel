import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../../../contexts/ThemeContext";
import { MdClose, MdSave } from "react-icons/md";

export default function ArticleEditorModal({
  isOpen,
  onClose,
  article = null,
  onSave,
  categories = [],
}) {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    title: "",
    category: "Technical",
    status: "Draft",
    author: "",
    summary: "",
    content: "",
  });

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || "",
        category: article.category || "Technical",
        status: article.status || "Draft",
        author: article.author || "",
        summary: article.summary || "",
        content: article.content || "",
      });
    } else {
      setFormData({
        title: "",
        category: "Technical",
        status: "Draft",
        author: "",
        summary: "",
        content: "",
      });
    }
  }, [article, isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    onSave({
      ...formData,
      id: article?.id || Date.now(),
      lastModified: new Date().toISOString(),
      views: article?.views || 0,
    });
    onClose();
  };

  if (!isOpen) return null;

  try {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pb-8">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          style={{
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        />
        <div
          className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
          style={{ backgroundColor: colors.card, color: colors.text }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-6 border-b"
            style={{ borderColor: colors.ring }}
          >
            <div>
              <h2 className="text-xl font-semibold">
                {article ? "Edit Article" : "Add New Article"}
              </h2>
              <p className="text-sm mt-1" style={{ color: colors.text2 }}>
                Create and manage knowledge base content
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-opacity-80 transition-colors"
              style={{ backgroundColor: colors.bg2 }}
            >
              <MdClose size={20} style={{ color: colors.text2 }} />
            </button>
          </div>

          {/* Content with bottom padding */}
          <div className="p-6 pb-8 max-h-[calc(90vh-140px)] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6 pb-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Article Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border text-sm"
                    style={{
                      backgroundColor: colors.bg2,
                      borderColor: colors.ring,
                      color: colors.text,
                    }}
                    placeholder="Enter article title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border text-sm"
                    style={{
                      backgroundColor: colors.bg2,
                      borderColor: colors.ring,
                      color: colors.text,
                    }}
                  >
                    {categories && categories.length > 0 ? (
                      categories.map((cat) => {
                        // support both string categories and { id, name } objects
                        const value =
                          typeof cat === "string" ? cat : cat.id || cat.name;
                        const label =
                          typeof cat === "string"
                            ? cat
                            : cat.name || String(cat);
                        return (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        );
                      })
                    ) : (
                      <>
                        <option value="Technical">Technical</option>
                        <option value="Driving">Driving</option>
                        <option value="Rules">Rules</option>
                        <option value="Strategy">Strategy</option>
                        <option value="History">History</option>
                        <option value="Safety">Safety</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border text-sm"
                    style={{
                      backgroundColor: colors.bg2,
                      borderColor: colors.ring,
                      color: colors.text,
                    }}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        author: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border text-sm"
                    style={{
                      backgroundColor: colors.bg2,
                      borderColor: colors.ring,
                      color: colors.text,
                    }}
                    placeholder="Author name"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Summary
                  </label>
                  <textarea
                    value={formData.summary}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        summary: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border text-sm h-24 resize-none"
                    style={{
                      backgroundColor: colors.bg2,
                      borderColor: colors.ring,
                      color: colors.text,
                    }}
                    placeholder="Brief summary of the article"
                    required
                  />
                </div>

                <div className="md:col-span-2 pb-6">
                  <label className="block text-sm font-medium mb-2">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border text-sm h-64 resize-none"
                    style={{
                      backgroundColor: colors.bg2,
                      borderColor: colors.ring,
                      color: colors.text,
                    }}
                    placeholder="Write the full article content here..."
                    required
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Sticky responsive footer: stacked buttons on mobile, inline on larger screens */}
          <div
            className="sticky bottom-0 z-10"
            style={{ backgroundColor: colors.card }}
          >
            <div style={{ borderTop: `1px solid ${colors.ring}` }}>
              <div className="p-4 px-6 flex flex-col sm:flex-row items-center sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl text-sm font-medium border"
                  style={{
                    borderColor: colors.ring,
                    color: colors.text2,
                    backgroundColor: colors.bg2,
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: colors.accent,
                    color: "#000",
                    minWidth: 140,
                  }}
                >
                  <MdSave size={16} />
                  <span>{article ? "Update Article" : "Create Article"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  } catch (err) {
    // Log and render a non-throwing fallback so the ErrorBoundary isn't triggered
    // This helps avoid the entire app crashing when createPortal or DOM access
    // fails unexpectedly in some environments.
    // Also log a helpful message for debugging.
    console.error("ArticleEditorModal render error:", err);
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="bg-red-600 text-white p-4 rounded">
          Failed to open editor
        </div>
      </div>
    );
  }
}
