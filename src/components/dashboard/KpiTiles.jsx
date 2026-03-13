/*
 * Kpi Tiles component for dashboard surfaces within the admin interface.
 * Keeps rendering behavior isolated so higher-level modules can focus on data flow.
 */

import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

const FALLBACK_LABEL = "\u2014";

function formatValue(value, decimals = 0) {
  if (value == null) return FALLBACK_LABEL;

  if (typeof value === "number") {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  return value || FALLBACK_LABEL;
}

function formatChange(change) {
  if (change == null) return FALLBACK_LABEL;

  const direction = change >= 0 ? "Up" : "Down";
  return `${direction} ${Math.abs(change).toFixed(1)}%`;
}

export default function KpiTiles({ items = [], loading = false }) {
  const { colors } = useTheme();

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border p-4"
            style={{
              backgroundColor: colors.bg2,
              borderColor: colors.ring,
            }}
          >
            <div
              className="mb-4 h-4 w-24 rounded"
              style={{ backgroundColor: colors.hover }}
            />
            <div
              className="mb-3 h-8 w-32 rounded"
              style={{ backgroundColor: colors.hover }}
            />
            <div
              className="h-3 w-28 rounded"
              style={{ backgroundColor: colors.hover }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        const hasChange = item.change != null;
        const toneColor =
          item.change == null
            ? colors.text2
            : item.change >= 0
              ? colors.ok || colors.accent
              : colors.danger;

        return (
          <div
            key={item.key}
            className="rounded-2xl border p-4"
            style={{
              backgroundColor: colors.bg2,
              borderColor: colors.ring,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm" style={{ color: colors.text2 }}>
                  {item.label}
                </div>

                <div
                  className="mt-2 text-2xl font-semibold"
                  style={{ color: colors.text }}
                >
                  {formatValue(item.value, item.decimals || 0)}
                  {item.suffix || ""}
                </div>

                <div
                  className="mt-2 text-xs"
                  style={{ color: hasChange ? toneColor : colors.text2 }}
                >
                  {hasChange ? formatChange(item.change) : item.helperText || FALLBACK_LABEL}
                </div>
              </div>

              {Icon ? (
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: colors.hover,
                    border: `1px solid ${colors.ring}`,
                    color: colors.gold || colors.accent,
                  }}
                >
                  <Icon size={18} />
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
