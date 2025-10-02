import React, { useEffect, useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function TopicEditorDrawer({ open, onClose, onSave, topic }) {
  const { colors } = useTheme();
  const [form, setForm] = useState(topic || { name: "", order: 1 });

  useEffect(() => setForm(topic || { name: "", order: 1 }), [topic]);
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
          {form?.id ? "Edit" : "Add"} Topic
        </h3>
        <div className="space-y-3 mt-4">
          <label className="block text-sm">
            <span
              className="block text-xs mb-1"
              style={{ color: colors.text2 }}
            >
              Name
            </span>
            <input
              className="w-full rounded-xl border px-3 py-2"
              style={{
                borderColor: colors.ring,
                backgroundColor: colors.hover,
                color: colors.text,
              }}
              value={form.name}
              onChange={(e) => patch("name", e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span
              className="block text-xs mb-1"
              style={{ color: colors.text2 }}
            >
              Order
            </span>
            <input
              type="number"
              min={1}
              className="w-full rounded-xl border px-3 py-2"
              style={{
                borderColor: colors.ring,
                backgroundColor: colors.hover,
                color: colors.text,
              }}
              value={form.order}
              onChange={(e) => patch("order", Number(e.target.value || 1))}
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
