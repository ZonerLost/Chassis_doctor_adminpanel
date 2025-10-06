import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

function fmtUSD(cents) {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

export default function CourseAnalyticsTable({ summary = [], rows = [] }) {
  const { colors } = useTheme();

  const truncate = (text, n = 120) =>
    text && text.length > n ? text.slice(0, n - 1) + "…" : text || "";

  return (
    <div style={{ color: colors.text }}>
      {/* Responsive summary: stacked on xs, grid on sm+ */}
      <div
        className="mb-4"
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(1,1fr)",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(1,1fr)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(1,1fr)",
              gap: 12,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                gap: 12,
              }}
            >
              {(summary || []).map((s) => (
                <div
                  key={s.key}
                  className="rounded-lg"
                  style={{
                    padding: 12,
                    backgroundColor: colors.bg2,
                    border: `1px solid ${colors.ring}`,
                    color: colors.text,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      color: colors.accent,
                      fontWeight: 600,
                    }}
                  >
                    {s.title}
                  </div>
                  <div style={{ color: colors.text }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <div className="sm:hidden" aria-hidden={false}>
        {(rows || []).length === 0 ? (
          <div style={{ color: colors.text2, padding: 12 }}>No data</div>
        ) : (
          (rows || []).map((r) => (
            <div
              key={r.courseId}
              className="rounded-lg mb-3"
              style={{
                backgroundColor: colors.bg2,
                border: `1px solid ${colors.ring}`,
                padding: 12,
                color: colors.text,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{r.title}</div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    color: colors.text2,
                    fontSize: 13,
                  }}
                >
                  {r.enrollments} enrollments
                </div>
                <div
                  style={{
                    color: colors.text2,
                    fontSize: 13,
                  }}
                >
                  {r.completions} completions
                </div>
                <div
                  style={{
                    color: colors.text2,
                    fontSize: 13,
                  }}
                >
                  {r.completionRate}% rate
                </div>
                <div
                  style={{
                    color: colors.text2,
                    fontSize: 13,
                  }}
                >
                  {fmtUSD(r.revenueCents)}
                </div>
              </div>
              <div
                style={{
                  color: colors.text2,
                  marginBottom: 8,
                }}
              >
                {truncate(r.description || r.summary)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop / Tablet: table with horizontal scroll */}
      <div
        className="hidden sm:block overflow-x-auto rounded-lg"
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
              className="uppercase text-xs"
              style={{
                color: colors.accent,
                borderBottom: `1px solid ${colors.ring}`,
              }}
            >
              <th className="px-4 py-3 text-left">Course</th>
              <th className="px-4 py-3 text-left">Enrollments</th>
              <th className="px-4 py-3 text-left">Completions</th>
              <th className="px-4 py-3 text-left">Completion Rate</th>
              <th className="px-4 py-3 text-left">Revenue</th>
            </tr>
          </thead>

          <tbody style={{ backgroundColor: colors.bg2, color: colors.text }}>
            {(rows || []).length === 0 ? (
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
              (rows || []).map((r) => (
                <tr
                  key={r.courseId}
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
                    {r.title}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{
                      color: colors.text2,
                      borderBottom: `1px solid ${colors.ring}`,
                    }}
                  >
                    {r.enrollments}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{
                      color: colors.text2,
                      borderBottom: `1px solid ${colors.ring}`,
                    }}
                  >
                    {r.completions}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{
                      color: colors.text2,
                      borderBottom: `1px solid ${colors.ring}`,
                    }}
                  >
                    {r.completionRate}%
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{
                      color: colors.text2,
                      borderBottom: `1px solid ${colors.ring}`,
                    }}
                  >
                    {fmtUSD(r.revenueCents)}
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
