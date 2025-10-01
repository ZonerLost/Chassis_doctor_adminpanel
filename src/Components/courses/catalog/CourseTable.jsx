import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

const fmtPKR = (cents) => {
  const rs = (cents || 0) / 100;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    }).format(rs);
  } catch {
    return `$${rs.toFixed(2)}`;
  }
};

export default function CourseTable({ rows = [], loading, onEdit }) {
  const { colors } = useTheme();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[880px] w-full text-sm">
        <thead>
          <tr
            className="uppercase text-xs"
            style={{ color: colors.accent, backgroundColor: colors.hover }}
          >
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Level</th>
            <th className="px-4 py-3 text-left">Access</th>
            <th className="px-4 py-3 text-left">Price</th>
            <th className="px-4 py-3 text-left">Summary</th>
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
                colSpan={6}
                className="px-4 py-8 text-center"
                style={{ color: colors.text2 }}
              >
                Loading…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-10 text-center"
                style={{ color: colors.text2 }}
              >
                No courses found.
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
                <td className="px-4 py-3 font-medium" style={{ color: colors.text }}>
                  {c.title}
                </td>
                <td className="px-4 py-3 capitalize" style={{ color: colors.text2 }}>
                  {c.level}
                </td>
                <td className="px-4 py-3">
                  {c.isPaid ? (
                    <span
                      className="px-2 py-1 rounded-lg text-xs"
                      style={{
                        backgroundColor: colors.accent + "20",
                        color: colors.accent,
                      }}
                    >
                      Paid
                    </span>
                  ) : (
                    <span
                      className="px-2 py-1 rounded-lg text-xs"
                      style={{
                        backgroundColor: colors.ring,
                        color: colors.text2,
                      }}
                    >
                      Free
                    </span>
                  )}
                </td>
                <td className="px-4 py-3" style={{ color: colors.text2 }}>
                  {c.isPaid ? fmtPKR(c.priceCents) : "—"}
                </td>
                <td className="px-4 py-3" style={{ color: colors.text2 }}>
                  {c.summary}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    className="px-3 py-1.5 rounded-xl border text-xs"
                    style={{
                      borderColor: colors.ring,
                      backgroundColor: colors.hover,
                      color: colors.text2,
                    }}
                    onClick={() => onEdit(c)}
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
