import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function EngagementKPIs({ items = [] }) {
  const { colors } = useTheme();

  // keep a safe default but render as a simple list (no responsive grid)
  const list = Array.isArray(items) ? items : [];

  if (list.length === 0) {
    return (
      <div style={{ color: colors.text }}>
        <div style={{ color: colors.text2 }}>No KPI data.</div>
      </div>
    );
  }

  return (
    <div style={{ color: colors.text }}>
      {list.map((k) => (
        <div
          key={k.id ?? k.key}
          style={{
            backgroundColor: colors.bg2,
            border: `1px solid ${colors.ring}`,
            padding: 12,
            borderRadius: 8,
            marginBottom: 10,
            color: colors.text,
          }}
        >
          <div style={{ color: colors.accent, fontWeight: 600, fontSize: 12 }}>
            {k.label}
          </div>
          <div style={{ fontSize: 18 }}>{k.value}</div>
          {k.sparkline && <div style={{ marginTop: 8 }}>{k.sparkline}</div>}
        </div>
      ))}
    </div>
  );
}
