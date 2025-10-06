import React, { useMemo, useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function MappingRulesTable({
  rows = [],
  loading = false,
  onEdit,
}) {
  const { colors } = useTheme();

  const [query, setQuery] = useState("");
  const [pageSize] = useState(10);
  const [page] = useState(1);

  const processed = useMemo(() => {
    const q = String(query || "")
      .trim()
      .toLowerCase();
    let list = Array.isArray(rows) ? [...rows] : [];

    if (q) {
      list = list.filter((r) => {
        const name = String(r.name || "").toLowerCase();
        const condition = String(r.condition || "").toLowerCase();
        const action = String(r.action || "").toLowerCase();
        return name.includes(q) || condition.includes(q) || action.includes(q);
      });
    }

    return list;
  }, [rows, query]);

  const total = processed.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageIndex = Math.min(Math.max(1, page), totalPages);

  const pageItems = useMemo(() => {
    const start = (pageIndex - 1) * pageSize;
    return processed.slice(start, start + pageSize);
  }, [processed, pageIndex, pageSize]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#EF4444";
      case "Medium":
        return "#F59E0B";
      case "Low":
        return "#22C55E";
      default:
        return colors.text2;
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search mapping rules..."
          className="px-3 py-2 rounded-xl text-sm flex-1"
          style={{
            backgroundColor: colors.bg2,
            color: colors.text,
            border: `1px solid ${colors.ring}`,
          }}
        />
      </div>

      {/* Mobile: stacked cards (visible on small screens) */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div
            className="p-3 rounded-lg"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
              color: colors.text2,
            }}
          >
            Loading…
          </div>
        ) : pageItems.length === 0 ? (
          <div
            className="p-3 rounded-lg"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
              color: colors.text2,
            }}
          >
            No mapping rules found.
          </div>
        ) : (
          pageItems.map((rule) => (
            <div
              key={rule.id}
              className="p-3 rounded-lg"
              style={{
                backgroundColor: colors.card || colors.bg2,
                border: `1px solid ${colors.ring}`,
                color: colors.text,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div style={{ minWidth: 0 }}>
                  <div className="font-medium" style={{ color: colors.text }}>
                    {rule.name}
                  </div>

                  <div className="mt-2">
                    <code
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: "#00000010",
                        color: colors.text2,
                      }}
                    >
                      {rule.condition}
                    </code>
                  </div>

                  <div className="mt-2" style={{ color: colors.text2 }}>
                    {rule.action}
                  </div>
                </div>

                <div
                  style={{
                    textAlign: "right",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <span
                    className="px-2 py-1 rounded-lg text-xs font-medium"
                    style={{
                      backgroundColor: getPriorityColor(rule.priority) + "20",
                      color: getPriorityColor(rule.priority),
                    }}
                  >
                    {rule.priority}
                  </span>

                  <div style={{ color: colors.text2, fontSize: 13 }}>
                    {rule.successRate}%
                  </div>

                  <span
                    className="px-2 py-1 rounded-lg text-xs"
                    style={{
                      backgroundColor: rule.isActive
                        ? "#22C55E20"
                        : "#EF444420",
                      color: rule.isActive ? "#22C55E" : "#EF4444",
                    }}
                  >
                    {rule.isActive ? "Active" : "Inactive"}
                  </span>

                  <button
                    className="px-3 py-1.5 rounded-xl border text-xs"
                    style={{
                      borderColor: colors.ring,
                      backgroundColor: colors.bg2,
                      color: colors.text2,
                      marginTop: 6,
                    }}
                    onClick={() => onEdit && onEdit(rule)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Table (hidden on small screens, visible md+) */}
      <div
        className="hidden md:block overflow-x-auto rounded-lg"
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
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Condition</th>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-left">Priority</th>
              <th className="px-4 py-3 text-left">Success Rate</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center"
                  style={{ color: colors.text2 }}
                >
                  Loading…
                </td>
              </tr>
            ) : pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center"
                  style={{ color: colors.text2 }}
                >
                  No mapping rules found.
                </td>
              </tr>
            ) : (
              pageItems.map((rule) => (
                <tr
                  key={rule.id}
                  style={{
                    backgroundColor: colors.bg2,
                    borderBottom: `1px solid ${colors.ring}`,
                  }}
                >
                  <td
                    className="px-4 py-3 font-medium"
                    style={{ color: colors.text }}
                  >
                    {rule.name}
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    <code className="text-xs bg-black/20 px-2 py-1 rounded">
                      {rule.condition}
                    </code>
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {rule.action}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded-lg text-xs font-medium"
                      style={{
                        backgroundColor: getPriorityColor(rule.priority) + "20",
                        color: getPriorityColor(rule.priority),
                      }}
                    >
                      {rule.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {rule.successRate}%
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded-lg text-xs"
                      style={{
                        backgroundColor: rule.isActive
                          ? "#22C55E20"
                          : "#EF444420",
                        color: rule.isActive ? "#22C55E" : "#EF4444",
                      }}
                    >
                      {rule.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      className="px-3 py-1.5 rounded-xl border text-xs"
                      style={{
                        borderColor: colors.ring,
                        backgroundColor: colors.bg2,
                        color: colors.text2,
                      }}
                      onClick={() => onEdit && onEdit(rule)}
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
