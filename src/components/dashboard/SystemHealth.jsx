import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function SystemHealth({ items = [] }) {
  const { colors } = useTheme();

  return (
    <div
      className="rounded-2xl border p-4"
      style={{ backgroundColor: colors.bg2, borderColor: colors.ring }}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="text-sm font-semibold" style={{ color: colors.text }}>
          Data Health
        </div>
        <div className="text-xs" style={{ color: colors.text2 }}>
          Users, content and feedback
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-sm" style={{ color: colors.text2 }}>
          No health data found.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const isHealthy = item.status === "Healthy";

            return (
              <div
                key={item.key}
                className="flex items-center justify-between gap-3 rounded-xl p-3"
                style={{
                  backgroundColor: colors.card || colors.hover,
                  border: `1px solid ${colors.ring}`,
                }}
              >
                <div className="min-w-0">
                  <div
                    className="text-sm font-medium capitalize"
                    style={{ color: colors.text }}
                  >
                    {item.label}
                  </div>
                  <div className="text-xs mt-1" style={{ color: colors.text2 }}>
                    {item.meta}
                  </div>
                </div>

                <div
                  className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap"
                  style={{
                    color: isHealthy ? colors.accent : "#f59e0b",
                    border: `1px solid ${colors.ring}`,
                    backgroundColor: colors.hover,
                  }}
                >
                  {item.status}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}