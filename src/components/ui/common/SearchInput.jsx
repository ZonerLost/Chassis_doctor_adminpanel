/*
 * Search Input component for ui surfaces within the admin interface.
 * Keeps rendering behavior isolated so higher-level modules can focus on data flow.
 */

import React, { useEffect, useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function SearchInput({
  placeholder = "Search...",
  value,
  onChange,
  delay = 300,
}) {
  const [q, setQ] = useState(value || "");
  const { colors } = useTheme();

  useEffect(() => setQ(value || ""), [value]);

  useEffect(() => {
    const t = setTimeout(() => onChange?.(q), delay);
    return () => clearTimeout(t);
  }, [q, onChange, delay]);

  return (
    <input
      className="w-full rounded-xl border px-3 py-2 text-sm outline-none transition-colors duration-300"
      style={{
        borderColor: colors.ring,
        backgroundColor: colors.hover,
        color: colors.text,
      }}
      placeholder={placeholder}
      value={q}
      onChange={(e) => setQ(e.target.value)}
    />
  );
}
