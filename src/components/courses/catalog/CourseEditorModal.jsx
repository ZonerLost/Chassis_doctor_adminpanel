import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MdClose, MdDelete } from "react-icons/md";
import { useTheme } from "../../../contexts/ThemeContext";

const SEVERITY_OPTIONS = ["Low", "Medium", "High", "Critical"];

export default function CourseEditorModal({
  isOpen,
  onClose,
  course = {},
  onSave,
  onDelete,
}) {
  const { colors } = useTheme();
  const [form, setForm] = useState(course || { title: "", description: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(course || { title: "", description: "" });
  }, [course, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (saving) return;
    setSaving(true);
    try {
      const payload = {
        ...course,
        id: course?.id || Date.now(),
        title: form.name,
        name: form.name,
        category: form.category,
        severity: form.severity,
        frequency: form.frequency,
        description: form.description,
        updatedAt: new Date().toISOString(),
      };

      // await parent save so caller can update state
      await onSave?.(payload);
      onClose && onClose();
    } catch (err) {
      console.error("Save error", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!course) return;
    if (saving) return;
    if (!window.confirm(`Delete "${course.title || course.name}"?`)) return;
    try {
      setSaving(true);
      await onDelete?.(course);
      onClose && onClose();
    } catch (err) {
      console.error("Delete error", err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      {/* Full width on mobile, constrained on larger screens */}
      <div
        className="relative w-full max-w-full sm:max-w-2xl rounded-xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: colors.card || colors.bg2,
          color: colors.text,
        }}
      >
        <div className="p-4 border-b" style={{ borderColor: colors.ring }}>
          <div className="font-semibold">
            {course?.id ? "Edit Course" : "New Course"}
          </div>
        </div>

        <div className="p-4 space-y-3">
          <input
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="Title"
            className="w-full rounded-lg px-3 py-2"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
              color: colors.text,
            }}
          />
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            rows={6}
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
            style={{
              backgroundColor: colors.bg2,
              color: colors.text,
            }}
          >
            Cancel
          </button>
          {course?.id && (
            <button
              onClick={handleDelete}
              className="px-3 py-2 rounded-lg flex items-center gap-1"
              style={{
                backgroundColor: colors.error || "#e53e3e",
                color: colors.bg,
              }}
              disabled={saving}
            >
              <MdDelete />
              Delete
            </button>
          )}
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg"
            style={{
              backgroundColor: colors.accent,
              color: colors.bg,
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
