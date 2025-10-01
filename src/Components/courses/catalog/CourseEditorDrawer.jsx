import React, { useEffect, useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function CourseEditorDrawer({ open, onClose, onSave, course }) {
  const { colors } = useTheme();

  const [form, setForm] = useState(
    course || {
      title: "",
      slug: "",
      level: "beginner",
      isPaid: false,
      priceCents: 0,
      summary: "",
    }
  );

  useEffect(
    () =>
      setForm(
        course || {
          title: "",
          slug: "",
          level: "beginner",
          isPaid: false,
          priceCents: 0,
          summary: "",
        }
      ),
    [course]
  );

  if (!open) return null;
  const patch = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60" onClick={onClose} />
      <div
        className="w-full max-w-md h-full p-5 overflow-y-auto"
        style={{ backgroundColor: colors.bg2, color: colors.text }}
      >
        <h3 className="text-lg font-semibold mb-1">
          {form?.id ? "Edit" : "Add"} Course
        </h3>
        <div className="space-y-3 mt-4">
          <label className="block text-sm">
            <span className="block text-xs mb-1" style={{ color: colors.text2 }}>
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
          <label className="block text-sm">
            <span className="block text-xs mb-1" style={{ color: colors.text2 }}>
              Slug
            </span>
            <input
              className="w-full rounded-xl border px-3 py-2"
              style={{
                borderColor: colors.ring,
                backgroundColor: colors.hover,
                color: colors.text,
              }}
              value={form.slug}
              onChange={(e) => patch("slug", e.target.value)}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="block text-xs mb-1" style={{ color: colors.text2 }}>
                Level
              </span>
              <select
                className="w-full rounded-xl border px-3 py-2"
                style={{
                  borderColor: colors.ring,
                  backgroundColor: colors.hover,
                  color: colors.text,
                }}
                value={form.level}
                onChange={(e) => patch("level", e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="block text-xs mb-1" style={{ color: colors.text2 }}>
                Access
              </span>
              <select
                className="w-full rounded-xl border px-3 py-2"
                style={{
                  borderColor: colors.ring,
                  backgroundColor: colors.hover,
                  color: colors.text,
                }}
                value={form.isPaid ? "paid" : "free"}
                onChange={(e) => patch("isPaid", e.target.value === "paid")}
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </label>
          </div>
          {form.isPaid && (
            <label className="block text-sm">
              <span className="block text-xs mb-1" style={{ color: colors.text2 }}>
                Price (USD)
              </span>
              <input
                type="number"
                min={0}
                step={1}
                className="w-full rounded-xl border px-3 py-2"
                style={{
                  borderColor: colors.ring,
                  backgroundColor: colors.hover,
                  color: colors.text,
                }}
                value={(form.priceCents || 0) / 100}
                onChange={(e) =>
                  patch(
                    "priceCents",
                    Math.max(0, Math.round(Number(e.target.value || 0) * 100))
                  )
                }
              />
            </label>
          )}
          <label className="block text-sm">
            <span className="block text-xs mb-1" style={{ color: colors.text2 }}>
              Summary
            </span>
            <textarea
              rows={3}
              className="w-full rounded-xl border px-3 py-2"
              style={{
                borderColor: colors.ring,
                backgroundColor: colors.hover,
                color: colors.text,
              }}
              value={form.summary}
              onChange={(e) => patch("summary", e.target.value)}
            />
          </label>
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
              borderColor: colors.accent,
              backgroundColor: colors.accent + "26",
              color: colors.accent,
            }}
            onClick={() => onSave(form)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
