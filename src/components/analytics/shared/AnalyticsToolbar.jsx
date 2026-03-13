/*
 * Analytics Toolbar component for analytics surfaces within the admin interface.
 * Keeps rendering behavior isolated so higher-level modules can focus on data flow.
 */

import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function AnalyticsToolbar({
  search,
  onSearch,
  searchPlaceholder = "Search...",
  filters = [],
  pageSize,
  onPageSize,
  pageSizes = [10, 20, 50],
}) {
  const { colors } = useTheme();

  return (
    <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-1 flex-col gap-3 md:flex-row">
        <input
          value={search}
          onChange={(e) => onSearch?.(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
          style={{
            backgroundColor: colors.bg2,
            border: `1px solid ${colors.ring}`,
            color: colors.text,
          }}
        />

        {filters.map((filter) => (
          <select
            key={filter.key}
            value={filter.value}
            onChange={(e) => filter.onChange?.(e.target.value)}
            className="rounded-xl px-3 py-2.5 text-sm outline-none"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
              color: colors.text,
              minWidth: 170,
            }}
          >
            {filter.options.map((option) => (
              <option key={`${filter.key}-${option.value}`} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
      </div>

      {typeof onPageSize === "function" ? (
        <select
          value={pageSize}
          onChange={(e) => onPageSize(Number(e.target.value))}
          className="rounded-xl px-3 py-2.5 text-sm outline-none"
          style={{
            backgroundColor: colors.bg2,
            border: `1px solid ${colors.ring}`,
            color: colors.text,
            minWidth: 120,
          }}
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
      ) : null}
    </div>
  );
}