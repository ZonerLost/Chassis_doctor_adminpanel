/*
 * Course Table component for courses surfaces within the admin interface.
 * Keeps rendering behavior isolated so higher-level modules can focus on data flow.
 */

import React from "react";
import { MdEdit, MdOutlineVisibility } from "react-icons/md";
import { useTheme } from "../../../contexts/ThemeContext";

const truncate = (text, length = 120) =>
  text && text.length > length ? `${text.slice(0, length - 1)}…` : text || "-";

const formatDurationMinutes = (minutes) => {
  if (minutes == null || Number.isNaN(Number(minutes))) return "-";
  const total = Math.max(0, Number(minutes));
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  if (hours && mins) return `${hours}h ${mins}m`;
  if (hours) return `${hours}h`;
  return `${mins}m`;
};

const formatLevel = (value) => {
  if (!value) return "-";
  const text = String(value).toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export default function CourseTable({ courses = [], onEdit, onView }) {
  const { colors } = useTheme();
  const rows = Array.isArray(courses) ? courses : [];

  return (
    <div className="space-y-4">
      <div className="hidden md:block overflow-x-auto">
        <table
          className="min-w-[980px] w-full text-sm"
          style={{
            borderCollapse: "separate",
            borderSpacing: 0,
            backgroundColor: colors.bg2,
          }}
        >
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.ring}` }}>
              <th
                className="px-4 py-4 text-left text-sm font-semibold"
                style={{ color: colors.accent }}
              >
                Thumbnail
              </th>
              <th
                className="px-4 py-4 text-left text-sm font-semibold"
                style={{ color: colors.accent }}
              >
                Name
              </th>
              <th
                className="px-4 py-4 text-left text-sm font-semibold"
                style={{ color: colors.accent }}
              >
                Category
              </th>
              <th
                className="px-4 py-4 text-left text-sm font-semibold"
                style={{ color: colors.accent }}
              >
                Description
              </th>
              <th
                className="px-4 py-4 text-right text-sm font-semibold"
                style={{ color: colors.accent }}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody style={{ color: colors.text }}>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center"
                  style={{
                    color: colors.text2,
                    borderTop: `1px solid ${colors.ring}`,
                  }}
                >
                  No courses found.
                </td>
              </tr>
            ) : (
              rows.map((course) => (
                <tr key={course.id}>
                  <td
                    className="px-4 py-4 align-top"
                    style={{ borderTop: `1px solid ${colors.ring}` }}
                  >
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title || "Course thumbnail"}
                        className="h-14 w-24 rounded-xl object-cover"
                      />
                    ) : (
                      <div
                        className="h-14 w-24 rounded-xl"
                        style={{ backgroundColor: colors.card || colors.bg }}
                      />
                    )}
                  </td>

                  <td
                    className="px-4 py-4 align-top"
                    style={{ borderTop: `1px solid ${colors.ring}` }}
                  >
                    <div className="font-semibold text-[15px]">
                      {course.title || course.name || "-"}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                        style={{
                          backgroundColor: `${colors.accent}18`,
                          color: colors.accent,
                          border: `1px solid ${colors.ring}`,
                        }}
                      >
                        {formatLevel(course.level)}
                      </span>

                      <span
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                        style={{
                          backgroundColor: colors.card || colors.bg,
                          color: colors.text2,
                          border: `1px solid ${colors.ring}`,
                        }}
                      >
                        {formatDurationMinutes(course.duration_minutes)}
                      </span>

                      <span
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                        style={{
                          backgroundColor: course.is_published
                            ? `${colors.ok || "#22c55e"}18`
                            : colors.card || colors.bg,
                          color: course.is_published
                            ? colors.ok || "#22c55e"
                            : colors.text2,
                          border: `1px solid ${colors.ring}`,
                        }}
                      >
                        {course.is_published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </td>

                  <td
                    className="px-4 py-4 align-top"
                    style={{
                      color: colors.text2,
                      borderTop: `1px solid ${colors.ring}`,
                    }}
                  >
                    {course.category || "-"}
                  </td>

                  <td
                    className="px-4 py-4 align-top"
                    style={{
                      color: colors.text2,
                      borderTop: `1px solid ${colors.ring}`,
                      maxWidth: 360,
                    }}
                  >
                    {truncate(course.description, 130)}
                  </td>

                  <td
                    className="px-4 py-4 align-top text-right"
                    style={{ borderTop: `1px solid ${colors.ring}` }}
                  >
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onView?.(course)}
                        className="px-3 py-2 rounded-xl text-xs font-medium inline-flex items-center gap-1.5"
                        style={{
                          border: `1px solid ${colors.ring}`,
                          backgroundColor: colors.card || colors.bg,
                          color: colors.text,
                        }}
                      >
                        <MdOutlineVisibility size={15} />
                        View
                      </button>

                      <button
                        onClick={() => onEdit?.(course)}
                        className="px-3 py-2 rounded-xl text-xs font-medium inline-flex items-center gap-1.5"
                        style={{
                          border: `1px solid ${colors.ring}`,
                          backgroundColor: colors.card || colors.bg,
                          color: colors.text,
                        }}
                      >
                        <MdEdit size={15} />
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {rows.length === 0 ? (
          <div
            className="p-4 rounded-2xl text-sm"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
              color: colors.text2,
            }}
          >
            No courses found.
          </div>
        ) : (
          rows.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl p-4"
              style={{
                backgroundColor: colors.card || colors.bg2,
                border: `1px solid ${colors.ring}`,
                color: colors.text,
              }}
            >
              <div className="flex gap-3">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title || "Course thumbnail"}
                    className="h-16 w-20 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className="h-16 w-20 rounded-xl flex-shrink-0"
                    style={{ backgroundColor: colors.bg2 }}
                  />
                )}

                <div style={{ minWidth: 0 }} className="flex-1">
                  <div className="font-semibold text-[15px] break-words">
                    {course.title || course.name || "-"}
                  </div>

                  <div
                    className="text-sm mt-1 break-words"
                    style={{ color: colors.text2 }}
                  >
                    {course.category || "-"}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                      style={{
                        backgroundColor: `${colors.accent}18`,
                        color: colors.accent,
                        border: `1px solid ${colors.ring}`,
                      }}
                    >
                      {formatLevel(course.level)}
                    </span>

                    <span
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                      style={{
                        backgroundColor: colors.bg2,
                        color: colors.text2,
                        border: `1px solid ${colors.ring}`,
                      }}
                    >
                      {formatDurationMinutes(course.duration_minutes)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-sm leading-6" style={{ color: colors.text2 }}>
                {truncate(course.description, 180)}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onView?.(course)}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium inline-flex items-center justify-center gap-1.5"
                  style={{
                    border: `1px solid ${colors.ring}`,
                    backgroundColor: colors.bg2,
                    color: colors.text,
                  }}
                >
                  <MdOutlineVisibility size={16} />
                  View
                </button>

                <button
                  onClick={() => onEdit?.(course)}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium inline-flex items-center justify-center gap-1.5"
                  style={{
                    border: `1px solid ${colors.ring}`,
                    backgroundColor: colors.bg2,
                    color: colors.text,
                  }}
                >
                  <MdEdit size={16} />
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}