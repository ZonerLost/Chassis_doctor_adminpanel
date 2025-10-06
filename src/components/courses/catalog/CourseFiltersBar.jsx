import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function CourseFiltersBar({
  query,
  onQuery,
  pageSize,
  onPageSize,
  onNew,
}) {
  const { colors } = useTheme();

  return (
    <div className="w-full">
      {/* stack on xs, inline on sm+ */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
        <input
          value={query}
          onChange={(e) => onQuery?.(e.target.value)}
          placeholder="Search courses..."
          className="w-full sm:flex-1 px-3 py-2 rounded-xl text-sm"
          style={{
            backgroundColor: colors.bg2,
            color: colors.text,
            border: `1px solid ${colors.ring}`,
          }}
          aria-label="Search courses"
        />

        <select
          value={pageSize}
          onChange={(e) => onPageSize?.(Number(e.target.value))}
          className="h-10 rounded-xl px-3 w-full sm:w-auto"
          style={{
            backgroundColor: colors.bg2,
            color: colors.text,
            border: `1px solid ${colors.ring}`,
          }}
          aria-label="Rows per page"
        >
          {[10, 20, 50].map((s) => (
            <option key={s} value={s}>
              {s} / page
            </option>
          ))}
        </select>

        <div className="w-full sm:w-auto">
          <button
            onClick={onNew}
            className="w-full sm:w-auto px-3 py-2 rounded-xl"
            style={{
              backgroundColor: colors.accent,
              border: `1px solid ${colors.accent}`,
              color: colors.bg,
            }}
          >
            New Course
          </button>
        </div>
      </div>
    </div>
  );
}
