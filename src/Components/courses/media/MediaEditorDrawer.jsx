import React, { useEffect, useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function MediaEditorDrawer({ open, onClose, onSave, asset }) {
  const { colors } = useTheme();
  const [form, setForm] = useState(asset || { title: "", type: "pdf", url: "" });

  useEffect(() => {
    setForm(asset || { title: "", type: "pdf", url: "" });
  }, [asset]);

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
          {form?.id ? "Edit" : "Add"} Media
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
              Type
            </span>
            <select
              className="w-full rounded-xl border px-3 py-2"
              style={{
                borderColor: colors.ring,
                backgroundColor: colors.hover,
                color: colors.text,
              }}
              value={form.type}
              onChange={(e) => patch("type", e.target.value)}
            >
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
              <option value="image">Image</option>
            </select>
          </label>

          <label className="block text-sm">
            <span className="block text-xs mb-1" style={{ color: colors.text2 }}>
              URL
            </span>
            <input
              className="w-full rounded-xl border px-3 py-2"
              style={{
                borderColor: colors.ring,
                backgroundColor: colors.hover,
                color: colors.text,
              }}
              value={form.url}
              onChange={(e) => patch("url", e.target.value)}
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
