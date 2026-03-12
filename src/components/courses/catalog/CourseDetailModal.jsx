import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  MdAccessTime,
  MdCategory,
  MdCheckCircle,
  MdOndemandVideo,
  MdSchool,
} from "react-icons/md";
import { useTheme } from "../../../contexts/ThemeContext";
import useBodyScrollLock from "../../../hooks/useBodyScrollLock";
import {
  getLessonVideoUrl,
  listLessonsForCourse,
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

const formatLevel = (value) => {
  if (!value) return "-";
  const text = String(value).toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
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

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen || !course?.id) return undefined;

    let cancelled = false;

    setLessons([]);
    setLessonsError(null);
    setFirstLessonVideoUrl(null);
    setLoadingLessons(true);

    const loadLessons = async () => {
      try {
        const response = await listLessonsForCourse(course.id);
        if (cancelled) return;

        const nextLessons = Array.isArray(response?.data) ? response.data : [];
        setLessons(nextLessons);

        const firstWithVideo = nextLessons.find((lesson) => lesson?.video_path);
        if (firstWithVideo?.video_path) {
          try {
            const url = await getLessonVideoUrl(firstWithVideo.video_path);
            if (!cancelled) setFirstLessonVideoUrl(url || null);
          } catch (error) {
            console.error("Failed to resolve lesson video URL:", error);
          }
        }
      } catch (error) {
        console.error("Failed to load lessons:", error);
        if (!cancelled) {
          setLessons([]);
          setLessonsError(error?.message || "Failed to load lessons");
        }
      } finally {
        if (!cancelled) setLoadingLessons(false);
      }
    };

    loadLessons();

    return () => {
      cancelled = true;
    };
  }, [course?.id, isOpen]);

  const panelStyle = useMemo(
    () => ({
      backgroundColor: colors.card || colors.bg2,
      color: colors.text,
      border: `1px solid ${colors.ring}`,
      boxShadow: "0 24px 64px rgba(0, 0, 0, 0.38)",
    }),
    [colors.bg2, colors.card, colors.ring, colors.text]
  );

  const sectionStyle = useMemo(
    () => ({
      border: `1px solid ${colors.ring}`,
      backgroundColor: colors.bg2,
    }),
    [colors.bg2, colors.ring]
  );

  const scrollAreaStyle = useMemo(
    () => ({
      WebkitOverflowScrolling: "touch",
      overscrollBehavior: "contain",
    }),
    []
  );

  const summaryCards = useMemo(
    () => [
      {
        icon: <MdCategory size={18} style={{ color: colors.accent }} />,
        label: "Category",
        value: course?.category || "-",
      },
      {
        icon: <MdSchool size={18} style={{ color: colors.accent }} />,
        label: "Level",
        value: formatLevel(course?.level),
      },
      {
        icon: <MdAccessTime size={18} style={{ color: colors.accent }} />,
        label: "Duration",
        value: formatDurationMinutes(course?.duration_minutes),
      },
      {
        icon: <MdOndemandVideo size={18} style={{ color: colors.accent }} />,
        label: "Lessons",
        value: loadingLessons ? "..." : String(lessons.length || 0),
      },
    ],
    [
      colors.accent,
      course?.category,
      course?.duration_minutes,
      course?.level,
      lessons.length,
      loadingLessons,
    ]
  );

  if (!isOpen || !course) return null;

  const title = course.title || course.name || "Course";
  const isPublished = !!course.is_published;

  return createPortal(
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-2 sm:p-4 lg:p-6">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Course details"
        className="relative flex h-[min(92vh,920px)] w-full max-w-6xl min-h-0 flex-col overflow-hidden rounded-[24px] sm:rounded-[28px]"
        style={panelStyle}
      >
        <div
          className="shrink-0 border-b px-4 py-4 sm:px-6 sm:py-5"
          style={{ borderColor: colors.ring }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="text-lg font-semibold sm:text-2xl">
                Course details
              </div>
              <div className="mt-1 text-sm" style={{ color: colors.text2 }}>
                Full course information, lesson list and media preview.
              </div>

              {detailError ? (
                <div
                  className="mt-2 text-xs"
                  style={{ color: colors.danger || "#ef4444" }}
                >
                  {detailError}
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              {loadingDetails ? (
                <div className="text-xs" style={{ color: colors.text2 }}>
                  Loading details...
                </div>
              ) : null}

              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
                style={{
                  backgroundColor: isPublished
                    ? `${colors.ok || "#22c55e"}20`
                    : colors.bg2,
                  color: isPublished ? colors.ok || "#22c55e" : colors.text2,
                  border: `1px solid ${colors.ring}`,
                }}
              >
                <MdCheckCircle size={14} />
                {isPublished ? "Published" : "Draft"}
              </span>
            </div>
          </div>
        </div>

        <div
          className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6"
          style={scrollAreaStyle}
        >
          <div className="space-y-6 py-4 sm:py-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
              <div className="min-w-0 space-y-4">
                <div
                  className="overflow-hidden rounded-2xl border"
                  style={{
                    borderColor: colors.ring,
                    backgroundColor: colors.bg2,
                  }}
                >
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={title}
                      loading="lazy"
                      className="h-56 w-full object-cover sm:h-72"
                    />
                  ) : (
                    <div
                      className="flex h-56 w-full items-center justify-center px-4 text-center text-sm sm:h-72"
                      style={{ color: colors.text2 }}
                    >
                      No thumbnail uploaded
                    </div>
                  )}
                </div>

                <div
                  className="grid grid-cols-1 gap-3 rounded-2xl p-4 sm:grid-cols-2"
                  style={sectionStyle}
                >
                  {summaryCards.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl p-3"
                      style={{ backgroundColor: colors.card || colors.bg }}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        {item.icon}
                        <span
                          className="text-xs uppercase tracking-wide"
                          style={{ color: colors.text2 }}
                        >
                          {item.label}
                        </span>
                      </div>
                      <div className="break-words font-semibold">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="min-w-0 space-y-4">
                <div className="rounded-2xl p-4 sm:p-5" style={sectionStyle}>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="break-words text-2xl font-semibold sm:text-3xl">
                      {title}
                    </h2>

                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: isPublished
                          ? `${colors.ok || "#22c55e"}20`
                          : `${colors.accent}18`,
                        color: isPublished ? colors.ok || "#22c55e" : colors.accent,
                        border: `1px solid ${colors.ring}`,
                      }}
                    >
                      {isPublished ? "Published" : "Draft"}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <div style={{ color: colors.text2 }}>Created</div>
                      <div className="mt-1 font-medium">
                        {formatDate(course?.created_at)}
                      </div>
                    </div>

                    <div>
                      <div style={{ color: colors.text2 }}>Course id</div>
                      <div className="mt-1 break-all font-medium">
                        {course?.id || "-"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl p-4 sm:p-5" style={sectionStyle}>
                  <div className="mb-3 text-base font-semibold">Description</div>
                  <div
                    className="text-sm leading-7"
                    style={{ color: colors.text2, whiteSpace: "pre-line" }}
                  >
                    {course.description || "No description provided."}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="rounded-2xl p-4 sm:p-5" style={sectionStyle}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold">Lessons</div>
                    <div className="mt-1 text-sm" style={{ color: colors.text2 }}>
                      {loadingLessons
                        ? "Loading lessons..."
                        : `${lessons.length} lesson${
                            lessons.length === 1 ? "" : "s"
                          } found`}
                    </div>
                  </div>
                </div>

                {lessonsError ? (
                  <div
                    className="mb-4 text-xs"
                    style={{ color: colors.danger || "#ef4444" }}
                  >
                    {lessonsError}
                  </div>
                ) : null}

                {!loadingLessons && !lessonsError && lessons.length === 0 ? (
                  <div className="text-sm" style={{ color: colors.text2 }}>
                    No lessons added yet.
                  </div>
                ) : null}

                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <div
                      key={lesson.id || index}
                      className="flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-start sm:justify-between"
                      style={{ backgroundColor: colors.card || colors.bg }}
                    >
                      <div className="min-w-0">
                        <div className="break-words text-sm font-semibold">
                          Lesson {lesson.order_index ?? index + 1}: {lesson.title}
                        </div>
                        <div className="mt-2 text-xs" style={{ color: colors.text2 }}>
                          {formatLessonDuration(lesson.duration_seconds) ||
                            "Duration N/A"}
                        </div>
                      </div>

                      {lesson.video_path ? (
                        <span
                          className="w-fit whitespace-nowrap rounded-full px-2.5 py-1 text-[11px]"
                          style={{
                            backgroundColor: `${colors.accent}18`,
                            color: colors.accent,
                            border: `1px solid ${colors.ring}`,
                          }}
                        >
                          Video
                        </span>
                      ) : (
                        <span
                          className="w-fit whitespace-nowrap rounded-full px-2.5 py-1 text-[11px]"
                          style={{
                            backgroundColor: colors.bg2,
                            color: colors.text2,
                            border: `1px solid ${colors.ring}`,
                          }}
                        >
                          No media
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 rounded-2xl p-4 sm:p-5" style={sectionStyle}>
                <div>
                  <div className="font-semibold">First lesson preview</div>
                  <div className="mt-1 text-sm" style={{ color: colors.text2 }}>
                    Displays the first available lesson video.
                  </div>
                </div>

                <div
                  className="overflow-hidden rounded-2xl"
                  style={{ backgroundColor: colors.card || colors.bg }}
                >
                  {firstLessonVideoUrl ? (
                    <video
                      controls
                      playsInline
                      preload="metadata"
                      poster={course.thumbnail_url || undefined}
                      className="aspect-video w-full bg-black"
                      src={firstLessonVideoUrl}
                    />
                  ) : (
                    <div
                      className="flex min-h-[220px] items-center justify-center px-5 text-center"
                      style={{ color: colors.text2 }}
                    >
                      No lesson video uploaded yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="shrink-0 border-t px-4 py-4 sm:px-6"
          style={{ borderColor: colors.ring }}
        >
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="w-full rounded-xl px-5 py-3 font-semibold sm:w-auto"
              style={{
                backgroundColor: colors.accent,
                color: "#000",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}