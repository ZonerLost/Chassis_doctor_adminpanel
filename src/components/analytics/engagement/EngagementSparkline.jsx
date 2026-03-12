import React, { useMemo } from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function EngagementSparkline({ rows = [], height = 88 }) {
  const { colors } = useTheme();

  const { linePoints, areaPoints, maxValue, lastValue } = useMemo(() => {
    if (!rows.length) {
      return {
        linePoints: "",
        areaPoints: "",
        maxValue: 0,
        lastValue: 0,
      };
    }

    const max = Math.max(1, ...rows.map((row) => Number(row.au || 0)));
    const step = rows.length > 1 ? 100 / (rows.length - 1) : 100;

    const points = rows.map((row, index) => {
      const x = index * step;
      const y = 100 - (Number(row.au || 0) / max) * 100;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    });

    return {
      linePoints: points.join(" "),
      areaPoints: `0,100 ${points.join(" ")} 100,100`,
      maxValue: max,
      lastValue: Number(rows[rows.length - 1]?.au || 0),
    };
  }, [rows]);

  if (!rows.length) {
    return <div className="text-sm" style={{ color: colors.text2 }}>No activity data.</div>;
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs" style={{ color: colors.text2 }}>
          Daily Active Users
        </div>
        <div className="text-xs font-medium" style={{ color: colors.accent }}>
          Latest: {lastValue} • Peak: {maxValue}
        </div>
      </div>

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full"
        style={{ height }}
      >
        <defs>
          <linearGradient id="engagementAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.accent} stopOpacity="0.24" />
            <stop offset="100%" stopColor={colors.accent} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        <polyline
          fill="url(#engagementAreaGradient)"
          stroke="none"
          points={areaPoints}
        />
        <polyline
          fill="none"
          stroke={colors.accent}
          strokeWidth="2.2"
          points={linePoints}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}