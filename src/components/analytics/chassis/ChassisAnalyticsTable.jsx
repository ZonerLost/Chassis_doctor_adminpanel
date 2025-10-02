import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

function SimpleBar({ value, max }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  const { colors } = useTheme();

  return (
    <div className="w-full" style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          flex: 1,
          height: 8,
          borderRadius: 999,
          backgroundColor: colors.bg2,
          border: `1px solid ${colors.ring}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: colors.accent,
            boxShadow: `0 2px 6px ${colors.accent}26`,
            borderRadius: 999,
            transition: "width 300ms ease",
          }}
        />
      </div>
      <div style={{ width: 46, textAlign: "right", color: colors.text2, fontVariantNumeric: "tabular-nums" }}>
        {pct}%
      </div>
    </div>
  );
}

export default function ChassisAnalyticsTable({
  symptoms = [],
  fixes = [],
  loading,
}) {
  const { colors } = useTheme();
  const maxSym = Math.max(1, ...symptoms.map((s) => s.count || 0));
  const maxFix = Math.max(1, ...fixes.map((s) => s.count || 0));
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="overflow-x-auto">
        <table className="min-w-[520px] w-full text-sm">
          <thead>
            <tr
              className="uppercase text-xs"
              style={{ color: colors.accent, backgroundColor: colors.accent + "10" }}
            >
              <th className="px-4 py-3 text-left">Most Reported Symptoms</th>
              <th className="px-4 py-3 text-left">Count</th>
            </tr>
          </thead>
          <tbody
            className="divide-y"
            style={{ borderColor: colors.ring, color: colors.text }}
          >
            {loading ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-8 text-center"
                  style={{ color: colors.text2 }}
                >
                  Loading…
                </td>
              </tr>
            ) : symptoms.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-8 text-center"
                  style={{ color: colors.text2 }}
                >
                  No data
                </td>
              </tr>
            ) : (
              symptoms.map((s) => (
                <tr key={s.key} className="hover:bg-black/10">
                  <td className="px-4 py-3">{s.key}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-10 tabular-nums" style={{ color: colors.text2 }}>{s.count}</span>
                      <SimpleBar value={s.count} max={maxSym} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[520px] w-full text-sm">
          <thead>
            <tr
              className="uppercase text-xs"
              style={{ color: colors.accent, backgroundColor: colors.accent + "10" }}
            >
              <th className="px-4 py-3 text-left">Top Fixes Applied</th>
              <th className="px-4 py-3 text-left">Count</th>
            </tr>
          </thead>
          <tbody
            className="divide-y"
            style={{ borderColor: colors.ring, color: colors.text }}
          >
            {loading ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-8 text-center"
                  style={{ color: colors.text2 }}
                >
                  Loading…
                </td>
              </tr>
            ) : fixes.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-8 text-center"
                  style={{ color: colors.text2 }}
                >
                  No data
                </td>
              </tr>
            ) : (
              fixes.map((s) => (
                <tr key={s.key} className="hover:bg-black/10">
                  <td className="px-4 py-3">{s.key}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-10 tabular-nums" style={{ color: colors.text2 }}>{s.count}</span>
                      <SimpleBar value={s.count} max={maxFix} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
