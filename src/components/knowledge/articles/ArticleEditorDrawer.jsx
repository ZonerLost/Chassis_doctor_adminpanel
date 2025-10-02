import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MdClose } from "react-icons/md";

const COLORS = {
  bg2: "#12131A",
  card: "#161821",
  text: "#E6E8F0",
  text2: "#A3A7B7",
  ring: "rgba(110,86,207,0.25)",
  gold: "#D4AF37",
  purple: "#6E56CF",
};

export default function ArticleEditorDrawer({
  open,
  initial,
  onClose,
  onSave,
  categories = [],
}) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    title: "",
    categoryId: "",
    content: "",
    tags: [],
    status: "draft",
  });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    setForm({
      title: initial?.title || "",
      categoryId: initial?.categoryId || "",
      content: initial?.content || "",
      tags: initial?.tags || [],
      status: initial?.status || "draft",
    });
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);

  const submit = (e) => {
    e?.preventDefault?.();
    if (!form.title.trim() || !form.content.trim()) return;
    onSave?.({
      ...form,
      id: initial?.id || `art_${Date.now()}`,
      updatedAt: new Date().toISOString(),
    });
  };

  if (!open || !mounted) return null;

  // button sizing (added so footer renders correctly)
  const btnHeight = "44px";
  const btnWidth = "160px";
  const btnRadius = "8px";

  return createPortal(
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md rounded-xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: COLORS.card, color: COLORS.text }}
        role="dialog"
        aria-modal="true"
      >
        <header
          className="flex items-start justify-between px-6 py-4"
          style={{ borderBottom: `1px solid ${COLORS.ring}` }}
        >
          <div>
            <h3 className="text-lg font-semibold">
              {initial ? "Edit Article" : "Add Article"}
            </h3>
            <div className="text-xs mt-1" style={{ color: COLORS.text2 }}>
              Create and manage knowledge base content
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-md"
            style={{ color: COLORS.text2, background: "transparent" }}
          >
            <MdClose size={20} />
          </button>
        </header>

        <form
          onSubmit={submit}
          className="p-6 max-h-[70vh] overflow-y-auto space-y-4"
        >
          <div>
            <label className="text-sm mb-1 block">Title</label>
            <input
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              className="mt-1 w-full rounded-lg px-3 py-2 text-sm"
              style={{
                backgroundColor: COLORS.bg2,
                color: COLORS.text,
                border: `1px solid ${COLORS.ring}`,
              }}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value }))
                }
                className="mt-1 w-full rounded-lg px-2 h-10 text-sm"
                style={{
                  backgroundColor: COLORS.bg2,
                  color: COLORS.text,
                  border: `1px solid ${COLORS.ring}`,
                }}
              >
                {(categories.length
                  ? categories
                  : ["Technical", "Driving", "Rules"]
                ).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm mb-1 block">Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((p) => ({ ...p, status: e.target.value }))
                }
                className="mt-1 w-full rounded-lg px-2 h-10 text-sm"
                style={{
                  backgroundColor: COLORS.bg2,
                  color: COLORS.text,
                  border: `1px solid ${COLORS.ring}`,
                }}
              >
                <option>Draft</option>
                <option>Published</option>
                <option>Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm mb-1 block">Author</label>
            <input
              value={form.author}
              onChange={(e) =>
                setForm((p) => ({ ...p, author: e.target.value }))
              }
              className="mt-1 w-full rounded-lg px-3 py-2 text-sm"
              style={{
                backgroundColor: COLORS.bg2,
                color: COLORS.text,
                border: `1px solid ${COLORS.ring}`,
              }}
            />
          </div>

          <div>
            <label className="text-sm mb-1 block">Summary</label>
            <textarea
              value={form.summary}
              onChange={(e) =>
                setForm((p) => ({ ...p, summary: e.target.value }))
              }
              className="mt-1 w-full rounded-lg px-3 py-2 text-sm h-20"
              style={{
                backgroundColor: COLORS.bg2,
                color: COLORS.text,
                border: `1px solid ${COLORS.ring}`,
              }}
            />
          </div>

          <div>
            <label className="text-sm mb-1 block">Content</label>
            <textarea
              value={form.content}
              onChange={(e) =>
                setForm((p) => ({ ...p, content: e.target.value }))
              }
              className="mt-1 w-full rounded-lg px-3 py-2 text-sm h-40"
              style={{
                backgroundColor: COLORS.bg2,
                color: COLORS.text,
                border: `1px solid ${COLORS.ring}`,
              }}
            />
          </div>
        </form>

        <footer
          className="flex items-center justify-center gap-4 px-6 py-4"
          style={{ borderTop: `1px solid ${COLORS.ring}` }}
        >
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium"
            style={{
              height: btnHeight,
              minWidth: btnWidth,
              borderRadius: btnRadius,
              border: `1px solid ${COLORS.ring}`,
              backgroundColor: COLORS.bg2,
              color: COLORS.text2,
            }}
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="text-sm font-medium"
            style={{
              height: btnHeight,
              minWidth: btnWidth,
              borderRadius: btnRadius,
              border: `1px solid ${COLORS.gold || "#D4AF37"}`,
              backgroundColor: COLORS.gold || "#D4AF37",
              color: "#0B0B0F",
            }}
          >
            Save
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
}
