import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../../../contexts/ThemeContext";

export default function PricingEditorDrawer({
  open,
  initial,
  onClose,
  onSave,
}) {
  const { colors } = useTheme();
  const [form, setForm] = useState(
    initial || { name: "", price: "", features: [] }
  );
  useEffect(
    () => setForm(initial || { name: "", price: "", features: [] }),
    [initial, open]
  );
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[3000] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/55" onClick={onClose} />
      <div
        className="relative w-full sm:w-[560px] max-w-full rounded-t-xl sm:rounded-xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: colors.card || colors.bg2,
          color: colors.text,
        }}
      >
        <div className="p-4 border-b" style={{ borderColor: colors.ring }}>
          <div className="font-semibold">
            {initial?.id ? "Edit Plan" : "New Plan"}
          </div>
        </div>

        <div className="p-4 space-y-3">
          <input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Name"
            className="w-full rounded-lg px-3 py-2"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
              color: colors.text,
            }}
          />
          <input
            value={form.price}
            onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
            placeholder="Price"
            className="w-full rounded-lg px-3 py-2"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
              color: colors.text,
            }}
          />
          <textarea
            value={(form.features || []).join("\n")}
            onChange={(e) =>
              setForm((p) => ({ ...p, features: e.target.value.split("\n") }))
            }
            rows={4}
            className="w-full rounded-lg px-3 py-2"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
              color: colors.text,
            }}
          />
        </div>

        <div
          className="p-4 border-t flex justify-end gap-2"
          style={{ borderColor: colors.ring }}
        >
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg"
            style={{ backgroundColor: colors.bg2, color: colors.text }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave?.(form);
              onClose?.();
            }}
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: colors.accent, color: colors.bg }}
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
