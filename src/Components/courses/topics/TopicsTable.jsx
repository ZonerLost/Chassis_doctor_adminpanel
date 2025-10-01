import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function TopicsTable({ rows = [], loading, onEdit }) {
  const { colors } = useTheme();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[680px] w-full text-sm">
        <thead>
          <tr
            className="uppercase text-xs"
            style={{ color: colors.accent, backgroundColor: colors.hover }}
          >
            <th className="px-4 py-3 text-left">Topic</th>
            <th className="px-4 py-3 text-left">Order</th>
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
                colSpan={3}
                className="px-4 py-8 text-center"
                style={{ color: colors.text2 }}
              >
                Loading…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="px-4 py-8 text-center"
                style={{ color: colors.text2 }}
              >
                No topics
              </td>
            </tr>
          ) : (
            rows.map((t) => (
              <tr
                key={t.id}
                style={{ backgroundColor: colors.bg2 }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = colors.hover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = colors.bg2)
                }
              >
                <td className="px-4 py-3" style={{ color: colors.text }}>
                  {t.name}
                </td>
                <td className="px-4 py-3" style={{ color: colors.text2 }}>
                  {t.order}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    className="px-3 py-1.5 rounded-xl border text-xs"
                    style={{
                      borderColor: colors.ring,
                      backgroundColor: colors.hover,
                      color: colors.text2,
                    }}
                    onClick={() => onEdit && onEdit(t)}
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
