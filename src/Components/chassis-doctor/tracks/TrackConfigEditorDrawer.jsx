import React, { useEffect, useState } from "react";
import { COLORS } from "../../ui/shared/theme";

export default function TrackConfigEditorDrawer({
  open,
  onClose,
  onSave,
  track,
}) {
  const [form, setForm] = useState(
    track || { type: "Oval", surface: "Tarmac", condition: "Dry" }
  );
  useEffect(
    () =>
      setForm(track || { type: "Oval", surface: "Tarmac", condition: "Dry" }),
    [track]
  );
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
          {form?.id ? "Edit" : "Add"} Track Configuration
        </h3>
        <div className="space-y-3 mt-4">
          <label className="block text-sm">
            <span
              className="block text-xs mb-1"
              style={{ color: COLORS.text2 }}
            >
              Type
            </span>
            <input
              className="w-full rounded-xl border px-3 py-2"
              style={{
                borderColor: COLORS.ring,
                backgroundColor: COLORS.hover,
                color: COLORS.text,
              }}
              value={form.type}
              onChange={(e) => patch("type", e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span
              className="block text-xs mb-1"
              style={{ color: COLORS.text2 }}
            >
              Surface
            </span>
            <select
              className="w-full rounded-xl border px-3 py-2"
              style={{
                borderColor: COLORS.ring,
                backgroundColor: COLORS.hover,
                color: COLORS.text,
              }}
              value={form.surface}
              onChange={(e) => patch("surface", e.target.value)}
            >
              <option>Tarmac</option>
              <option>Dirt</option>
            </select>
          </label>
          <label className="block text-sm">
            <span
              className="block text-xs mb-1"
              style={{ color: COLORS.text2 }}
            >
              Condition
            </span>
            <select
              className="w-full rounded-xl border px-3 py-2"
              style={{
                borderColor: COLORS.ring,
                backgroundColor: COLORS.hover,
                color: COLORS.text,
              }}
              value={form.condition}
              onChange={(e) => patch("condition", e.target.value)}
            >
              <option>Dry</option>
              <option>Wet</option>
            </select>
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
