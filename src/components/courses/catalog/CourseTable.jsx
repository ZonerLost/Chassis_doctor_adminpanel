import React, { useMemo, useState, useEffect } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { MdEdit } from "react-icons/md";
// Import theme constants and helper from new file


export default function CourseTable({
  courses = [],
  onEdit,
}) {
  const { colors } = useTheme();
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [query, pageSize]);

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return courses || [];
    return (courses || []).filter((c) => {
      const title = String(c.title || c.name || "").toLowerCase();
      const instructor = String(c.instructor || "").toLowerCase();
      const category = String(
        c.category || (c.categories && c.categories[0]) || ""
      ).toLowerCase();
      const desc = String(c.description || c.summary || "").toLowerCase();
      return (
        title.includes(q) ||
        instructor.includes(q) ||
        category.includes(q) ||
        desc.includes(q)
      );
    });
  }, [courses, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageIndex = Math.min(Math.max(1, page), totalPages);
  const pageItems = useMemo(() => {
    const start = (pageIndex - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, pageIndex, pageSize]);

  function severityColor(level) {
    if (!level) return "#6B7280";
    switch (String(level).toLowerCase()) {
      case "low":
        return "#22C55E";
      case "medium":
        return "#F59E0B";
      case "high":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  }

  // helper to softly truncate for mobile cards (no line-clamp plugin required)
  function truncate(text, n = 140) {
    if (!text) return "";
    const t = String(text);
    return t.length > n ? t.slice(0, n - 1).trimEnd() + "…" : t;
  }

  return (
    <div
      className="rounded-xl border overflow-hidden mx-auto w-full"
      style={{
        maxWidth: 1400,
        backgroundColor: colors.card,
        borderColor: colors.ring,
      }}
    >
      {/* top controls */}
      <div className="p-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses..."
            className="w-full md:flex-1 px-3 py-2 rounded-md text-sm"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
              color: colors.text,
            }}
          />
          <div className="flex items-center gap-2 md:ml-auto">
            <label className="text-sm" style={{ color: colors.text2 }}>
              Rows:
            </label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-2 py-1 rounded-md text-sm"
              style={{
                backgroundColor: colors.bg2,
                border: `1px solid ${colors.ring}`,
                color: colors.text,
                minWidth: 64,
              }}
            >
              {[5, 10, 20, 50].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TABLE HEADER (md and up) */}
      <div
        className="hidden md:grid grid-cols-12 gap-3 px-3 py-2 border-t border-b text-sm font-medium sticky top-0 z-10"
        style={{
          backgroundColor: colors.accent + "10",
          borderColor: colors.ring,
          color: colors.accent,
        }}
      >
        <div className="col-span-4">Name</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-1">Severity</div>
        <div className="col-span-1">Frequency</div>
        <div className="col-span-3">Description</div>
        <div className="col-span-1 text-center">Actions</div>
      </div>

      {/* ROWS CONTAINER */}
      <div className="divide-y" style={{ borderColor: colors.ring }}>
        {/* DESKTOP/TABLET ROWS */}
        {pageItems.map((c, idx) => {
          const category = c.category || (c.categories && c.categories[0]) || "";
          const description = c.description || c.summary || "";
          const frequency = c.frequency ?? c.freq ?? null;
          const key = (c).id ?? (c )._id ?? idx;

          return (
            <div key={key}>
              {/* md+ grid row */}
              <div
                className="hidden md:grid grid-cols-12 gap-3 px-3 py-3 items-center"
                style={{ color: colors.text }}
              >
                <div className="col-span-4">
                  <div className="font-medium text-base">
                    {c.title || c.name || "Untitled"}
                  </div>
                  <div
                    className="text-sm mt-1"
                    style={{ color: colors.text2 }}
                  >
                    {c.duration ? `${c.duration} • ` : ""}
                    {c.price ? `$${c.price}` : ""}
                  </div>
                </div>

                <div className="col-span-2" style={{ color: colors.text2 }}>
                  {category || "—"}
                </div>

                <div className="col-span-1">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: severityColor(c.severity) + "20",
                      color: severityColor(c.severity),
                    }}
                  >
                    {c.severity || "—"}
                  </span>
                </div>

                <div className="col-span-1" style={{ color: colors.text2 }}>
                  {frequency ? `${frequency}%` : "—"}
                </div>

                <div
                  className="col-span-3 text-sm"
                  style={{
                    color: colors.text2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {description || "—"}
                </div>

                <div className="col-span-1 flex items-center justify-center">
                  <button
                    onClick={() => onEdit && onEdit(c)}
                    className="px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1"
                    style={{
                      backgroundColor: colors.bg2,
                      color: colors.text,
                      border: `1px solid ${colors.ring}`,
                      minWidth: 72,
                      textAlign: "center",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
                    }}
                    aria-label={`Edit ${c.title || c.name || "course"}`}
                  >
                    <MdEdit aria-hidden />
                    Edit
                  </button>
                </div>
              </div>

              {/* MOBILE CARD */}
              <div
                className="md:hidden px-3 py-3"
                style={{ color: colors.text }}
              >
                <div
                  className="rounded-lg border p-3 flex flex-col gap-2"
                  style={{ borderColor: colors.ring, backgroundColor: colors.bg2 }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-semibold text-base truncate">
                        {c.title || c.name || "Untitled"}
                      </div>
                      <div
                        className="text-xs mt-0.5"
                        style={{ color: colors.text2 }}
                      >
                        {c.duration ? `${c.duration} • ` : ""}
                        {c.price ? `$${c.price}` : ""}
                      </div>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0"
                      style={{
                        backgroundColor: severityColor(c.severity) + "20",
                        color: severityColor(c.severity),
                      }}
                    >
                      {c.severity || "—"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className="px-2 py-0.5 rounded-md"
                      style={{
                        backgroundColor: colors.card,
                        border: `1px solid ${colors.ring}`,
                        color: colors.text2,
                      }}
                    >
                      {category || "Uncategorized"}
                    </span>
                    <span style={{ color: colors.text2 }}>
                      {frequency ? `${frequency}% freq.` : "—"}
                    </span>
                  </div>

                  <div
                    className="text-sm"
                    style={{ color: colors.text2 }}
                  >
                    {truncate(description || "—", 180)}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => onEdit && onEdit(c)}
                      className="px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1"
                      style={{
                        backgroundColor: colors.card,
                        color: colors.text,
                        border: `1px solid ${colors.ring}`,
                        minWidth: 72,
                      }}
                      aria-label={`Edit ${c.title || c.name || "course"}`}
                    >
                      <MdEdit aria-hidden />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* empty state spacer to keep layout consistent */}
        {pageItems.length === 0 && (
          <div className="px-3 py-6 text-center" style={{ color: colors.text2 }}>
            {/* blank to preserve spacing */}
          </div>
        )}
      </div>

      {/* pagination */}
      {totalPages > 1 && (
        <div
          className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-3 py-2 border-t"
          style={{ borderColor: colors.ring }}
        >
          <div className="text-sm" style={{ color: colors.text2 }}>
            Showing {(pageIndex - 1) * pageSize + 1} –{" "}
            {Math.min(pageIndex * pageSize, total)} of {total}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, pageIndex - 1))}
              disabled={pageIndex <= 1}
              className="px-3 py-1 rounded-md text-sm disabled:opacity-60"
              style={{
                backgroundColor: colors.bg2,
                color: colors.text2,
                border: `1px solid ${colors.ring}`,
              }}
            >
              Prev
            </button>
            <span className="text-sm" style={{ color: colors.text }}>
              {pageIndex} / {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, pageIndex + 1))}
              disabled={pageIndex >= totalPages}
              className="px-3 py-1 rounded-md text-sm disabled:opacity-60"
              style={{
                backgroundColor: colors.bg2,
                color: colors.text2,
                border: `1px solid ${colors.ring}`,
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
