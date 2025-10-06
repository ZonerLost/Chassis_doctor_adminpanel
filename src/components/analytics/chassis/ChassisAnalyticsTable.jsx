import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function ChassisAnalyticsTable({
  symptoms = [],
  fixes = [],
  loading,
}) {
  const { colors } = useTheme();

  return (
    <div>
      {/* Symptoms table (simple, non-responsive) */}
      <div
        style={{
          border: `1px solid ${colors.ring}`,
          backgroundColor: colors.bg2,
          borderRadius: 8,
        }}
      >
        <table
          className="min-w-full w-full text-sm"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr style={{ color: colors.accent }}>
              <th className="px-4 py-3 text-left">Most Reported Symptoms</th>
              <th className="px-4 py-3 text-left">Count</th>
            </tr>
          </thead>

          <tbody>
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
            ) : Array.isArray(symptoms) && symptoms.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-8 text-center"
                  style={{ color: colors.text2 }}
                >
                  No data
                </td>
              </tr>
            ) : (
              (symptoms || []).map((s) => (
                <tr
                  key={s.key}
                  style={{
                    borderBottom: `1px solid ${colors.ring}`,
                    backgroundColor: colors.bg2,
                  }}
                >
                  <td className="px-4 py-3" style={{ color: colors.text }}>
                    {s.key}
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {s.count}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ height: 16 }} />

      {/* Fixes table (simple, non-responsive) */}
      <div
        style={{
          border: `1px solid ${colors.ring}`,
          backgroundColor: colors.bg2,
          borderRadius: 8,
        }}
      >
        <table
          className="min-w-full w-full text-sm"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr style={{ color: colors.accent }}>
              <th className="px-4 py-3 text-left">Top Fixes Applied</th>
              <th className="px-4 py-3 text-left">Count</th>
            </tr>
          </thead>

          <tbody>
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
            ) : Array.isArray(fixes) && fixes.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-8 text-center"
                  style={{ color: colors.text2 }}
                >
                  No data
                </td>
              </tr>
            ) : (
              (fixes || []).map((f) => (
                <tr
                  key={f.key}
                  style={{
                    borderBottom: `1px solid ${colors.ring}`,
                    backgroundColor: colors.bg2,
                  }}
                >
                  <td className="px-4 py-3" style={{ color: colors.text }}>
                    {f.key}
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {f.count}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
