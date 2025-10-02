import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function ActivityFeed({ items = [] }) {
  const { colors } = useTheme();

  return (
    <div className="p-4 rounded-2xl border" style={{ backgroundColor: colors.bg2, borderColor: colors.ring }}>
      <div className="text-sm font-semibold mb-3" style={{ color: colors.text }}>Recent Activity</div>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.id} className="text-sm">
            <div style={{ color: colors.text }}>{it.title}</div>
            <div style={{ color: colors.text2, fontSize: 12 }}>{it.by} • {it.when}</div>
          </li>
        ))}
        {items.length === 0 && <li style={{ color: colors.text2 }}>No recent activity</li>}
      </ul>
    </div>
  );
}