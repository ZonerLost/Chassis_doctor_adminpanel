import React from "react";
import { useTheme } from "../../../../contexts/ThemeContext";

export default function DateRangeBar({ from, to, onFrom, onTo }) {
  const { colors } = useTheme();

  const fmt = (v) =>
    v ? new Date(typeof v === "number" ? v : v).toISOString().slice(0, 10) : "";

  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        className="rounded-xl border px-3 py-2 text-sm"
        style={{
          borderColor: colors.ring,
          backgroundColor: colors.hover,
          color: colors.text,
        }}
        value={fmt(from)}
        onChange={(e) => onFrom && onFrom(e.target.value ? new Date(e.target.value).getTime() : null)}
      />
      <span className="text-sm px-1" style={{ color: colors.text2 }}>
        —
      </span>
      <input
        type="date"
        className="rounded-xl border px-3 py-2 text-sm"
        style={{
          borderColor: colors.ring,
          backgroundColor: colors.hover,
          color: colors.text,
        }}
        value={fmt(to)}
        onChange={(e) => onTo && onTo(e.target.value ? new Date(e.target.value).getTime() : null)}
      />
    </div>
  );
}