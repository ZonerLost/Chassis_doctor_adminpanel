import React, { useMemo, useState, useEffect } from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function SymptomTable({ rows = [], loading = false, onEdit }) {
  const { colors } = useTheme();

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState({ key: "name", dir: "asc" });
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [query, pageSize, sortBy]);

  const processed = useMemo(() => {
    const q = String(query || "")
      .trim()
      .toLowerCase();
    let list = Array.isArray(rows) ? [...rows] : [];

    if (q) {
      list = list.filter((s) => {
        const name = String(s.name || "").toLowerCase();
        const category = String(s.category || "").toLowerCase();
        const description = String(s.description || "").toLowerCase();
        return (
          name.includes(q) || category.includes(q) || description.includes(q)
        );
      });
    }

    const dir = sortBy.dir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      if (sortBy.key === "frequency") {
        return (Number(a.frequency || 0) - Number(b.frequency || 0)) * dir;
      }
      if (sortBy.key === "severity") {
        const severityOrder = { Low: 1, Medium: 2, High: 3 };
        return (severityOrder[a.severity] - severityOrder[b.severity]) * dir;
      }
      return (
        String(a[sortBy.key] || "").localeCompare(String(b[sortBy.key] || "")) *
        dir
      );
    });

    return list;
  }, [rows, query, sortBy]);

  const total = processed.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageIndex = Math.min(Math.max(1, page), totalPages);

  const pageItems = useMemo(() => {
    const start = (pageIndex - 1) * pageSize;
    return processed.slice(start, start + pageSize);
  }, [processed, pageIndex, pageSize]);

  const toggleSort = (key) => {
    setSortBy((s) => {
      if (s.key === key) return { key, dir: s.dir === "asc" ? "desc" : "asc" };
      return { key, dir: "asc" };
    });
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
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

  const fmtPct = (v) => `${Number(v || 0)}%`;

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div style={{ flex: 1, display: "flex", gap: 8 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symptoms..."
            className="px-3 py-2 rounded-xl text-sm w-full"
            style={{
              backgroundColor: colors.bg2,
              color: colors.text,
              border: `1px solid ${colors.ring}`,
            }}
            aria-label="Search symptoms"
          />

          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-3 py-2 rounded-xl text-sm"
            style={{
              backgroundColor: colors.bg2,
              color: colors.text,
              border: `1px solid ${colors.ring}`,
            }}
            aria-label="Page size"
          >
            {[10, 25, 50].map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop/tablet original table (hidden on small screens) */}
      <div
        className="hidden md:block overflow-x-auto rounded-lg"
        style={{
          border: `1px solid ${colors.ring}`,
          backgroundColor: colors.bg2,
        }}
      >
        <table
          className="min-w-full w-full text-sm"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr
              className="uppercase text-xs"
              style={{
                color: "#d4af37",
                borderBottom: `1px solid ${colors.ring}`,
              }}
            >
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => toggleSort("name")}
              >
                Name{" "}
                {sortBy.key === "name"
                  ? sortBy.dir === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>

              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => toggleSort("category")}
              >
                Category{" "}
                {sortBy.key === "category"
                  ? sortBy.dir === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>

              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => toggleSort("severity")}
              >
                Severity{" "}
                {sortBy.key === "severity"
                  ? sortBy.dir === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>

              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => toggleSort("frequency")}
              >
                Frequency{" "}
                {sortBy.key === "frequency"
                  ? sortBy.dir === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>

              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center"
                  style={{ color: colors.text2 }}
                >
                  Loading…
                </td>
              </tr>
            ) : pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center"
                  style={{ color: colors.text2 }}
                >
                  No symptoms found.
                </td>
              </tr>
            ) : (
              pageItems.map((symptom) => (
                <tr
                  key={symptom.id}
                  className="hover:bg-opacity-50 transition-colors duration-150"
                  style={{
                    backgroundColor: colors.bg2,
                    borderBottom: `1px solid ${colors.ring}`,
                  }}
                >
                  <td
                    className="px-4 py-3 font-medium"
                    style={{ color: colors.text }}
                  >
                    {symptom.name}
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {symptom.category || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded-lg text-xs font-medium"
                      style={{
                        backgroundColor:
                          getSeverityColor(symptom.severity) + "20",
                        color: getSeverityColor(symptom.severity),
                      }}
                    >
                      {symptom.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {fmtPct(symptom.frequency)}
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {symptom.description || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      className="px-3 py-1.5 rounded-xl border text-xs"
                      style={{
                        borderColor: colors.ring,
                        backgroundColor: colors.bg,
                        color: colors.text2,
                      }}
                      onClick={() => onEdit && onEdit(symptom)}
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
            No symptoms found.
          </div>
        ) : (
          pageItems.map((symptom) => (
            <div
              key={symptom.id}
              className="p-3 rounded-lg"
              style={{
                backgroundColor: colors.card || colors.bg2,
                border: `1px solid ${colors.ring}`,
                color: colors.text,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: colors.text }}>
                    {symptom.name}
                  </div>
                  <div
                    style={{ color: colors.text2, fontSize: 13, marginTop: 6 }}
                  >
                    {symptom.category || "-"}
                  </div>
                </div>

                <div
                  style={{
                    textAlign: "right",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    minWidth: 80,
                    alignItems: "flex-end",
                  }}
                >
                  <div style={{ color: colors.text2, fontSize: 12 }}>
                    {fmtPct(symptom.frequency)}
                  </div>

                  <span
                    className="px-2 py-1 rounded-lg text-xs font-medium"
                    style={{
                      backgroundColor:
                        getSeverityColor(symptom.severity) + "20",
                      color: getSeverityColor(symptom.severity),
                    }}
                  >
                    {symptom.severity}
                  </span>

                  <button
                    onClick={() => onEdit?.(symptom)}
                    className="px-3 py-1.5 rounded-xl border text-xs"
                    style={{
                      borderColor: colors.ring,
                      backgroundColor: colors.bg,
                      color: colors.text2,
                      marginTop: 6,
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>

              {symptom.description ? (
                <div className="mt-3 text-sm" style={{ color: colors.text2 }}>
                  {symptom.description}
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div style={{ color: colors.text2, fontSize: "14px" }}>
            Showing {Math.min((pageIndex - 1) * pageSize + 1, total)} to{" "}
            {Math.min(pageIndex * pageSize, total)} of {total} symptoms
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pageIndex <= 1}
              className="px-3 py-1 rounded-lg text-sm"
              style={{
                backgroundColor: colors.bg2,
                border: `1px solid ${colors.ring}`,
                color: pageIndex <= 1 ? colors.text2 : colors.text,
                opacity: pageIndex <= 1 ? 0.5 : 1,
              }}
            >
              Previous
            </button>

            <span style={{ color: colors.text2, fontSize: "14px" }}>
              Page {pageIndex} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={pageIndex >= totalPages}
              className="px-3 py-1 rounded-lg text-sm"
              style={{
                backgroundColor: colors.bg2,
                border: `1px solid ${colors.ring}`,
                color: pageIndex >= totalPages ? colors.text2 : colors.text,
                opacity: pageIndex >= totalPages ? 0.5 : 1,
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
