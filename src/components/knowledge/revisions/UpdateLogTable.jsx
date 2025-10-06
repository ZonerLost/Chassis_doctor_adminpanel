import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function UpdateLogTable({ rows = [], loading }) {
  const { colors } = useTheme();

  const fmtWhen = (at) => {
    try {
      const d = typeof at === "number" ? new Date(at) : new Date(at);
      return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);
    } catch {
      return "—";
    }
  };

  // Desktop / tablet: table; Mobile: stacked cards
  return (
    <div className="space-y-3">
      {/* Table for md+ */}
      <div
        className="hidden md:block overflow-x-auto rounded-lg"
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
                color: "#d4af37",
                borderBottom: `1px solid ${colors.ring}`,
              }}
            >
              <th className="px-4 py-3 text-left">Article</th>
              <th className="px-4 py-3 text-left">Version</th>
              <th className="px-4 py-3 text-left">Change</th>
              <th className="px-4 py-3 text-left">When</th>
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
                  No updates
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr
                  key={r.id}
                  style={{ backgroundColor: colors.bg2 }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.hover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.bg2)
                  }
                >
                  <td
                    className="px-4 py-3"
                    style={{
                      color: colors.text,
                      borderBottom: `1px solid ${colors.ring}`,
                    }}
                  >
                    {r.articleTitle ?? r.articleId}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{
                      color: colors.text2,
                      borderBottom: `1px solid ${colors.ring}`,
                    }}
                  >
                    v{r.version}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{
                      color: colors.text2,
                      borderBottom: `1px solid ${colors.ring}`,
                    }}
                  >
                    {r.message}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{
                      color: colors.text2,
                      borderBottom: `1px solid ${colors.ring}`,
                    }}
                  >
                    {fmtWhen(r.at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div
            className="p-3 rounded-lg"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
              color: colors.text2,
            }}
          >
            Loading…
          </div>
        ) : rows.length === 0 ? (
          <div
            className="p-3 rounded-lg"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
              color: colors.text2,
            }}
          >
            No updates
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
                    {r.articleTitle ?? r.articleId}
                  </div>
                  <div
                    style={{ color: colors.text2, fontSize: 13, marginTop: 6 }}
                  >
                    {r.message}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ color: colors.text2, fontSize: 12 }}>
                    v{r.version}
                  </div>
                  <div
                    style={{ color: colors.text2, fontSize: 12, marginTop: 6 }}
                  >
                    {fmtWhen(r.at)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
