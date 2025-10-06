import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function PricingTable({ plans = [], onEdit }) {
  const { colors } = useTheme();
  const rows = Array.isArray(plans) ? plans : [];

  return (
    <div className="space-y-3">
      {/* Desktop/tablet table */}
      <div
        className="hidden md:block overflow-x-auto rounded-lg"
        style={{
          border: `1px solid ${colors.ring}`,
          backgroundColor: colors.bg2,
        }}
      >
        <table
          className="min-w-[640px] w-full text-sm"
          style={{ borderCollapse: "separate", borderSpacing: 0 }}
        >
          <thead>
            <tr
              style={{
                color: "#d4af37",
                borderBottom: `1px solid ${colors.ring}`,
              }}
            >
              <th className="px-4 py-3 text-left">Plan</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Features</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody style={{ color: colors.text }}>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center"
                  style={{ color: colors.text2 }}
                >
                  No plans
                </td>
              </tr>
            ) : (
              rows.map((p) => (
                <tr key={p.id}>
                  <td
                    className="px-4 py-3"
                    style={{
                      color: colors.text,
                      borderBottom: `1px solid ${colors.ring}`,
                    }}
                  >
                    {p.name}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{
                      color: colors.text2,
                      borderBottom: `1px solid ${colors.ring}`,
                    }}
                  >
                    {p.price}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{
                      color: colors.text2,
                      borderBottom: `1px solid ${colors.ring}`,
                    }}
                  >
                    {(p.features || []).join(", ")}
                  </td>
                  <td
                    className="px-4 py-3 text-right"
                    style={{ borderBottom: `1px solid ${colors.ring}` }}
                  >
                    <button
                      onClick={() => onEdit?.(p)}
                      className="px-3 py-1.5 rounded-xl border text-xs"
                      style={{
                        borderColor: colors.ring,
                        backgroundColor: colors.bg2,
                        color: colors.text,
                      }}
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

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {rows.length === 0 ? (
          <div
            className="p-3 rounded-lg"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
              color: colors.text2,
            }}
          >
            No plans
          </div>
        ) : (
          rows.map((p) => (
            <div
              key={p.id}
              className="p-3 rounded-lg"
              style={{
                backgroundColor: colors.card || colors.bg2,
                border: `1px solid ${colors.ring}`,
                color: colors.text,
              }}
            >
              <div className="flex items-start justify-between">
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ color: colors.text2, fontSize: 13 }}>
                    {p.price}
                  </div>
                  <div
                    style={{
                      color: colors.text2,
                      fontSize: 13,
                      marginTop: 6,
                    }}
                  >
                    {(p.features || []).slice(0, 3).join(", ")}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => onEdit?.(p)}
                    className="px-3 py-1.5 rounded-xl border text-xs"
                    style={{
                      borderColor: colors.ring,
                      backgroundColor: colors.bg2,
                      color: colors.text,
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
