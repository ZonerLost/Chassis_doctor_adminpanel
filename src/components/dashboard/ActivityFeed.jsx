import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

function formatRelativeTime(value) {
  if (!value) return "—";

  const input = new Date(value).getTime();
  if (Number.isNaN(input)) return "—";

  const seconds = Math.floor((Date.now() - input) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export default function ActivityFeed({ items = [] }) {
  const { colors } = useTheme();

  const typeLabelMap = {
    review: "Review",
    login: "Login",
    course: "Course",
    signup: "Signup",
  };

  return (
    <div
      className="rounded-2xl border p-4"
      style={{ backgroundColor: colors.bg2, borderColor: colors.ring }}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="text-sm font-semibold" style={{ color: colors.text }}>
          Recent Activity
        </div>
        <div className="text-xs" style={{ color: colors.text2 }}>
          Live from database
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-sm" style={{ color: colors.text2 }}>
          No recent activity found.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-xl p-3"
              style={{
                backgroundColor: colors.card || colors.hover,
                border: `1px solid ${colors.ring}`,
              }}
            >
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="h-11 w-11 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div
                  className="h-11 w-11 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold uppercase"
                  style={{
                    backgroundColor: colors.hover,
                    color: colors.text2,
                    border: `1px solid ${colors.ring}`,
                  }}
                >
                  {(typeLabelMap[item.type] || "Act").slice(0, 3)}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div
                    className="text-sm font-medium truncate"
                    style={{ color: colors.text }}
                  >
                    {item.title}
                  </div>
                  <div
                    className="text-[11px] px-2 py-1 rounded-full whitespace-nowrap"
                    style={{
                      backgroundColor: colors.hover,
                      color: colors.text2,
                      border: `1px solid ${colors.ring}`,
                    }}
                  >
                    {typeLabelMap[item.type] || "Activity"}
                  </div>
                </div>

                <div
                  className="mt-1 text-xs line-clamp-2"
                  style={{ color: colors.text2 }}
                >
                  {item.subtitle}
                </div>

                <div className="mt-2 text-[11px]" style={{ color: colors.text2 }}>
                  {formatRelativeTime(item.at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}