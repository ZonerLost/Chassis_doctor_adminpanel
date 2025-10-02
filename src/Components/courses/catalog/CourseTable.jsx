import React, { useMemo, useState, useEffect } from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function CourseTable({ rows = [], loading = false, onEdit }) {
  const { colors } = useTheme();
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [query, pageSize]);

  const processed = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    let list = Array.isArray(rows) ? [...rows] : [];
    if (q) {
      list = list.filter(
        (c) =>
          String(c.title || "")
            .toLowerCase()
            .includes(q) ||
          String(c.instructorName || "")
            .toLowerCase()
            .includes(q)
      );
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

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses..."
          className="px-3 py-2 rounded-xl text-sm w-full"
          style={{
            backgroundColor: colors.bg2,
            color: colors.text,
            border: `1px solid ${colors.ring}`,
          }}
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
        >
          {[10, 25, 50].map((s) => (
            <option key={s} value={s}>
              {s} / page
            </option>
          ))}
        </select>
      </div>

      <div
        className="overflow-x-auto rounded-lg"
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
              style={{
                color: "#d4af37",
                borderBottom: `1px solid ${colors.ring}`,
              }}
            >
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Level</th>
              <th className="px-4 py-3 text-left">Instructor</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center"
                  style={{ color: colors.text2 }}
                >
                  Loading…
                </td>
              </tr>
            ) : pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center"
                  style={{ color: colors.text2 }}
                >
                  No courses found.
                </td>
              </tr>
            ) : (
              pageItems.map((c) => (
                <tr
                  key={c.id}
                  style={{
                    borderBottom: `1px solid ${colors.ring}`,
                    backgroundColor: colors.bg2,
                  }}
                >
                  <td className="px-4 py-3" style={{ color: colors.text }}>
                    {c.title}
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {c.level}
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {c.instructorName}
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {c.isPaid ? "Paid" : "Free"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      className="px-3 py-1.5 rounded-xl border text-xs"
                      style={{
                        borderColor: colors.ring,
                        backgroundColor: colors.bg,
                        color: colors.text2,
                      }}
                      onClick={() => onEdit && onEdit(c)}
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div style={{ color: colors.text2, fontSize: "14px" }}>
            Showing {Math.min((pageIndex - 1) * pageSize + 1, total)} to{" "}
            {Math.min(pageIndex * pageSize, total)} of {total} courses
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
