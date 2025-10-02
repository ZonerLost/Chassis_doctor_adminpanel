import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MdClose } from "react-icons/md";
import { useTheme } from "../../../contexts/ThemeContext";

export default function SymptomEditorDrawer({
  isOpen,
  onClose,
  symptom = null,
  onSave,
}) {
  const { colors } = useTheme();
  const [form, setForm] = useState({
    name: "",
    category: "",
    severity: "Medium",
    frequency: 0,
    description: "",
  });

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      name: symptom?.name || "",
      category: symptom?.category || "",
      severity: symptom?.severity || "Medium",
      frequency: symptom?.frequency || 0,
      description: symptom?.description || "",
    });
  }, [isOpen, symptom]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    const payload = { ...form, id: symptom?.id || Date.now() };
    onSave && onSave(payload);
    onClose && onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md rounded-xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: colors.card, color: colors.text }}
        role="dialog"
        aria-modal="true"
      >
        <header
          className="flex items-start justify-between px-6 py-4"
          style={{ borderBottom: `1px solid ${colors.ring}` }}
        >
          <div>
            <h3 className="text-lg font-semibold">
              {symptom ? "Edit Symptom" : "Add Symptom"}
            </h3>
            <div className="text-xs mt-1" style={{ color: colors.text2 }}>
              Diagnostic symptom details
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-md"
            style={{ color: colors.text2, background: "transparent" }}
          >
            <MdClose size={20} />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="p-6 max-h-[70vh] overflow-y-auto space-y-4"
        >
          <div>
            <label className="text-sm mb-1 block">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{
                backgroundColor: colors.bg2,
                border: `1px solid ${colors.ring}`,
                color: colors.text,
              }}
              required
            />
          </div>

          <div>
            <label className="text-sm mb-1 block">Category</label>
            <input
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value }))
              }
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{
                backgroundColor: colors.bg2,
                border: `1px solid ${colors.ring}`,
                color: colors.text,
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm mb-1 block">Severity</label>
              <select
                value={form.severity}
                onChange={(e) =>
                  setForm((p) => ({ ...p, severity: e.target.value }))
                }
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{
                  backgroundColor: colors.bg2,
                  border: `1px solid ${colors.ring}`,
                  color: colors.text,
                }}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div>
              <label className="text-sm mb-1 block">Frequency (%)</label>
              <input
                type="number"
                value={form.frequency}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    frequency: Number(e.target.value || 0),
                  }))
                }
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{
                  backgroundColor: colors.bg2,
                  border: `1px solid ${colors.ring}`,
                  color: colors.text,
                }}
                min={0}
                max={100}
              />
            </div>
          </div>

          <div>
            <label className="text-sm mb-1 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              className="w-full rounded-lg px-3 py-2 text-sm h-28"
              style={{
                backgroundColor: colors.bg2,
                border: `1px solid ${colors.ring}`,
                color: colors.text,
              }}
            />
          </div>
        </form>

        {/* Updated footer buttons to match MappingRuleEditorDrawer */}
        <footer className="flex gap-2 pt-4 px-6 pb-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded border"
            style={{
              borderColor: colors.ring,
              color: colors.text2,
              backgroundColor: colors.bg2,
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 rounded"
            style={{
              backgroundColor: colors.accent,
              color: "#000",
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
