import React from "react";
import { useTheme } from "../contexts/ThemeContext";

export default function SupportMediaSettingsPage() {
  const { colors } = useTheme();

  return (
    <div className="space-y-4">
      <h2 style={{ color: colors.text }} className="text-xl font-semibold">
        Media Settings
      </h2>
      <div
        className="rounded-2xl p-4"
        style={{
          backgroundColor: colors.bg2,
          border: `1px solid ${colors.ring}`,
        }}
      >
        <div style={{ color: colors.text2 }}>
          No media-specific settings yet. This page is a placeholder for
          media-related configuration (e.g. uploads, storage, CDN).
        </div>
      </div>
    </div>
  );
}
