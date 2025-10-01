import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function TrendsMini({ data = {} }) {
  const { colors } = useTheme();

  const MiniRow = ({ label, items = [] }) => {
    const max = Math.max(1, ...items.map((i) => i.cur || 0));
    return (
      <div className="mb-3">
        <div className="text-sm mb-1" style={{ color: colors.text2 }}>{label}</div>
        <div className="flex items-center gap-3">
          {items.map((it) => (
            <div key={it.m} className="flex-1">
              <div className="text-xs" style={{ color: colors.text }}>{it.m}</div>
              <div className="h-2 rounded" style={{ background: colors.bg2, border: `1px solid ${colors.ring}`, overflow: "hidden" }}>
                <div style={{ width: `${Math.round((it.cur / max) * 100)}%`, height: "100%", background: colors.accent }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 rounded-2xl border" style={{ backgroundColor: colors.bg2, borderColor: colors.ring }}>
      <MiniRow label="Revenue trend" items={data.revenue || []} />
      <MiniRow label="Engagement trend" items={data.engagement || []} />
    </div>
  );
}