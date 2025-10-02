import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function CategoriesTable({ rows = [], loading, onEdit }) {
  const { colors } = useTheme();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[520px] w-full text-sm">
        <thead>
          <tr
            className="uppercase text-xs"
            style={{ color: "#d4af37", backgroundColor: colors.hover }}
          >
            <th className="px-4 py-3 text-left">Name</th>
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
                colSpan={2}
                className="px-4 py-8 text-center"
                style={{ color: colors.text2 }}
              >
                Loading…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={2}
                className="px-4 py-8 text-center"
                style={{ color: colors.text2 }}
              >
                No categories
              </td>
            </tr>
          ) : (
            rows.map((c) => (
              <tr
                key={c.id}
                style={{ backgroundColor: colors.bg2 }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = colors.hover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = colors.bg2)
                }
              >
                <td className="px-4 py-3" style={{ color: colors.text }}>
                  {c.name}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    className="px-3 py-1.5 rounded-xl border text-xs"
                    style={{
                      borderColor: colors.ring,
                      backgroundColor: colors.bg2,
                      color: colors.text2,
                    }}
                    onClick={() => onEdit && onEdit(c)}
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
