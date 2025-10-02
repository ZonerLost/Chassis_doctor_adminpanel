import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { MdClose } from "react-icons/md";
import { useTheme } from "../../../contexts/ThemeContext";
import { COURSE_LEVELS } from "../../../utils/constants";

export default function CourseEditorDrawer({
  isOpen,
  onClose,
  course = null,
  onSave,
}) {
  const { colors } = useTheme();

  const [formData, setFormData] = useState({
    title: "",
    level: "beginner",
    isPaid: false,
    priceCents: 0,
    summary: "",
    instructorName: "",
    instructorEmail: "",
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form when course changes or modal opens
  useEffect(() => {
    if (isOpen && course) {
      setFormData({
        title: course.title || "",
        level: course.level || "beginner",
        isPaid: course.isPaid || false,
        priceCents: course.priceCents || 0,
        summary: course.summary || "",
        instructorName: course.instructorName || "",
        instructorEmail: course.instructorEmail || "",
      });
    } else if (isOpen && !course) {
      setFormData({
        title: "",
        level: "beginner",
        isPaid: false,
        priceCents: 0,
        summary: "",
        instructorName: "",
        instructorEmail: "",
      });
    }
    setErrors({});
  }, [course, isOpen]);

  // lock body scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.summary.trim()) newErrors.summary = "Summary is required";
    if (formData.isPaid && formData.priceCents <= 0)
      newErrors.priceCents = "Price must be greater than 0 for paid courses";
    if (formData.instructorEmail && !formData.instructorEmail.includes("@"))
      newErrors.instructorEmail = "Please enter a valid email";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      const courseData = {
        ...formData,
        id: course?.id || Date.now(),
        updatedAt: new Date().toISOString(),
      };
      await onSave(courseData);
      handleClose();
    } catch (err) {
      console.error("Error saving course:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      level: "beginner",
      isPaid: false,
      priceCents: 0,
      summary: "",
      instructorName: "",
      instructorEmail: "",
    });
    setErrors({});
    onClose && onClose();
  };

  if (!isOpen) return null;

  // button sizes to match screenshot
  const btnHeight = "44px";
  const btnWidth = "160px";
  const btnRadius = "8px";

  return createPortal(
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        className="relative w-full max-w-md rounded-xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: colors.card, color: colors.text }}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <header
          className="flex items-start justify-between px-6 py-4"
          style={{ borderBottom: `1px solid ${colors.ring}` }}
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
            onClick={handleClose}
            aria-label="Close"
            className="p-2 rounded-md"
            style={{ color: colors.text2 }}
          >
            <MdClose size={20} />
          </button>
        </header>

        {/* Body */}
        <form
          className="p-6 max-h-[70vh] overflow-y-auto space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div>
            <label className="text-sm mb-1 block">Title *</label>
            <input
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{
                backgroundColor: colors.bg2,
                border: `1px solid ${errors.title ? "#ef4444" : colors.ring}`,
                color: colors.text,
              }}
              required
            />
            {errors.title && (
              <div className="text-xs mt-1" style={{ color: "#ef4444" }}>
                {errors.title}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm mb-1 block">Course Level</label>
            <select
              value={formData.level}
              onChange={(e) => handleInputChange("level", e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{
                backgroundColor: colors.bg2,
                border: `1px solid ${colors.ring}`,
                color: colors.text,
              }}
            >
              {COURSE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={formData.isPaid}
                onChange={(e) => handleInputChange("isPaid", e.target.checked)}
              />
              <span className="text-sm" style={{ color: colors.text }}>
                This is a paid course
              </span>
            </label>
            {formData.isPaid && (
              <div>
                <label className="text-sm mb-1 block">Price (in cents) *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.priceCents}
                  onChange={(e) =>
                    handleInputChange(
                      "priceCents",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{
                    backgroundColor: colors.bg2,
                    border: `1px solid ${
                      errors.priceCents ? "#ef4444" : colors.ring
                    }`,
                    color: colors.text,
                  }}
                />
                {errors.priceCents && (
                  <div className="text-xs mt-1" style={{ color: "#ef4444" }}>
                    {errors.priceCents}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm mb-1 block">Summary *</label>
            <textarea
              value={formData.summary}
              onChange={(e) => handleInputChange("summary", e.target.value)}
              rows={3}
              className="w-full rounded-lg px-3 py-2 text-sm resize-none"
              style={{
                backgroundColor: colors.bg2,
                border: `1px solid ${errors.summary ? "#ef4444" : colors.ring}`,
                color: colors.text,
              }}
            />
            {errors.summary && (
              <div className="text-xs mt-1" style={{ color: "#ef4444" }}>
                {errors.summary}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm mb-1 block">Instructor</label>
              <input
                value={formData.instructorName}
                onChange={(e) =>
                  handleInputChange("instructorName", e.target.value)
                }
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{
                  backgroundColor: colors.bg2,
                  border: `1px solid ${colors.ring}`,
                  color: colors.text,
                }}
              />
            </div>
            <div>
              <label className="text-sm mb-1 block">Email</label>
              <input
                type="email"
                value={formData.instructorEmail}
                onChange={(e) =>
                  handleInputChange("instructorEmail", e.target.value)
                }
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{
                  backgroundColor: colors.bg2,
                  border: `1px solid ${
                    errors.instructorEmail ? "#ef4444" : colors.ring
                  }`,
                  color: colors.text,
                }}
              />
              {errors.instructorEmail && (
                <div className="text-xs mt-1" style={{ color: "#ef4444" }}>
                  {errors.instructorEmail}
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <footer
          className="flex items-center justify-center gap-4 px-6 py-4"
          style={{ borderTop: `1px solid ${colors.ring}` }}
        >
          <button
            type="button"
            onClick={handleClose}
            className="text-sm font-medium"
            style={{
              height: btnHeight,
              minWidth: btnWidth,
              borderRadius: btnRadius,
              border: `1px solid ${colors.ring}`,
              backgroundColor: colors.bg2,
              color: colors.text2,
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="text-sm font-medium"
            style={{
              height: btnHeight,
              minWidth: btnWidth,
              borderRadius: btnRadius,
              border: `1px solid ${colors.gold || "#D4AF37"}`,
              backgroundColor: colors.gold || "#D4AF37",
              color: "#0B0B0F",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
}
