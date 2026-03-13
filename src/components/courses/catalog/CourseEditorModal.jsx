/*
 * Course Editor Modal component for courses surfaces within the admin interface.
 * Keeps rendering behavior isolated so higher-level modules can focus on data flow.
 */

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  MdCheckCircle,
  MdCloudUpload,
  MdDelete,
  MdImage,
  MdMovie,
} from "react-icons/md";
import toast from "react-hot-toast";
import { useTheme } from "../../../contexts/ThemeContext";
import useBodyScrollLock from "../../../hooks/useBodyScrollLock";

const levelOptions = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export default function CourseEditorModal({
  isOpen,
  onClose,
  course = null,
  onSave,
  onDelete,
}) {
  const { colors } = useTheme();

  const initialForm = useMemo(
    () => ({
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
    }),
    [course]
  );

  const [form, setForm] = useState(initialForm);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState("");

  useBodyScrollLock(isOpen);

  useEffect(() => {
    setForm(initialForm);
    setVideoFile(null);
    setThumbnailFile(null);
  }, [initialForm, isOpen]);

  useEffect(() => {
    if (!thumbnailFile) {
      setThumbnailPreviewUrl("");
      return undefined;
    }

    const preview = URL.createObjectURL(thumbnailFile);
    setThumbnailPreviewUrl(preview);

    return () => {
      URL.revokeObjectURL(preview);
    };
  }, [thumbnailFile]);

  const cardStyle = useMemo(
    () => ({
      backgroundColor: colors.bg2,
      border: `1px solid ${colors.ring}`,
    }),
    [colors.bg2, colors.ring]
  );

  const inputStyle = useMemo(
    () => ({
      backgroundColor: colors.card || colors.bg,
      border: `1px solid ${colors.ring}`,
      color: colors.text,
    }),
    [colors.bg, colors.card, colors.ring, colors.text]
  );

  const panelStyle = useMemo(
    () => ({
      backgroundColor: colors.card || colors.bg2,
      color: colors.text,
      border: `1px solid ${colors.ring}`,
      boxShadow: "0 24px 64px rgba(0, 0, 0, 0.38)",
    }),
    [colors.bg2, colors.card, colors.ring, colors.text]
  );

  const footerStyle = useMemo(
    () => ({
      borderColor: colors.ring,
      backgroundColor: colors.card || colors.bg2,
    }),
    [colors.bg2, colors.card, colors.ring]
  );

  const handleSubmit = async (event) => {
    event?.preventDefault?.();
    if (saving) return;

    if (!form.title?.trim()) {
      toast.error("Course title is required.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...(course || {}),
        title: form.title.trim(),
        category: form.category?.trim() || null,
        description: form.description?.trim() || "",
        level: form.level || "beginner",
        duration_minutes: form.total_minutes ? Number(form.total_minutes) : null,
        is_published: !!form.is_published,
        thumbnail_url: course?.thumbnail_url || "",
      };

      await onSave?.({
        coursePayload: payload,
        videoFile,
        thumbnailFile,
      });
    } catch (error) {
      console.error("Save error", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!course?.id || saving) return;
    onDelete?.(course);
  };

  const handleVideoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSizeMb = 200;
    if (file.size > maxSizeMb * 1024 * 1024) {
      toast.error(`Video too large. Please upload a file under ${maxSizeMb}MB.`);
      event.target.value = "";
      return;
    }

    setVideoFile(file);
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSizeMb = 10;
    if (file.size > maxSizeMb * 1024 * 1024) {
      toast.error(
        `Image too large. Please upload an image under ${maxSizeMb}MB.`
      );
      event.target.value = "";
      return;
    }

    setThumbnailFile(file);
  };

  if (!isOpen) return null;

  const modalTitle = course?.id ? "Edit Course" : "New Course";
  const previewImage = thumbnailPreviewUrl || form.thumbnail_url || "";

  return createPortal(
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center p-3 sm:p-6"
      aria-hidden={false}
    >
      <div
        className="absolute inset-0 bg-black/70"
        onClick={() => {
          if (!saving) onClose?.();
        }}
      />

      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-label={modalTitle}
        className="modal-panel relative flex w-full max-w-5xl max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-3rem)] min-h-0 flex-col overflow-hidden rounded-[26px]"
        style={panelStyle}
      >
        <div
          className="shrink-0 border-b px-5 py-4 sm:px-6 sm:py-5"
          style={{ borderColor: colors.ring }}
        >
          <div className="flex flex-col gap-1">
            <div className="text-xl font-semibold sm:text-2xl">{modalTitle}</div>
            <div className="text-sm" style={{ color: colors.text2 }}>
              Create or update course content, media and app visibility.
            </div>
          </div>
        </div>

        <div className="modal-scroll-area px-5 sm:px-6">
          <div className="space-y-6 py-5 sm:py-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr,0.8fr]">
              <div className="space-y-6">
                <div className="rounded-2xl p-4 sm:p-5 space-y-4" style={cardStyle}>
                  <div className="text-base font-semibold">Course information</div>

                  <div>
                    <label
                      className="mb-2 block text-sm"
                      style={{ color: colors.text2 }}
                    >
                      Title
                    </label>
                    <input
                      value={form.title}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, title: event.target.value }))
                      }
                      placeholder="Course title"
                      className="w-full rounded-xl px-4 py-3 outline-none"
                      style={inputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label
                      className="mb-2 block text-sm"
                      style={{ color: colors.text2 }}
                    >
                      Category
                    </label>
                    <input
                      value={form.category}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          category: event.target.value,
                        }))
                      }
                      placeholder="e.g. Tire Management, Advanced Braking"
                      className="w-full rounded-xl px-4 py-3 outline-none"
                      style={inputStyle}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        className="mb-2 block text-sm"
                        style={{ color: colors.text2 }}
                      >
                        Level
                      </label>
                      <select
                        value={form.level}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            level: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl px-4 py-3 outline-none"
                        style={inputStyle}
                      >
                        {levelOptions.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        className="mb-2 block text-sm"
                        style={{ color: colors.text2 }}
                      >
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={form.total_minutes}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            total_minutes: event.target.value,
                          }))
                        }
                        placeholder="e.g. 150 for 2h 30m"
                        className="w-full rounded-xl px-4 py-3 outline-none"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl p-4 sm:p-5 space-y-4" style={cardStyle}>
                  <div className="text-base font-semibold">Description</div>
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        description: event.target.value,
                      }))
                    }
                    rows={8}
                    placeholder="Write a short overview for admins and app users."
                    className="w-full resize-y rounded-xl px-4 py-3 outline-none"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      is_published: !prev.is_published,
                    }))
                  }
                  className="w-full rounded-2xl p-4 text-left sm:p-5"
                  style={cardStyle}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-base font-semibold">Publish course</div>
                      <div className="mt-1 text-sm" style={{ color: colors.text2 }}>
                        Make this course visible in the app after saving.
                      </div>
                    </div>

                    <div
                      className="relative h-7 w-12 rounded-full transition-all"
                      style={{
                        backgroundColor: form.is_published
                          ? colors.accent
                          : colors.card || colors.bg,
                        border: `1px solid ${colors.ring}`,
                      }}
                    >
                      <span
                        className="absolute top-1 h-5 w-5 rounded-full transition-all"
                        style={{
                          left: form.is_published
                            ? "calc(100% - 1.45rem)"
                            : "0.25rem",
                          backgroundColor: form.is_published
                            ? "#000"
                            : colors.text2,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <MdCheckCircle
                      size={18}
                      style={{
                        color: form.is_published
                          ? colors.ok || "#22c55e"
                          : colors.text2,
                      }}
                    />
                    <span style={{ color: colors.text2 }}>
                      {form.is_published ? "Published in app" : "Saved as draft"}
                    </span>
                  </div>
                </button>

                <div className="rounded-2xl p-4 sm:p-5 space-y-3" style={cardStyle}>
                  <div className="flex items-center gap-2 text-base font-semibold">
                    <MdImage size={20} style={{ color: colors.accent }} />
                    Course thumbnail
                  </div>

                  <label
                    htmlFor="course-thumbnail-upload"
                    className="block cursor-pointer rounded-2xl border border-dashed p-4"
                    style={{
                      borderColor: colors.ring,
                      backgroundColor: colors.card || colors.bg,
                    }}
                  >
                    <div
                      className="overflow-hidden rounded-xl"
                      style={{
                        backgroundColor: colors.bg2,
                        border: `1px solid ${colors.ring}`,
                      }}
                    >
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Course thumbnail preview"
                          loading="lazy"
                          className="h-44 w-full object-cover sm:h-52"
                        />
                      ) : (
                        <div
                          className="flex h-44 w-full flex-col items-center justify-center px-4 text-center sm:h-52"
                          style={{
                            backgroundColor: colors.bg2,
                            color: colors.text2,
                          }}
                        >
                          <MdCloudUpload
                            size={34}
                            style={{ color: colors.accent }}
                          />
                          <div className="mt-3 text-sm font-medium">
                            Upload course cover image
                          </div>
                          <div className="mt-1 text-xs">PNG, JPG, WEBP up to 10MB</div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium">
                          {thumbnailFile ? thumbnailFile.name : "Choose thumbnail"}
                        </div>
                        <div className="mt-1 text-xs" style={{ color: colors.text2 }}>
                          {thumbnailFile
                            ? formatBytes(thumbnailFile.size)
                            : form.thumbnail_url
                              ? "Current thumbnail will be kept unless you replace it."
                              : "Recommended wide image for cleaner course cards."}
                        </div>
                      </div>

                      <span
                        className="whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium"
                        style={{
                          backgroundColor: `${colors.accent}18`,
                          color: colors.accent,
                        }}
                      >
                        Choose image
                      </span>
                    </div>
                  </label>

                  <input
                    id="course-thumbnail-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                </div>

                <div className="rounded-2xl p-4 sm:p-5 space-y-3" style={cardStyle}>
                  <div className="flex items-center gap-2 text-base font-semibold">
                    <MdMovie size={20} style={{ color: colors.accent }} />
                    Intro / first lesson video
                  </div>

                  <label
                    htmlFor="course-video-upload"
                    className="block cursor-pointer rounded-2xl border border-dashed p-4"
                    style={{
                      borderColor: colors.ring,
                      backgroundColor: colors.card || colors.bg,
                    }}
                  >
                    <div
                      className="rounded-xl p-4 sm:p-5"
                      style={{ backgroundColor: colors.bg2 }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
                          style={{ backgroundColor: `${colors.accent}18` }}
                        >
                          <MdMovie size={22} style={{ color: colors.accent }} />
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <div className="break-all text-sm font-medium">
                            {videoFile ? videoFile.name : "Upload or replace video"}
                          </div>
                          <div className="mt-1 text-xs" style={{ color: colors.text2 }}>
                            {videoFile
                              ? `${formatBytes(videoFile.size)} - ready to upload`
                              : "MP4 / MOV / WebM under 200MB"}
                          </div>
                          <div className="mt-2 text-xs" style={{ color: colors.text2 }}>
                            On save, this media will be used for the first lesson
                            preview.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <span
                        className="inline-flex rounded-xl px-3 py-2 text-sm font-medium"
                        style={{
                          backgroundColor: `${colors.accent}18`,
                          color: colors.accent,
                        }}
                      >
                        Choose video
                      </span>
                    </div>
                  </label>

                  <input
                    id="course-video-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="shrink-0 border-t px-5 py-4 sm:px-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between"
          style={footerStyle}
        >
          <div>
            {course?.id ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium sm:w-auto"
                style={{
                  backgroundColor: colors.danger || "#ef4444",
                  color: "#fff",
                  opacity: saving ? 0.7 : 1,
                }}
                disabled={saving}
              >
                <MdDelete size={18} />
                Delete
              </button>
            ) : null}
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => {
                if (!saving) onClose?.();
              }}
              className="rounded-xl px-4 py-3 font-medium"
              style={{
                backgroundColor: colors.bg2,
                color: colors.text,
                border: `1px solid ${colors.ring}`,
                opacity: saving ? 0.7 : 1,
              }}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl px-5 py-3 font-semibold"
              style={{
                backgroundColor: colors.accent,
                color: "#000",
                opacity: saving ? 0.8 : 1,
              }}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Course"}
            </button>
          </div>
        </div>
      </form>
    </div>,
    document.body
  );
}
