import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function KpiTiles({ kpis = [] }) {
  const { colors } = useTheme();

  const fmt = (v) =>
    typeof v === "number" ? v.toLocaleString() : v ?? "—";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {kpis.map((k) => (
        <div
          key={k.key}
          className="p-4 rounded-2xl border"
          style={{ backgroundColor: colors.bg2, borderColor: colors.ring, color: colors.text }}
        >
          <div className="text-sm" style={{ color: colors.text2 }}>{k.label}</div>
          <div className="text-2xl font-semibold mt-2" style={{ color: colors.gold }}>
            {k.isPercent ? `${fmt(k.value)}%` : fmt(k.value)}
          </div>
          {typeof k.change === "number" && (
            <div className="text-xs mt-1" style={{ color: k.change >= 0 ? colors.accent : colors.text2 }}>
              {k.change >= 0 ? "▲" : "▼"} {Math.abs(k.change)}%
            </div>
          )}
        </div>
      ))}
    </div>
  );
}