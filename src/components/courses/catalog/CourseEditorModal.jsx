import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MdDelete } from "react-icons/md";
import { useTheme } from "../../../contexts/ThemeContext";

export default function CourseEditorModal({
  isOpen,
  onClose,
  course = null,
  onSave,
  onDelete,
}) {
  const { colors } = useTheme();

  const initialForm = {
    title: course?.title || course?.name || "",
    category: course?.category || "",
    description: course?.description || "",
    level: course?.level || "beginner",
    total_minutes:
      typeof course?.duration_minutes === "number"
        ? String(course.duration_minutes)
        : "",
    is_published:
      typeof course?.is_published === "boolean" ? course.is_published : false,
    thumbnail_url: course?.thumbnail_url || "",
  };

  const [form, setForm] = useState(initialForm);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      title: course?.title || course?.name || "",
      category: course?.category || "",
      description: course?.description || "",
      level: course?.level || "beginner",
      total_minutes:
        typeof course?.duration_minutes === "number"
          ? String(course.duration_minutes)
          : "",
      is_published:
        typeof course?.is_published === "boolean" ? course.is_published : false,
      thumbnail_url: course?.thumbnail_url || "",
    });
    setVideoFile(null);
    setThumbnailFile(null);
  }, [course, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (saving) return;
    if (!form.title?.trim()) return;

    setSaving(true);
    try {
      const payload = {
        ...(course || {}),
        title: form.title.trim(),
        category: form.category?.trim() || null,
        description: form.description || "",
        level: form.level || null,
        duration_minutes: form.total_minutes
          ? Number(form.total_minutes)
          : course.duration_minutes ?? null,
        is_published: !!form.is_published,
        thumbnail_url: course?.thumbnail_url || "",
      };

      await onSave?.({
        coursePayload: payload,
        videoFile,
        thumbnailFile,
      });

      onClose && onClose();
    } catch (err) {
      console.error("Save error", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!course) return;
    if (saving) return;
    onDelete?.(course);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSizeMb = 200;
    if (file.size > maxSizeMb * 1024 * 1024) {
      alert(`Video too large. Please upload a file under ${maxSizeMb}MB.`);
      return;
    }
    setVideoFile(file);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSizeMb = 10;
    if (file.size > maxSizeMb * 1024 * 1024) {
      alert(`Image too large. Please upload under ${maxSizeMb}MB.`);
      return;
    }
    setThumbnailFile(file);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-999 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-full sm:max-w-2xl rounded-t-xl sm:rounded-xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: colors.card || colors.bg2,
          color: colors.text,
          maxHeight: "90vh",
        }}
      >
        <div className="p-4 border-b" style={{ borderColor: colors.ring }}>
          <div className="font-semibold">
            {course?.id ? "Edit Course" : "New Course"}
          </div>
        </div>

        <div
          className="p-4 space-y-4 overflow-auto"
          style={{ maxHeight: "calc(90vh - 160px)" }}
        >
          {/* Title */}
          <div>
            <label className="block text-sm" style={{ color: colors.text2 }}>
              Title
            </label>
            <input
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Course title"
              className="w-full rounded-lg px-3 py-2 mt-1"
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
            <label className="block text-sm" style={{ color: colors.text2 }}>
              Category
            </label>
            <input
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value }))
              }
              placeholder="e.g. Tire Management, Advanced Braking"
              className="w-full rounded-lg px-3 py-2 mt-1"
              style={{
                backgroundColor: colors.bg2,
                border: `1px solid ${colors.ring}`,
                color: colors.text,
              }}
            />
          </div>

          {/* Level & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm" style={{ color: colors.text2 }}>
                Level
              </label>
              <select
                value={form.level}
                onChange={(e) =>
                  setForm((p) => ({ ...p, level: e.target.value }))
                }
                className="w-full rounded-lg px-3 py-2 mt-1 text-sm"
                style={{
                  backgroundColor: colors.bg2,
                  border: `1px solid ${colors.ring}`,
                  color: colors.text,
                }}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm" style={{ color: colors.text2 }}>
                Duration (minutes)
              </label>
              <input
                type="number"
                min={0}
                value={form.total_minutes}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    total_minutes: e.target.value,
                  }))
                }
                placeholder="e.g. 150 for 2h 30m"
                className="w-full rounded-lg px-3 py-2 mt-1"
                style={{
                  backgroundColor: colors.bg2,
                  border: `1px solid ${colors.ring}`,
                  color: colors.text,
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm" style={{ color: colors.text2 }}>
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              rows={6}
              className="w-full rounded-lg px-3 py-2 mt-1"
              style={{
                backgroundColor: colors.bg2,
                border: `1px solid ${colors.ring}`,
                color: colors.text,
              }}
            />
          </div>

          {/* Published */}
          <div className="flex items-center gap-2">
            <input
              id="published"
              type="checkbox"
              checked={form.is_published}
              onChange={(e) =>
                setForm((p) => ({ ...p, is_published: e.target.checked }))
              }
            />
            <label
              htmlFor="published"
              className="text-sm"
              style={{ color: colors.text2 }}
            >
              Published (visible in app)
            </label>
          </div>

          {/* Thumbnail upload */}
          <div>
            <label className="block text-sm" style={{ color: colors.text2 }}>
              Course thumbnail (image)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="mt-1 text-sm"
            />
            {thumbnailFile && (
              <p className="mt-1 text-xs" style={{ color: colors.text2 }}>
                Selected: {thumbnailFile.name}
              </p>
            )}
            {!thumbnailFile && form.thumbnail_url && (
              <p className="mt-1 text-xs" style={{ color: colors.text2 }}>
                Current: {form.thumbnail_url}
              </p>
            )}
          </div>

          {/* Video upload */}
          <div>
            <label className="block text-sm" style={{ color: colors.text2 }}>
              Intro / main lesson video (optional)
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="mt-1 text-sm"
            />
            {videoFile && (
              <p className="mt-1 text-xs" style={{ color: colors.text2 }}>
                Selected: {videoFile.name}
              </p>
            )}
          </div>
        </div>

        <div
          className="p-4 border-t flex flex-col sm:flex-row sm:justify-end gap-2"
          style={{ borderColor: colors.ring }}
        >
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg"
              style={{
                backgroundColor: colors.bg2,
                color: colors.text,
              }}
              disabled={saving}
            >
              Cancel
            </button>

            {course?.id && (
              <button
                type="button"
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
              type="submit"
              className="px-4 py-2 rounded-lg"
              style={{
                backgroundColor: colors.accent,
                color: colors.bg,
              }}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>,
    document.body
  );
}
