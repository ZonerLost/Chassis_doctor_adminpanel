import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function AnalyticsStatCard({ label, value, help }) {
  const { colors } = useTheme();

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        backgroundColor: colors.bg2,
        border: `1px solid ${colors.ring}`,
      }}
    >
      <div
        className="text-[11px] font-semibold uppercase tracking-[0.12em]"
        style={{ color: colors.accent }}
      >
        {label}
      </div>

      <div
        className="mt-2 text-2xl font-semibold"
        style={{ color: colors.text }}
      >
        {value}
      </div>

      {help ? (
        <div className="mt-1 text-sm" style={{ color: colors.text2 }}>
          {help}
        </div>
      ) : null}
    </div>
  );
}