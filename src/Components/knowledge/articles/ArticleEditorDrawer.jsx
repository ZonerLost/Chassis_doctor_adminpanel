import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function ArticleEditorDrawer({
  open,
  onClose,
  onSave,
  article,
  categories,
}) {
  const { colors } = useTheme();

  const empty = useMemo(
    () => ({
      title: "",
      categoryId: categories?.[0]?.id,
      tags: [],
      status: "draft",
      publishAt: "",
      content: "",
    }),
    [categories]
  );
  const [form, setForm] = useState(article || empty);
  useEffect(
    () => setForm(article || empty),
    [article, categories?.length, empty]
  );
  const patch = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // naive tags parsing
  const tagsText = useMemo(() => (form.tags || []).join(", "), [form.tags]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60" onClick={onClose} />
      <div
        className="w-full max-w-xl h-full p-5 overflow-y-auto"
        style={{ backgroundColor: colors.bg2, color: colors.text }}
      >
        <h3 className="text-lg font-semibold mb-1">
          {form?.id ? "Edit" : "Add"} Article
        </h3>
        <p className="text-xs mb-4" style={{ color: colors.text2 }}>
          WYSIWYG (basic) — uses HTML content. Paste text/HTML; preview below.
        </p>

        <div className="space-y-3">
          <label className="block text-sm">
            <span
              className="block text-xs mb-1"
              style={{ color: colors.text2 }}
            >
              Title
            </span>
            <input
              className="w-full rounded-xl border px-3 py-2"
              style={{
                borderColor: colors.ring,
                backgroundColor: colors.hover,
                color: colors.text,
              }}
              value={form.title}
              onChange={(e) => patch("title", e.target.value)}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span
                className="block text-xs mb-1"
                style={{ color: colors.text2 }}
              >
                Category
              </span>
              <select
                className="w-full rounded-xl border px-3 py-2"
                style={{
                  borderColor: colors.ring,
                  backgroundColor: colors.hover,
                  color: colors.text,
                }}
                value={form.categoryId}
                onChange={(e) => patch("categoryId", e.target.value)}
              >
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span
                className="block text-xs mb-1"
                style={{ color: colors.text2 }}
              >
                Status
              </span>
              <select
                className="w-full rounded-xl border px-3 py-2"
                style={{
                  borderColor: colors.ring,
                  backgroundColor: colors.hover,
                  color: colors.text,
                }}
                value={form.status}
                onChange={(e) => patch("status", e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span
                className="block text-xs mb-1"
                style={{ color: colors.text2 }}
              >
                Publish At (optional)
              </span>
              <input
                type="datetime-local"
                className="w-full rounded-xl border px-3 py-2"
                style={{
                  borderColor: colors.ring,
                  backgroundColor: colors.hover,
                  color: colors.text,
                }}
                value={
                  form.publishAt
                    ? new Date(form.publishAt).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  patch(
                    "publishAt",
                    e.target.value ? new Date(e.target.value).getTime() : ""
                  )
                }
              />
            </label>
            <label className="block text-sm">
              <span
                className="block text-xs mb-1"
                style={{ color: colors.text2 }}
              >
                Tags (comma separated)
              </span>
              <input
                className="w-full rounded-xl border px-3 py-2"
                style={{
                  borderColor: colors.ring,
                  backgroundColor: colors.hover,
                  color: colors.text,
                }}
                value={tagsText}
                onChange={(e) =>
                  patch(
                    "tags",
                    e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                  )
                }
              />
            </label>
          </div>

          {/* Basic WYSIWYG (textarea) */}
          <label className="block text-sm">
            <span
              className="block text-xs mb-1"
              style={{ color: colors.text2 }}
            >
              Content (HTML allowed)
            </span>
            <textarea
              rows={10}
              className="w-full rounded-xl border px-3 py-2 font-mono text-xs"
              style={{
                borderColor: colors.ring,
                backgroundColor: colors.hover,
                color: colors.text,
              }}
              value={form.content}
              onChange={(e) => patch("content", e.target.value)}
            />
          </label>

          {/* Preview */}
          <div
            className="rounded-xl border p-3 text-sm"
            style={{ borderColor: colors.ring, backgroundColor: colors.hover }}
          >
            <div className="text-xs mb-2" style={{ color: colors.text2 }}>
              Preview
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: form.content || "<em>No content</em>",
              }}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            className="px-4 py-2 rounded-xl border"
            style={{
              borderColor: colors.ring,
              backgroundColor: colors.hover,
              color: colors.text2,
            }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-xl border"
            style={{
              borderColor: "#D4AF37",
              backgroundColor: "#D4AF3726",
              color: "#D4AF37",
            }}
            onClick={() =>
              onSave(form, { message: form?.id ? "Edited" : "Created" })
            }
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
