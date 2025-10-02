import React, { useMemo } from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function EngagementSparkline({ rows = [], height = 56 }) {
  const { colors } = useTheme();

  const points = useMemo(() => {
    if (!rows?.length) return "";
    const max = Math.max(1, ...rows.map((r) => r.au || 0));
    const step = rows.length > 1 ? 100 / (rows.length - 1) : 100;
    return rows
      .map(
        (r, i) =>
          `${(i * step).toFixed(2)},${(100 - ((r.au || 0) / max) * 100).toFixed(2)}`
      )
      .join(" ");
  }, [rows]);

  if (!rows?.length) return null;

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ height }} className="w-full">
      <polyline fill="none" stroke={colors.accent} strokeWidth="2" points={points} />
    </svg>
  );
}
