import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

function Kpi({ label, value, hint }) {
  const { colors } = useTheme();
  return (
    <div
      className="p-4 rounded-2xl border"
      style={{ borderColor: colors.ring, backgroundColor: colors.hover }}
    >
      <div className="text-xs mb-1" style={{ color: colors.text2 }}>
        {label}
      </div>
      <div className="text-xl font-semibold" style={{ color: colors.text }}>
        {value}
      </div>
      {hint && (
        <div className="text-xs mt-1" style={{ color: colors.text2 }}>
          {hint}
        </div>
      )}
    </div>
  );
}

export default function EngagementKPIs({ kpis = {} }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Kpi label="Avg Daily Active" value={kpis.avgAU ?? 0} />
      <Kpi label="Avg 7‑day Retention" value={`${kpis.avgR7 ?? 0}%`} />
      <Kpi
        label="Module Usage — Courses"
        value={kpis.modCourses ?? 0}
        hint="events over period"
      />
      <Kpi
        label="Module Usage — Chassis"
        value={kpis.modChassis ?? 0}
        hint="events over period"
      />
    </div>
  );
}
