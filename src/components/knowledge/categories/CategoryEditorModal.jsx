import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../../../contexts/ThemeContext";
import { MdClose } from "react-icons/md";

export default function CategoryEditorModal({
  isOpen,
  onClose,
  onSave,
  initial,
}) {
  const { colors } = useTheme();
  const [form, setForm] = useState(initial || { name: "" });
  useEffect(() => setForm(initial || { name: "" }), [initial, isOpen]);
  if (!isOpen) return null;

  const patch = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  try {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
          style={{
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        />
        <div
          className="relative bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          style={{ backgroundColor: colors.card, color: colors.text }}
        >
          <div
            className="flex items-center justify-between p-5 border-b"
            style={{ borderColor: colors.ring }}
          >
            <div>
              <h3 className="text-lg font-semibold">
                {form?.id ? "Edit Category" : "New Category"}
              </h3>
              <p className="text-sm mt-1" style={{ color: colors.text2 }}>
                Manage article categories
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg"
              style={{ backgroundColor: colors.bg2 }}
            >
              <MdClose size={18} style={{ color: colors.text2 }} />
            </button>
          </div>

          <div className="p-6">
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
                placeholder="Category name"
              />
            </label>
          </div>

          <div style={{ borderTop: `1px solid ${colors.ring}` }}>
            <div className="p-4 px-6 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-medium border"
                style={{
                  borderColor: colors.ring,
                  color: colors.text2,
                  backgroundColor: colors.bg2,
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => onSave(form)}
                className="px-4 py-2 rounded-xl text-sm font-medium"
                style={{ backgroundColor: colors.accent, color: "#000" }}
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  } catch (err) {
    console.error("CategoryEditorModal render error:", err);
    return null;
  }
}
