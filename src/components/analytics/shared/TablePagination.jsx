/*
 * Table Pagination component for analytics surfaces within the admin interface.
 * Keeps rendering behavior isolated so higher-level modules can focus on data flow.
 */

import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function TablePagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
}) {
  const { colors } = useTheme();

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  if (totalItems <= 0) return null;

  return (
    <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="text-sm" style={{ color: colors.text2 }}>
        Showing {start} to {end} of {totalItems} results
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="rounded-lg px-3 py-1.5 text-sm disabled:cursor-not-allowed"
          style={{
            backgroundColor: colors.bg2,
            border: `1px solid ${colors.ring}`,
            color: page <= 1 ? colors.text2 : colors.text,
            opacity: page <= 1 ? 0.6 : 1,
          }}
        >
          Previous
        </button>

        <span className="text-sm" style={{ color: colors.text2 }}>
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="rounded-lg px-3 py-1.5 text-sm disabled:cursor-not-allowed"
          style={{
            backgroundColor: colors.bg2,
            border: `1px solid ${colors.ring}`,
            color: page >= totalPages ? colors.text2 : colors.text,
            opacity: page >= totalPages ? 0.6 : 1,
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}