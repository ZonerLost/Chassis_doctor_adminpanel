import React from "react";
import { COLORS } from "../../ui/shared/theme";

export default function TrackConfigsTable({ rows, loading, onEdit }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[720px] w-full text-sm">
        <thead>
          <tr
            className="uppercase text-xs"
            style={{ color: "#22c55e", backgroundColor: "#f0fdf4" }}
          >
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Surface</th>
            <th className="px-4 py-3 text-left">Condition</th>
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
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-8 text-center"
                style={{ color: COLORS.text2 }}
              >
                No track configs
              </td>
            </tr>
          ) : (
            rows.map((t) => (
              <tr key={t.id} className="hover:bg-black/10">
                <td className="px-4 py-3">{t.type}</td>
                <td className="px-4 py-3">{t.surface}</td>
                <td className="px-4 py-3">{t.condition}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    className="px-3 py-1.5 rounded-xl border text-xs"
                    style={{
                      borderColor: COLORS.ring,
                      backgroundColor: COLORS.hover,
                      color: COLORS.text2,
                    }}
                    onClick={() => onEdit(t)}
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
