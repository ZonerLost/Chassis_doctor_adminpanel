import React from "react";
import { COLORS } from "../components/ui/shared/theme.js";

export default function DateRangeBar({ from, to, onFrom, onTo, extra }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      <label className="block text-xs">
        <span className="block mb-1" style={{ color: COLORS.text2 }}>
          From
        </span>
        <input
          type="date"
          className="w-full rounded-xl border px-3 py-2"
          style={{
            borderColor: COLORS.ring,
            backgroundColor: COLORS.hover,
            color: COLORS.text,
          }}
          value={from}
          onChange={(e) => onFrom(e.target.value)}
        />
      </label>
      <label className="block text-xs">
        <span className="block mb-1" style={{ color: COLORS.text2 }}>
          To
        </span>
        <input
          type="date"
          className="w-full rounded-xl border px-3 py-2"
          style={{
            borderColor: COLORS.ring,
            backgroundColor: COLORS.hover,
            color: COLORS.text,
          }}
          value={to}
          onChange={(e) => onTo(e.target.value)}
        />
      </label>
      <div className="md:col-span-2 flex items-end">{extra}</div>
    </div>
  );
}
