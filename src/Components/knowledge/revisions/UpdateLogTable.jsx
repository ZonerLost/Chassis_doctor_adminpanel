import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function UpdateLogTable({ rows = [], loading }) {
  const { colors } = useTheme();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[720px] w-full text-sm">
        <thead>
          <tr
            className="uppercase text-xs"
            style={{ color: colors.accent, backgroundColor: colors.bg2 }}
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
                <td className="px-4 py-3" style={{ color: colors.text }}>
                  {r.articleId}
                </td>
                <td className="px-4 py-3" style={{ color: colors.text2 }}>
                  v{r.version}
                </td>
                <td className="px-4 py-3" style={{ color: colors.text2 }}>
                  {r.message}
                </td>
                <td className="px-4 py-3" style={{ color: colors.text2 }}>
                  {new Intl.DateTimeFormat(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(typeof r.at === "number" ? r.at : new Date(r.at))}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
