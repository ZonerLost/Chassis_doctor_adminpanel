import React, { useEffect, useState } from "react";
import { COLORS } from "../../ui/shared/theme";

export default function SymptomEditorDrawer({
  open,
  onClose,
  onSave,
  symptom,
}) {
  const [form, setForm] = useState(symptom || { name: "", description: "" });
  useEffect(() => setForm(symptom || { name: "", description: "" }), [symptom]);
  if (!open) return null;
  const patch = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60" onClick={onClose} />
      <div
        className="w-full max-w-md h-full p-5 overflow-y-auto"
        style={{ backgroundColor: COLORS.bg2, color: COLORS.text }}
      >
        <h3 className="text-lg font-semibold mb-1">
          {form?.id ? "Edit" : "Add"} Symptom
        </h3>
        <div className="space-y-3 mt-4">
          <label className="block text-sm">
            <span
              className="block text-xs mb-1"
              style={{ color: COLORS.text2 }}
            >
              Name
            </span>
            <input
              className="w-full rounded-xl border px-3 py-2"
              style={{
                borderColor: COLORS.ring,
                backgroundColor: COLORS.hover,
                color: COLORS.text,
              }}
              value={form.name}
              onChange={(e) => patch("name", e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span
              className="block text-xs mb-1"
              style={{ color: COLORS.text2 }}
            >
              Description
            </span>
            <textarea
              className="w-full rounded-xl border px-3 py-2"
              rows={3}
              style={{
                borderColor: COLORS.ring,
                backgroundColor: COLORS.hover,
                color: COLORS.text,
              }}
              value={form.description}
              onChange={(e) => patch("description", e.target.value)}
            />
          </label>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            className="px-4 py-2 rounded-xl border"
            style={{
              borderColor: COLORS.ring,
              backgroundColor: COLORS.hover,
              color: COLORS.text2,
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
            onClick={() => onSave(form)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
