import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

const fmt = (cents) => `${((cents || 0) / 100).toFixed(2)}`;

export default function PricingTable({ rows = [], loading, onEdit }) {
  const { colors } = useTheme();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[680px] w-full text-sm">
        <thead>
          <tr
            className="uppercase text-xs"
            style={{ color: colors.accent, backgroundColor: colors.hover }}
          >
            <th className="px-4 py-3 text-left">Course</th>
            <th className="px-4 py-3 text-left">Access</th>
            <th className="px-4 py-3 text-left">Price</th>
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
                colSpan={4}
                className="px-4 py-8 text-center"
                style={{ color: colors.text2 }}
              >
                Loading…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-8 text-center"
                style={{ color: colors.text2 }}
              >
                No courses
              </td>
            </tr>
          ) : (
            rows.map((p) => (
              <tr
                key={p.courseId}
                style={{ backgroundColor: colors.bg2 }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.hover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.bg2)}
              >
                <td className="px-4 py-3" style={{ color: colors.text }}>
                  {p.title}
                </td>
                <td className="px-4 py-3" style={{ color: colors.text2 }}>
                  {p.isPaid ? "Paid" : "Free"}
                </td>
                <td className="px-4 py-3" style={{ color: colors.text2 }}>
                  {p.isPaid ? fmt(p.priceCents) : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    className="px-3 py-1.5 rounded-xl border text-xs"
                    style={{
                      borderColor: colors.ring,
                      backgroundColor: colors.hover,
                      color: colors.text2,
                    }}
                    onClick={() => onEdit(p)}
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
