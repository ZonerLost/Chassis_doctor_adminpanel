import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

const truncate = (t, n = 120) =>
  t && t.length > n ? t.slice(0, n - 1) + "…" : t || "—";

export default function CourseTable({ courses = [], onEdit }) {
  const { colors } = useTheme();
  const rows = Array.isArray(courses) ? courses : [];

  const formatCategory = (c) => c || "—";

  return (
    <div className="space-y-3">
      {/* Desktop / tablet: table (hidden on small screens) */}
      <div
        className="hidden md:block overflow-x-auto rounded-lg"
        style={{
          border: `1px solid ${colors.ring}`,
          backgroundColor: colors.bg2,
        }}
      >
        <table
          className="min-w-[720px] w-full text-sm"
          style={{
            borderCollapse: "separate",
            borderSpacing: 0,
            backgroundColor: colors.bg2,
          }}
        >
          <thead>
            <tr
              style={{
                color: "#d4af37",
                borderBottom: `1px solid ${colors.ring}`,
              }}
            >
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody style={{ color: colors.text }}>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center"
                  style={{ color: colors.text2 }}
                >
                  No courses
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} style={{ backgroundColor: colors.bg2 }}>
                  <td
                    className="px-4 py-3"
                    style={{
                      color: colors.text,
                      borderBottom: `1px solid ${colors.ring}`,
                    }}
                  >
                    {r.title || r.name}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{
                      color: colors.text2,
                      borderBottom: `1px solid ${colors.ring}`,
                    }}
                  >
                    {formatCategory(r.category)}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{
                      color: colors.text2,
                      borderBottom: `1px solid ${colors.ring}`,
                    }}
                  >
                    {truncate(r.description)}
                  </td>
                  <td
                    className="px-4 py-3 text-right"
                    style={{ borderBottom: `1px solid ${colors.ring}` }}
                  >
                    <button
                      onClick={() => onEdit?.(r)}
                      className="px-3 py-1.5 rounded-xl border text-xs"
                      style={{
                        borderColor: colors.ring,
                        backgroundColor: colors.bg2,
                        color: colors.text,
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards */}
      <div className="md:hidden space-y-3">
        {rows.length === 0 ? (
          <div
            className="p-3 rounded-lg"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
              color: colors.text2,
            }}
          >
            No courses
          </div>
        ) : (
          rows.map((r) => (
            <div
              key={r.id}
              className="p-3 rounded-lg"
              style={{
                backgroundColor: colors.card || colors.bg2,
                border: `1px solid ${colors.ring}`,
                color: colors.text,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600 }}>{r.title || r.name}</div>
                  <div
                    style={{ color: colors.text2, fontSize: 13, marginTop: 6 }}
                  >
                    {formatCategory(r.category)}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: colors.text2, fontSize: 12 }}>
                    {r.views ? `${r.views} views` : ""}
                  </div>
                </div>
              </div>

              <div className="mt-3 text-sm" style={{ color: colors.text2 }}>
                {truncate(r.description, 200)}
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => onEdit?.(r)}
                  className="px-3 py-1.5 rounded-xl border text-xs"
                  style={{
                    borderColor: colors.ring,
                    backgroundColor: colors.bg2,
                    color: colors.text,
                  }}
                >
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
