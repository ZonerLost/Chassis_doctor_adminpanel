import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function ProgressTable({ rows = [], loading }) {
  const { colors } = useTheme();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[700px] w-full text-sm">
        <thead>
          <tr
            className="uppercase text-xs"
            style={{ color: "#d4af37", backgroundColor: colors.bg2 }}
          >
            <th className="px-4 py-3 text-left">Course</th>
            <th className="px-4 py-3 text-left">Learners</th>
            <th className="px-4 py-3 text-left">Avg Progress</th>
            <th className="px-4 py-3 text-left">Completion Rate</th>
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
                No data
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr
                key={r.courseId}
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
                  {r.title}
                </td>
                <td className="px-4 py-3" style={{ color: colors.text2 }}>
                  {r.learners}
                </td>
                <td className="px-4 py-3" style={{ color: colors.text2 }}>
                  {r.avgProgress}%
                </td>
                <td className="px-4 py-3" style={{ color: colors.text2 }}>
                  {r.completionRate}%
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
