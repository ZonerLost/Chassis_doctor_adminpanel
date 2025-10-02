import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

const fmtUSD = (cents) => `$${((cents || 0) / 100).toFixed(2)}`;

export default function CourseAnalyticsTable({ rows = [], loading }) {
  const { colors } = useTheme();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[820px] w-full text-sm">
        <thead>
          <tr
            className="uppercase text-xs"
            style={{ color: colors.accent, backgroundColor: colors.accent + "10" }}
          >
            <th className="px-4 py-3 text-left">Course</th>
            <th className="px-4 py-3 text-left">Enrollments</th>
            <th className="px-4 py-3 text-left">Completions</th>
            <th className="px-4 py-3 text-left">Completion Rate</th>
            <th className="px-4 py-3 text-left">Revenue</th>
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
                className="px-4 py-10 text-center"
                style={{ color: colors.text2 }}
              >
                No data
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.courseId} className="hover:bg-black/10">
                <td className="px-4 py-3 font-medium" style={{ color: colors.text }}>
                  {r.title}
                </td>
                <td className="px-4 py-3" style={{ color: colors.text2 }}>
                  {r.enrollments}
                </td>
                <td className="px-4 py-3" style={{ color: colors.text2 }}>
                  {r.completions}
                </td>
                <td className="px-4 py-3" style={{ color: colors.text2 }}>
                  {r.completionRate}%
                </td>
                <td className="px-4 py-3" style={{ color: colors.text2 }}>
                  {fmtUSD(r.revenueCents)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
