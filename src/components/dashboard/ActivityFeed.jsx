/*
 * Activity Feed component for dashboard surfaces within the admin interface.
 * Keeps rendering behavior isolated so higher-level modules can focus on data flow.
 */

import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

const TYPE_LABELS = {
  signup: "Signup",
  login: "Login",
  course: "Course",
  review: "Review",
};

const TYPE_TONES = {
  signup: "rgba(34,197,94,0.14)",
  login: "rgba(212,175,55,0.14)",
  course: "rgba(59,130,246,0.14)",
  review: "rgba(168,85,247,0.14)",
};

export default function ActivityFeed({
  items = [],
  rangeLabel = "",
  loading = false,
}) {
  const { colors } = useTheme();

  return (
    <div
      className="rounded-2xl border p-4"
      style={{ backgroundColor: colors.bg2, borderColor: colors.ring }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-sm font-semibold" style={{ color: colors.text }}>
          Recent Activity
        </div>
        <div className="text-xs" style={{ color: colors.text2 }}>
          {rangeLabel || "Filtered events"}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-xl border p-3"
              style={{
                backgroundColor: colors.card || colors.hover,
                borderColor: colors.ring,
              }}
            >
              <div
                className="h-11 w-11 rounded-lg"
                style={{ backgroundColor: colors.hover }}
              />
              <div className="flex-1 space-y-2">
                <div
                  className="h-4 w-3/4 rounded"
                  style={{ backgroundColor: colors.hover }}
                />
                <div
                  className="h-3 w-full rounded"
                  style={{ backgroundColor: colors.hover }}
                />
                <div
                  className="h-3 w-20 rounded"
                  style={{ backgroundColor: colors.hover }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-sm" style={{ color: colors.text2 }}>
          No recent activity was found for this range.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const badgeLabel = TYPE_LABELS[item.type] || "Activity";
            const badgeBackground = TYPE_TONES[item.type] || colors.hover;

            return (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-xl border p-3"
                style={{
                  backgroundColor: colors.card || colors.hover,
                  borderColor: colors.ring,
                }}
              >
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="h-11 w-11 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xs font-semibold uppercase"
                    style={{
                      backgroundColor: badgeBackground,
                      color: colors.text,
                      border: `1px solid ${colors.ring}`,
                    }}
                  >
                    {badgeLabel.slice(0, 3)}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className="truncate text-sm font-medium"
                      style={{ color: colors.text }}
                    >
                      {item.title}
                    </div>
                    <div
                      className="whitespace-nowrap rounded-full px-2 py-1 text-[11px]"
                      style={{
                        backgroundColor: badgeBackground,
                        color: colors.text,
                        border: `1px solid ${colors.ring}`,
                      }}
                    >
                      {badgeLabel}
                    </div>
                  </div>

                  <div
                    className="mt-1 line-clamp-2 text-xs"
                    style={{ color: colors.text2 }}
                  >
                    {item.subtitle}
                  </div>

                  <div className="mt-2 text-[11px]" style={{ color: colors.text2 }}>
                    {item.atLabel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
