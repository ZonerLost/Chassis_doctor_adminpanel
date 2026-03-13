/*
 * System Health component for dashboard surfaces within the admin interface.
 * Keeps rendering behavior isolated so higher-level modules can focus on data flow.
 */

import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function SystemHealth({ items = [], loading = false }) {
  const { colors } = useTheme();

  return (
    <div
      className="rounded-2xl border p-4"
      style={{ backgroundColor: colors.bg2, borderColor: colors.ring }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-sm font-semibold" style={{ color: colors.text }}>
          Data Health
        </div>
        <div className="text-xs" style={{ color: colors.text2 }}>
          Users, courses, symptoms, reviews
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border p-3"
              style={{
                backgroundColor: colors.card || colors.hover,
                borderColor: colors.ring,
              }}
            >
              <div
                className="mb-2 h-4 w-24 rounded"
                style={{ backgroundColor: colors.hover }}
              />
              <div
                className="h-3 w-40 rounded"
                style={{ backgroundColor: colors.hover }}
              />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
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
                className="flex items-center justify-between gap-3 rounded-xl border p-3"
                style={{
                  backgroundColor: colors.card || colors.hover,
                  borderColor: colors.ring,
                }}
              >
                <div className="min-w-0">
                  <div
                    className="text-sm font-medium"
                    style={{ color: colors.text }}
                  >
                    {item.label}
                  </div>
                  <div className="mt-1 text-xs" style={{ color: colors.text2 }}>
                    {item.meta}
                  </div>
                </div>

                <div
                  className="whitespace-nowrap rounded-full px-2.5 py-1 text-xs"
                  style={{
                    color: isHealthy ? colors.ok || colors.accent : colors.warn,
                    backgroundColor: isHealthy
                      ? "rgba(34,197,94,0.12)"
                      : "rgba(245,158,11,0.14)",
                    border: `1px solid ${colors.ring}`,
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
