import React from "react";
import { COLORS } from "../../ui/shared/theme";

export default function SimulationPanel({ results }) {
  if (!results || results.length === 0) {
    return (
      <div className="text-sm" style={{ color: COLORS.text2 }}>
        No simulation yet — select a symptom & track, then add rules.
      </div>
    );
  }
  return (
    <div className="grid gap-3">
      {results.map((r, idx) => (
        <div
          key={idx}
          className="p-3 rounded-xl border"
          style={{ borderColor: COLORS.ring, backgroundColor: COLORS.hover }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold" style={{ color: COLORS.text }}>
                {r.fix?.name}
              </div>
              <div className="text-xs" style={{ color: COLORS.text2 }}>
                {r.fix?.description}
              </div>
            </div>
            <div className="text-sm font-semibold" style={{ color: "#D4AF37" }}>
              {r.pct}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
