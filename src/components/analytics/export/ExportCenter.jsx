import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function ExportCenter() {
  const { colors } = useTheme();

  // Removed unused 'type', 'cadence', 'email', and 'schedules' state

  return (
    <div style={{ padding: 12, color: colors.text }}>
      <div
        style={{
          marginBottom: 12,
          backgroundColor: colors.bg2,
          border: `1px solid ${colors.ring}`,
          padding: 12,
          borderRadius: 8,
        }}
      >
        <h3 style={{ margin: 0, color: colors.accent }}>Export Options</h3>
        {/* keep simple stacked layout */}
        <div style={{ marginTop: 8 }}>
          <label
            style={{
              color: colors.text2,
              display: "block",
              marginBottom: 6,
            }}
          >
            Format
          </label>
          <select
            style={{
              width: "100%",
              padding: 8,
              border: `1px solid ${colors.ring}`,
              backgroundColor: colors.bg2,
              color: colors.text,
            }}
          >
            <option>CSV</option>
            <option>JSON</option>
          </select>
        </div>
      </div>

      <div
        style={{
          backgroundColor: colors.bg2,
          border: `1px solid ${colors.ring}`,
          padding: 12,
          borderRadius: 8,
        }}
      >
        <h4 style={{ margin: 0, color: colors.accent }}>Export History</h4>
        <div style={{ marginTop: 8, color: colors.text2 }}>No exports yet.</div>
      </div>
    </div>
  );
}
