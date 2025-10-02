import React, { useMemo, useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function TrackConfigsTable({
  rows = [],
  loading = false,
  onEdit,
}) {
  const { colors } = useTheme();

  const [query, setQuery] = useState("");

  const processed = useMemo(() => {
    const q = String(query || "")
      .trim()
      .toLowerCase();
    let list = Array.isArray(rows) ? [...rows] : [];

    if (q) {
      list = list.filter((t) => {
        const name = String(t.trackName || "").toLowerCase();
        const category = String(t.category || "").toLowerCase();
        return name.includes(q) || category.includes(q);
      });
    }

    return list;
  }, [rows, query]);

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search track configurations..."
          className="px-3 py-2 rounded-xl text-sm w-full max-w-md"
          style={{
            backgroundColor: colors.bg2,
            color: colors.text,
            border: `1px solid ${colors.ring}`,
          }}
        />
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto rounded-lg"
        style={{
          border: `1px solid ${colors.ring}`,
          backgroundColor: colors.bg2,
        }}
      >
        <table className="min-w-full w-full text-sm">
          <thead>
            <tr
              className="uppercase text-xs"
              style={{
                color: "#d4af37",
                borderBottom: `1px solid ${colors.ring}`,
              }}
            >
              <th className="px-4 py-3 text-left">Track Name</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Front Wing</th>
              <th className="px-4 py-3 text-left">Rear Wing</th>
              <th className="px-4 py-3 text-left">Suspension</th>
              <th className="px-4 py-3 text-left">Brake Balance</th>
              <th className="px-4 py-3 text-left">Last Used</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center"
                  style={{ color: colors.text2 }}
                >
                  Loading…
                </td>
              </tr>
            ) : processed.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center"
                  style={{ color: colors.text2 }}
                >
                  No track configurations found.
                </td>
              </tr>
            ) : (
              processed.map((config) => (
                <tr
                  key={config.id}
                  style={{
                    backgroundColor: colors.bg2,
                    borderBottom: `1px solid ${colors.ring}`,
                  }}
                >
                  <td
                    className="px-4 py-3 font-medium"
                    style={{ color: colors.text }}
                  >
                    {config.trackName}
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {config.category}
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {config.frontWing}
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {config.rearWing}
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {config.suspension}
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {config.brakeBalance}%
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {config.lastUsed
                      ? new Date(config.lastUsed).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      className="px-3 py-1.5 rounded-xl border text-xs"
                      style={{
                        borderColor: colors.ring,
                        backgroundColor: colors.bg,
                        color: colors.text2,
                      }}
                      onClick={() => onEdit && onEdit(config)}
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
    </div>
  );
}
