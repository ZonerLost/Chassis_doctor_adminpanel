import React from "react";
import SearchInput from "../../ui/common/SearchInput";

export default function SymptomFiltersBar({ query, onQuery }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <SearchInput
        placeholder="Search symptoms…"
        value={query}
        onChange={onQuery}
      />
    </div>
  );
}
