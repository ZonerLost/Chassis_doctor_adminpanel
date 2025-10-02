import React, { useEffect, useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function PricingEditorDrawer({ open, onClose, onSave, row }) {
  const { colors } = useTheme();
  const [form, setForm] = useState(row || { isPaid: false, priceCents: 0 });
  useEffect(() => setForm(row || { isPaid: false, priceCents: 0 }), [row]);
  if (!open) return null;
  const patch = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60" onClick={onClose} />
      <div
        className="w-full max-w-md h-full p-5 overflow-y-auto"
        style={{ backgroundColor: colors.bg2, color: colors.text }}
      >
        <h3 className="text-lg font-semibold mb-1">Pricing & Access</h3>
        <div className="space-y-3 mt-4">
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
          {form.isPaid && (
            <label className="block text-sm">
              <span className="block text-xs mb-1" style={{ color: colors.text2 }}>
                Price (USD)
              </span>
              <input
                type="number"
                min={0}
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
                    Math.round(Math.max(0, Number(e.target.value || 0)) * 100)
                  )
                }
              />
            </label>
          )}
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
