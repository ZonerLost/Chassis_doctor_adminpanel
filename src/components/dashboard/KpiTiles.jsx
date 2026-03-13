import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

function formatValue(value, suffix) {
  if (value == null) return "—";
  if (suffix === "%") return `${value}%`;
  if (typeof value === "number") return value.toLocaleString();
  return value;
}

function renderChange(change) {
  if (change == null) return "—";
  const abs = Math.abs(change);
  return `${change >= 0 ? "▲" : "▼"} ${abs}%`;
}

export default function KpiTiles({ items = [], loading = false }) {
  const { colors } = useTheme();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border p-4 animate-pulse"
            style={{
              backgroundColor: colors.bg2,
              borderColor: colors.ring,
            }}
          >
            <div
              className="h-4 w-24 rounded mb-4"
              style={{ backgroundColor: colors.hover }}
            />
            <div
              className="h-8 w-32 rounded mb-3"
              style={{ backgroundColor: colors.hover }}
            />
            <div
              className="h-3 w-20 rounded"
              style={{ backgroundColor: colors.hover }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        const changeColor =
          item.change == null
            ? colors.text2
            : item.change >= 0
            ? colors.accent
            : "#ef4444";

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
                  {formatValue(item.value, item.suffix)}
                </div>
                <div
                  className="mt-2 text-xs"
                  style={{ color: changeColor }}
                >
                  {renderChange(item.change)}
                </div>
              </div>

              {Icon ? (
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
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