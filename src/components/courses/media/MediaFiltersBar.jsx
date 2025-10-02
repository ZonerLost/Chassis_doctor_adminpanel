import React from "react";
import SearchInput from "../../ui/common/SearchInput";
import { useTheme } from "../../../contexts/ThemeContext";

export default function MediaFiltersBar({ query, onQuery, type, onType }) {
  const { colors } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <SearchInput
        placeholder="Search media…"
        value={query}
        onChange={onQuery}
      />
      <select
        className="rounded-xl border px-3 py-2 text-sm"
        style={{
          borderColor: colors.ring,
          backgroundColor: colors.hover,
          color: colors.text,
        }}
        value={type}
        onChange={(e) => onType(e.target.value)}
      >
        <option value="all">All types</option>
        <option value="pdf">PDFs</option>
        <option value="video">Videos</option>
        <option value="image">Images</option>
      </select>
    </div>
  );
}
