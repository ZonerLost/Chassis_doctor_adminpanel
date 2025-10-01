import React from "react";
import SearchInput from "../../ui/common/SearchInput";
import { useTheme } from "../../../contexts/ThemeContext";

export default function CourseFiltersBar({
  query,
  onQuery,
  level,
  onLevel,
  access,
  onAccess,
}) {
  const { colors } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <SearchInput
        placeholder="Search courses…"
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
        value={level}
        onChange={(e) => onLevel(e.target.value)}
      >
        <option value="all">All levels</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
      <select
        className="rounded-xl border px-3 py-2 text-sm"
        style={{
          borderColor: colors.ring,
          backgroundColor: colors.hover,
          color: colors.text,
        }}
        value={access}
        onChange={(e) => onAccess(e.target.value)}
      >
        <option value="all">All access</option>
        <option value="free">Free</option>
        <option value="paid">Paid</option>
      </select>
    </div>
  );
}
