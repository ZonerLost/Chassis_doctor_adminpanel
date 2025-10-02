import React from "react";

export const Checkbox = ({ checked, onChange }) => (
  <input
    type="checkbox"
    className="h-4 w-4 rounded border-transparent"
    checked={!!checked}
    onChange={(e) => onChange?.(e.target.checked)}
  />
);

export const StatusPill = ({ status }) => {
  const map = { Published: "#22C55E", Draft: "#A3A7B7", Scheduled: "#F59E0B" };
  const c = map[status] || "#A3A7B7";
  return (
    <span
      className="px-2 py-0.5 rounded-md text-[11px] font-semibold"
      style={{ backgroundColor: `${c}22`, color: c }}
    >
      {status}
    </span>
  );
};

export const Chip = ({ children }) => (
  <span
    className="px-2 py-0.5 rounded-md text-[11px] font-semibold"
    style={{
      backgroundColor: "rgba(255,255,255,0.06)",
      color: "#A3A7B7",
      border: "1px solid rgba(110,86,207,0.25)",
    }}
  >
    {children}
  </span>
);