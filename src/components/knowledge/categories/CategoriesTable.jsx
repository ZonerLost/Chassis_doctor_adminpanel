import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function CategoriesTable({ rows = [], onEdit }) {
  const { colors } = useTheme();

  const formatCount = (n) => (typeof n === "number" ? n : 0);

  return (
    <div>
      {/* Desktop / tablet: table (scrolls horizontally on small widths) */}
      <div
        className="hidden md:block overflow-x-auto rounded-lg"
        style={{
          border: `1px solid ${colors.ring}`,
          backgroundColor: colors.bg2,
        }}
      >
        <table
          className="min-w-[640px] w-full text-sm"
          style={{
            borderCollapse: "separate",
            borderSpacing: 0,
            backgroundColor: colors.bg2,
          }}
        >
          <thead>
            <tr
              className="uppercase text-xs"
              style={{
                color: "#d4af37",
                borderBottom: `1px solid ${colors.ring}`,
              }}
            >
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Articles</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody style={{ color: colors.text }}>
            {!Array.isArray(rows) || rows.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-8 text-center"
                  style={{ color: colors.text2 }}
                >
                  No categories
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-opacity-50 transition-colors duration-150"
                  style={{ backgroundColor: colors.bg2 }}
                >
                  <td
                    className="px-4 py-3 font-medium"
                    style={{
                      color: colors.text,
                      borderBottom: `1px solid ${colors.ring}`,
                    }}
                  >
                    {r.name}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{
                      color: colors.text2,
                      borderBottom: `1px solid ${colors.ring}`,
                    }}
                  >
                    {formatCount(r.count)}
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
                      aria-label={`Edit ${r.name}`}
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
        {!Array.isArray(rows) || rows.length === 0 ? (
          <div
            className="p-3 rounded-lg"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
              color: colors.text2,
            }}
          >
            No categories
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
                  <div style={{ fontWeight: 600, color: colors.text }}>
                    {r.name}
                  </div>
                  <div
                    style={{ color: colors.text2, fontSize: 13, marginTop: 6 }}
                  >
                    {formatCount(r.count)} articles
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    alignItems: "flex-end",
                  }}
                >
                  <button
                    onClick={() => onEdit?.(r)}
                    className="px-3 py-1.5 rounded-xl border text-xs"
                    style={{
                      borderColor: colors.ring,
                      backgroundColor: colors.bg2,
                      color: colors.text,
                    }}
                    aria-label={`Edit ${r.name}`}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
