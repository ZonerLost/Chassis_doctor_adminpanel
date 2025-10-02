import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function SettingsPanel() {
  const { colors } = useTheme();

  return (
    <div className="space-y-4">
      <h3 style={{ color: colors.text }} className="text-lg font-semibold">
        Brand & Organization
      </h3>

      <div
        className="rounded-2xl p-4"
        style={{
          backgroundColor: colors.bg2,
          border: `1px solid ${colors.ring}`,
        }}
      >
        <div style={{ color: colors.text2 }}>
          Brand settings placeholder — update brand, roles, plans and
          integrations here.
        </div>
        {/* Save button removed per design request */}
      </div>
    </div>
  );
}
