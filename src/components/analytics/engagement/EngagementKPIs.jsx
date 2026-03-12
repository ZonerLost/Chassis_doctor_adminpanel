import React from "react";
import AnalyticsStatCard from "../shared/AnalyticsStatCard";

export default function EngagementKPIs({ items = [] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <AnalyticsStatCard
          key={item.key || item.label}
          label={item.label}
          value={item.value}
          help={item.help}
        />
      ))}
    </div>
  );
}