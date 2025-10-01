import React from "react";
// fixed: correct relative path to shared SearchInput
import SearchInput from "../../ui/common/SearchInput";
import { useTheme } from "../../../contexts/ThemeContext";

export default function ArticleFiltersBar({
  query,
  onQuery,
  categoryId,
  onCategory,
  status,
  onStatus,
  tag,
  onTag,
  categories,
}) {
  const { colors } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      <SearchInput
        placeholder="Search articles…"
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
        value={categoryId}
        onChange={(e) => onCategory(e.target.value)}
      >
        <option value="all">All categories</option>
        {categories?.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <select
        className="rounded-xl border px-3 py-2 text-sm"
        style={{
          borderColor: colors.ring,
          backgroundColor: colors.hover,
          color: colors.text,
        }}
        value={status}
        onChange={(e) => onStatus(e.target.value)}
      >
        <option value="all">All statuses</option>
        <option value="draft">Draft</option>
        <option value="scheduled">Scheduled</option>
        <option value="published">Published</option>
      </select>
      <input
        className="rounded-xl border px-3 py-2 text-sm"
        style={{
          borderColor: colors.ring,
          backgroundColor: colors.hover,
          color: colors.text,
        }}
        placeholder="Tag contains…"
        value={tag}
        onChange={(e) => onTag(e.target.value)}
      />
    </div>
  );
}
