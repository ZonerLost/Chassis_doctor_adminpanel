import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function SystemHealth({ health = {} }) {
  const { colors } = useTheme();

  const Row = ({ name, s }) => (
    <div className="flex items-center justify-between py-2">
      <div style={{ color: colors.text }}>{name}</div>
      <div style={{ color: s.status === "Operational" ? colors.accent : colors.text2, fontSize: 13 }}>
        {s.status} {s.incidents ? `• ${s.incidents} issues` : ""}
      </div>
    </div>
  );

  return (
    <div className="p-4 rounded-2xl border" style={{ backgroundColor: colors.bg2, borderColor: colors.ring }}>
      <div className="text-sm font-semibold mb-3" style={{ color: colors.text }}>System Health</div>
      <div>
        {Object.entries(health).map(([k, v]) => (
          <Row key={k} name={k.replace(/([-_])/g, " ")} s={v} />
        ))}
        {Object.keys(health).length === 0 && <div style={{ color: colors.text2 }}>No status available</div>}
      </div>
    </div>
  );
}