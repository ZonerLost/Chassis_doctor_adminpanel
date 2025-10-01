import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function MediaTable({ rows = [], loading, onEdit }) {
  const { colors } = useTheme();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[760px] w-full text-sm">
        <thead>
          <tr
            className="uppercase text-xs"
            style={{ color: colors.accent, backgroundColor: colors.hover }}
          >
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Course</th>
            <th className="px-4 py-3 text-left">URL</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody
          className="divide-y"
          style={{ borderColor: colors.ring, color: colors.text }}
        >
          {loading ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-8 text-center"
                style={{ color: colors.text2 }}
              >
                Loading…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-8 text-center"
                style={{ color: colors.text2 }}
              >
                No media
              </td>
            </tr>
          ) : (
            rows.map((m) => (
              <tr
                key={m.id}
                style={{ backgroundColor: colors.bg2 }}
                className="hover:opacity-95"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = colors.hover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = colors.bg2)
                }
              >
                <td className="px-4 py-3" style={{ color: colors.text }}>
                  {m.title}
                </td>
                <td
                  className="px-4 py-3 uppercase"
                  style={{ color: colors.text2 }}
                >
                  {m.type}
                </td>
                <td className="px-4 py-3" style={{ color: colors.text2 }}>
                  {m.courseId}
                </td>
                <td className="px-4 py-3 truncate max-w-[280px]">
                  <a
                    href={m.url}
                    className="underline decoration-dotted"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: colors.accent }}
                  >
                    {m.url}
                  </a>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    className="px-3 py-1.5 rounded-xl border text-xs"
                    style={{
                      borderColor: colors.ring,
                      backgroundColor: colors.hover,
                      color: colors.text,
                    }}
                    onClick={() => onEdit(m)}
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
  );
}
