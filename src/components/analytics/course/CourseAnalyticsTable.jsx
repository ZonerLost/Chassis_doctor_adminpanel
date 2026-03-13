/*
 * Course Analytics Table component for analytics surfaces within the admin interface.
 * Keeps rendering behavior isolated so higher-level modules can focus on data flow.
 */

import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import AnalyticsStatCard from "../shared/AnalyticsStatCard";
import AnalyticsToolbar from "../shared/AnalyticsToolbar";
import TablePagination from "../shared/TablePagination";

function CourseThumb({ row, colors, onOpen }) {
  if (row.thumbnailUrl) {
    return (
      <button
        type="button"
        onClick={() => onOpen?.(row)}
        className="h-12 w-12 overflow-hidden rounded-xl"
        style={{ border: `1px solid ${colors.ring}` }}
      >
        <img
          src={row.thumbnailUrl}
          alt={row.title}
          className="h-full w-full object-cover"
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpen?.(row)}
      className="flex h-12 w-12 items-center justify-center rounded-xl text-sm font-semibold"
      style={{
        backgroundColor: `${colors.accent}18`,
        border: `1px solid ${colors.ring}`,
        color: colors.accent,
      }}
    >
      {row.thumbnailFallback}
    </button>
  );
}

export default function CourseAnalyticsTable({
  rows = [],
  loading = false,
  onOpenCourse,
}) {
  const { colors } = useTheme();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    return Array.from(new Set(rows.map((row) => row.category).filter(Boolean))).sort();
  }, [rows]);

  const levels = useMemo(() => {
    return Array.from(new Set(rows.map((row) => row.level).filter(Boolean))).sort();
  }, [rows]);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        !q ||
        row.title.toLowerCase().includes(q) ||
        row.category.toLowerCase().includes(q) ||
        row.level.toLowerCase().includes(q) ||
        String(row.description || "").toLowerCase().includes(q);

      const matchesCategory = category === "all" || row.category === category;
      const matchesLevel = level === "all" || row.level === level;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [rows, query, category, level]);

  const summary = useMemo(() => {
    const totalCourses = filteredRows.length;
    const totalEnrollments = filteredRows.reduce((sum, row) => sum + row.enrollments, 0);
    const totalCompletions = filteredRows.reduce((sum, row) => sum + row.completions, 0);
    const totalReviews = filteredRows.reduce((sum, row) => sum + row.totalReviews, 0);
    const weightedRating = filteredRows.reduce(
      (sum, row) => sum + row.avgRating * row.totalReviews,
      0
    );

    return [
      {
        key: "courses",
        label: "Courses",
        value: totalCourses,
        help: "Visible in current filters",
      },
      {
        key: "enrollments",
        label: "Enrollments",
        value: totalEnrollments,
        help: "Across visible courses",
      },
      {
        key: "completions",
        label: "Completions",
        value: totalCompletions,
        help: "Completed enrollments",
      },
      {
        key: "rate",
        label: "Completion Rate",
        value: `${totalEnrollments ? Math.round((totalCompletions / totalEnrollments) * 100) : 0}%`,
        help: "Weighted completion rate",
      },
      {
        key: "reviews",
        label: "Average Rating",
        value: totalReviews ? (weightedRating / totalReviews).toFixed(1) : "0.0",
        help: `${totalReviews} reviews`,
      },
    ];
  }, [filteredRows]);

  useEffect(() => {
    setPage(1);
  }, [query, category, level, pageSize]);

  const totalItems = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, safePage, pageSize]);

  return (
    <div>
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {summary.map((item) => (
          <AnalyticsStatCard
            key={item.key}
            label={item.label}
            value={item.value}
            help={item.help}
          />
        ))}
      </div>

      <AnalyticsToolbar
        search={query}
        onSearch={setQuery}
        searchPlaceholder="Search courses..."
        pageSize={pageSize}
        onPageSize={setPageSize}
        filters={[
          {
            key: "category",
            value: category,
            onChange: setCategory,
            options: [
              { label: "All Categories", value: "all" },
              ...categories.map((value) => ({
                label: value,
                value,
              })),
            ],
          },
          {
            key: "level",
            value: level,
            onChange: setLevel,
            options: [
              { label: "All Levels", value: "all" },
              ...levels.map((value) => ({
                label: value,
                value,
              })),
            ],
          },
        ]}
      />

      <div
        className="hidden overflow-x-auto rounded-2xl lg:block"
        style={{
          border: `1px solid ${colors.ring}`,
          backgroundColor: colors.bg2,
        }}
      >
        <table className="min-w-[980px] w-full text-sm">
          <thead>
            <tr
              className="text-xs uppercase"
              style={{
                color: colors.accent,
                borderBottom: `1px solid ${colors.ring}`,
              }}
            >
              <th className="px-4 py-3 text-left">Course</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Level</th>
              <th className="px-4 py-3 text-left">Enrollments</th>
              <th className="px-4 py-3 text-left">Completions</th>
              <th className="px-4 py-3 text-left">Completion Rate</th>
              <th className="px-4 py-3 text-left">Reviews</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center"
                  style={{ color: colors.text2 }}
                >
                  Loading...
                </td>
              </tr>
            ) : paginatedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center"
                  style={{ color: colors.text2 }}
                >
                  No course analytics found.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row) => (
                <tr
                  key={row.courseId}
                  style={{
                    borderBottom: `1px solid ${colors.ring}`,
                  }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <CourseThumb
                        row={row}
                        colors={colors}
                        onOpen={onOpenCourse}
                      />

                      <div>
                        <button
                          type="button"
                          onClick={() => onOpenCourse?.(row)}
                          className="text-left font-semibold hover:underline"
                          style={{ color: colors.text }}
                        >
                          {row.title}
                        </button>
                        <div className="mt-1 text-xs" style={{ color: colors.text2 }}>
                          {row.durationMinutes ? `${row.durationMinutes} min` : "Duration not set"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {row.category}
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {row.level}
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {row.enrollments}
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {row.completions}
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {row.completionRate}%
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {row.avgRating.toFixed(1)} ★ ({row.totalReviews})
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 lg:hidden">
        {loading ? (
          <div
            className="rounded-2xl p-4 text-sm"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
              color: colors.text2,
            }}
          >
            Loading...
          </div>
        ) : paginatedRows.length === 0 ? (
          <div
            className="rounded-2xl p-4 text-sm"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
              color: colors.text2,
            }}
          >
            No course analytics found.
          </div>
        ) : (
          paginatedRows.map((row) => (
            <div
              key={row.courseId}
              className="rounded-2xl p-4"
              style={{
                backgroundColor: colors.bg2,
                border: `1px solid ${colors.ring}`,
              }}
            >
              <div className="flex items-start gap-3">
                <CourseThumb row={row} colors={colors} onOpen={onOpenCourse} />

                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => onOpenCourse?.(row)}
                    className="text-left text-sm font-semibold hover:underline"
                    style={{ color: colors.text }}
                  >
                    {row.title}
                  </button>

                  <div className="mt-1 text-xs" style={{ color: colors.text2 }}>
                    {row.category} • {row.level}
                  </div>

                  <div
                    className="mt-3 grid grid-cols-2 gap-2 text-sm"
                    style={{ color: colors.text2 }}
                  >
                    <div>Enrollments: {row.enrollments}</div>
                    <div>Completions: {row.completions}</div>
                    <div>Rate: {row.completionRate}%</div>
                    <div>
                      Reviews: {row.avgRating.toFixed(1)} ★ ({row.totalReviews})
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <TablePagination
        page={safePage}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />
    </div>
  );
}