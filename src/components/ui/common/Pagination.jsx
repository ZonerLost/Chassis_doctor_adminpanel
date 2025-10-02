import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function Pagination({ current, total, onPageChange }) {
  const { colors } = useTheme();

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(total - 1, current + delta);
      i++
    ) {
      range.push(i);
    }

    if (current - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (current + delta < total - 1) {
      rangeWithDots.push("...", total);
    } else if (total > 1) {
      rangeWithDots.push(total);
    }

    return rangeWithDots;
  };

  if (total <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="px-3 py-2 rounded-lg border text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          borderColor: colors.ring,
          backgroundColor: colors.hover,
          color: colors.text,
        }}
      >
        Previous
      </button>

      {getVisiblePages().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors duration-200 ${
            page === current ? "shadow-lg" : ""
          } ${page === "..." ? "cursor-default" : ""}`}
          style={{
            borderColor: colors.ring,
            backgroundColor:
              page === current ? colors.accent : colors.hover,
            color: page === current ? colors.bg : colors.text,
          }}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(total, current + 1))}
        disabled={current === total}
        className="px-3 py-2 rounded-lg border text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          borderColor: colors.ring,
          backgroundColor: colors.hover,
          color: colors.text,
        }}
      >
        Next
      </button>
    </div>
  );
}
