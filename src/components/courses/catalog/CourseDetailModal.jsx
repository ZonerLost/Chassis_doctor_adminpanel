import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../../../contexts/ThemeContext";
import {
  listLessonsForCourse,
  getLessonVideoUrl,
} from "../../../services/courses.service";

const formatDurationMinutes = (minutes) => {
  if (minutes == null || Number.isNaN(Number(minutes))) return "-";
  const total = Math.max(0, Number(minutes));
  const hours = Math.floor(total / 60);
  const mins = Math.round(total % 60);
  if (hours && mins) return `${hours}h ${mins}m`;
  if (hours) return `${hours}h`;
  return `${mins}m`;
};

const formatLessonDuration = (seconds) => {
  if (seconds == null || Number.isNaN(Number(seconds))) return "";
  const total = Math.max(0, Math.round(seconds));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  if (mins && secs) return `${mins}m ${secs}s`;
  if (mins) return `${mins}m`;
  return `${secs}s`;
};

const formatDate = (dateLike) => {
  if (!dateLike) return "-";
  try {
    return new Date(dateLike).toLocaleString();
  } catch {
    return "-";
  }
};

export default function CourseDetailModal({
  isOpen,
  course,
  onClose,
  loadingDetails = false,
  detailError = null,
}) {
  const { colors } = useTheme();
  const [lessons, setLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [lessonsError, setLessonsError] = useState(null);
  const [firstLessonVideoUrl, setFirstLessonVideoUrl] = useState(null);

  useEffect(() => {
    if (!isOpen || !course?.id) return undefined;

    let cancelled = false;
    setLessons([]);
    setLessonsError(null);
    setFirstLessonVideoUrl(null);
    setLoadingLessons(true);

    const loadLessons = async () => {
      try {
        const res = await listLessonsForCourse(course.id);
        if (cancelled) return;

        const data = Array.isArray(res?.data) ? res.data : [];
        setLessons(data);

        const firstWithVideo = data.find((l) => l?.video_path);
        if (firstWithVideo?.video_path) {
          try {
            const url = await getLessonVideoUrl(firstWithVideo.video_path);
            if (!cancelled) setFirstLessonVideoUrl(url || null);
          } catch (err) {
            console.error("Failed to resolve lesson video URL:", err);
          }
        }
      } catch (err) {
        console.error("Failed to load lessons:", err);
        if (!cancelled) {
          setLessons([]);
          setLessonsError(err?.message || "Failed to load lessons");
        }
      } finally {
        if (!cancelled) setLoadingLessons(false);
      }
    };

    loadLessons();
    return () => {
      cancelled = true;
    };
  }, [isOpen, course?.id]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const metadata = useMemo(
    () => [
      { label: "Category", value: course?.category || "-" },
      { label: "Level", value: course?.level || "-" },
      {
        label: "Duration",
        value: formatDurationMinutes(course?.duration_minutes),
      },
      { label: "Created", value: formatDate(course?.created_at) },
    ],
    [course]
  );

  if (!isOpen || !course) return null;

  const title = course.title || course.name || "Course";
  const isPublished = !!course.is_published;

  return createPortal(
    <div
      className="fixed inset-0 flex items-end sm:items-center justify-center p-4"
      style={{ zIndex: 999 }}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className="relative w-full max-w-5xl rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{
          backgroundColor: colors.card || colors.bg2,
          color: colors.text,
          maxHeight: "90vh",
          border: `1px solid ${colors.ring}`,
        }}
      >
        <div
          className="p-4 sm:p-5 border-b flex items-center justify-between gap-3"
          style={{ borderColor: colors.ring }}
        >
          <div>
            <div className="text-lg sm:text-xl font-semibold">Course details</div>
            <div className="text-sm mt-1" style={{ color: colors.text2 }}>
              {title}
            </div>
            {detailError ? (
              <div className="text-xs mt-1" style={{ color: colors.danger || "#ef4444" }}>
                {detailError}
              </div>
            ) : null}
          </div>
          {loadingDetails ? (
            <div className="text-xs" style={{ color: colors.text2 }}>
              Loading details...
            </div>
          ) : null}
        </div>

        <div
          className="p-4 sm:p-6 space-y-6 overflow-auto"
          style={{ maxHeight: "calc(90vh - 120px)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-3">
              <div
                className="rounded-xl overflow-hidden border"
                style={{
                  borderColor: colors.ring,
                  backgroundColor: colors.bg2,
                }}
              >
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={title}
                    className="w-full h-56 sm:h-64 object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-56 sm:h-64 flex items-center justify-center text-sm"
                    style={{ color: colors.text2 }}
                  >
                    No thumbnail
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-semibold">{title}</h2>
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: isPublished ? `${colors.ok}22` : colors.bg2,
                    color: isPublished ? colors.ok : colors.text2,
                    border: `1px solid ${colors.ring}`,
                  }}
                >
                  {isPublished ? "Published" : "Draft"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {metadata.map((item) => (
                  <div key={item.label}>
                    <div style={{ color: colors.text2 }}>{item.label}</div>
                    <div className="font-medium" style={{ color: colors.text }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-sm leading-relaxed" style={{ color: colors.text }}>
                <div className="font-semibold mb-2">Description</div>
                <div style={{ color: colors.text2, whiteSpace: "pre-line" }}>
                  {course.description || "No description provided."}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              className="p-4 rounded-xl border"
              style={{ borderColor: colors.ring, backgroundColor: colors.bg2 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold">Lessons</div>
                {loadingLessons ? (
                  <div className="text-xs" style={{ color: colors.text2 }}>
                    Loading...
                  </div>
                ) : null}
              </div>
              {lessonsError ? (
                <div className="text-xs" style={{ color: colors.danger || "#ef4444" }}>
                  {lessonsError}
                </div>
              ) : null}
              {!loadingLessons && !lessonsError && lessons.length === 0 ? (
                <div className="text-sm" style={{ color: colors.text2 }}>
                  No lessons yet.
                </div>
              ) : null}
              <div className="space-y-2">
                {lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id || idx}
                    className="flex items-start justify-between gap-2 rounded-lg px-3 py-2"
                    style={{ backgroundColor: colors.card || colors.bg }}
                  >
                    <div>
                      <div className="text-sm font-semibold">
                        Lesson {lesson.order_index ?? idx + 1}: {lesson.title}
                      </div>
                      <div className="text-xs mt-1" style={{ color: colors.text2 }}>
                        {formatLessonDuration(lesson.duration_seconds) || "Duration N/A"}
                      </div>
                    </div>
                    {lesson.video_path ? (
                      <span
                        className="text-[11px] px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: `${colors.accent}22`,
                          color: colors.accent,
                          border: `1px solid ${colors.ring}`,
                        }}
                      >
                        Video
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div
              className="p-4 rounded-xl border space-y-3"
              style={{ borderColor: colors.ring, backgroundColor: colors.bg2 }}
            >
              <div className="font-semibold">First lesson preview</div>
              {firstLessonVideoUrl ? (
                <video
                  controls
                  className="w-full max-h-72 rounded-xl"
                  src={firstLessonVideoUrl}
                />
              ) : (
                <div
                  className="text-sm h-full min-h-[120px] flex items-center justify-center text-center px-4"
                  style={{ color: colors.text2, backgroundColor: colors.card || colors.bg }}
                >
                  No video uploaded yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className="p-4 border-t flex flex-col sm:flex-row sm:justify-end gap-3"
          style={{ borderColor: colors.ring }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg w-full sm:w-auto"
            style={{
              backgroundColor: colors.accent,
              color: "#000",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
