import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MdClose, MdDelete } from "react-icons/md";
import { useTheme } from "../../../contexts/ThemeContext";

const SEVERITY_OPTIONS = ["Low", "Medium", "High", "Critical"];

export default function CourseEditorModal({
  isOpen,
  onClose,
  course = null,
  onSave,
  onDelete,
}) {
  const { colors } = useTheme();

  const [form, setForm] = useState({
    name: "",
    category: "",
    severity: "Medium",
    frequency: "",
    description: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      name: course?.title || course?.name || "",
      category:
        course?.category ||
        (Array.isArray(course?.categories) ? course.categories[0] : "") ||
        "",
      severity: course?.severity || course?.level || "Medium",
      frequency: course?.frequency ?? course?.freq ?? "",
      description: course?.description || course?.summary || "",
    });
  }, [isOpen, course]);

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
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
        onClick={onClose}
        aria-hidden
      />
      <div
        className="relative w-full max-w-lg rounded-2xl shadow-2xl"
        role="dialog"
        aria-modal="true"
        style={{
          backgroundColor: colors.card,
          color: colors.text,
          zIndex: 3001,
        }}
      >
        {/* header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: colors.ring }}
        >
          <div>
            <h3 className="text-lg font-semibold">
              {course ? "Edit Course" : "Add Course"}
            </h3>
            <div className="text-xs mt-1" style={{ color: colors.text2 }}>
              Manage course details
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-md"
            style={{ color: colors.text2 }}
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* body (compact form with only requested fields) */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label
              className="text-sm mb-1 block"
              style={{ color: colors.text }}
            >
              Name *
            </label>
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

          {/* Category */}
          <div>
            <label
              className="text-sm mb-1 block"
              style={{ color: colors.text }}
            >
              Category
            </label>
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

          {/* Severity + Frequency row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="text-sm mb-1 block"
                style={{ color: colors.text }}
              >
                Severity
              </label>
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
                {SEVERITY_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="text-sm mb-1 block"
                style={{ color: colors.text }}
              >
                Frequency (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.frequency}
                onChange={(e) =>
                  setForm((p) => ({ ...p, frequency: e.target.value }))
                }
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{
                  backgroundColor: colors.bg2,
                  border: `1px solid ${colors.ring}`,
                  color: colors.text,
                }}
                placeholder="0-100"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              className="text-sm mb-1 block"
              style={{ color: colors.text }}
            >
              Description *
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              rows={4}
              className="w-full rounded-lg px-3 py-2 text-sm resize-none"
              style={{
                backgroundColor: colors.bg2,
                border: `1px solid ${colors.ring}`,
                color: colors.text,
              }}
              required
            />
          </div>
        </form>

        {/* footer (Actions) */}
        <div
          className="flex items-center p-6 border-t"
          style={{ borderColor: colors.ring }}
        >
          {/* left: delete */}
          <div className="flex-0">
            {course && (
              <button
                onClick={handleDelete}
                disabled={saving}
                aria-disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: "#EF4444",
                  color: "#fff",
                  boxShadow: saving
                    ? "none"
                    : "0 4px 12px rgba(239,68,68,0.12)",
                }}
              >
                <MdDelete size={16} />
                <span>Delete</span>
              </button>
            )}
          </div>

          {/* spacer */}
          <div className="flex-1" />

          {/* right: Close + Save */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-sm font-medium"
              style={{
                backgroundColor: colors.bg2,
                color: colors.text2,
                border: `1px solid ${colors.ring}`,
                minWidth: 84,
                textAlign: "center",
              }}
            >
              Close
            </button>

            <button
              type="button"
              disabled={saving}
              aria-disabled={saving}
              onClick={handleSubmit}
              className="px-4 py-2 rounded-full text-sm font-medium"
              style={{
                backgroundColor: colors.accent,
                color: "#000",
                minWidth: 84,
                boxShadow: saving ? "none" : "0 6px 18px rgba(0,0,0,0.12)",
                opacity: saving ? 0.8 : 1,
              }}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
