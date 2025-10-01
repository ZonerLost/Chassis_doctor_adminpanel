import React from "react";
import { COLORS } from "../../ui/shared/theme";

export default function MappingRulesTable({
  rules,
  causes,
  fixes,
  loading,
  onEdit,
}) {
  const causeName = (id) => causes.find((c) => c.id === id)?.name || id;
  const fixName = (id) => fixes.find((f) => f.id === id)?.name || id;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[820px] w-full text-sm">
        <thead>
          <tr
            className="uppercase text-xs"
            style={{ color: "#22c55e", backgroundColor: "#f0fdf4" }}
          >
            <th className="px-4 py-3 text-left">Cause</th>
            <th className="px-4 py-3 text-left">Fix</th>
            <th className="px-4 py-3 text-left">Weight</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody
          className="divide-y"
          style={{ borderColor: COLORS.ring, color: COLORS.text }}
        >
          {loading ? (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-8 text-center"
                style={{ color: COLORS.text2 }}
              >
                Loading…
              </td>
            </tr>
          ) : rules.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-8 text-center"
                style={{ color: COLORS.text2 }}
              >
                No rules
              </td>
            </tr>
          ) : (
            rules.map((r) => (
              <tr key={r.id} className="hover:bg-black/10">
                <td className="px-4 py-3">{causeName(r.causeId)}</td>
                <td className="px-4 py-3">{fixName(r.fixId)}</td>
                <td className="px-4 py-3">{r.weight}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    className="px-3 py-1.5 rounded-xl border text-xs"
                    style={{
                      borderColor: COLORS.ring,
                      backgroundColor: COLORS.hover,
                      color: COLORS.text2,
                    }}
                    onClick={() => onEdit(r)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
