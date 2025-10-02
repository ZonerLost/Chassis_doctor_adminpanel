import React, { useMemo, useState } from "react";
import { useArticles } from "../../../hooks/useArticles";
import { useCategories } from "../../../hooks/useCategories";
import { useTheme } from "../../../contexts/ThemeContext";

// Small helper to strip HTML tags from summaries so we don't render raw HTML
const stripHtml = (html) => {
  if (!html) return "";
  return String(html)
    .replace(/<[^>]*>/g, "")
    .trim();
};

export default function ArticlesTable({
  onEdit,
  data: propData,
  loading: propLoading,
}) {
  const { colors } = useTheme();
  // Allow the parent to control data/loading (so saving from a parent hook updates the table).
  // If not provided, fall back to the internal hook for standalone usage.
  const { rows: hookRows = [], loading: hookLoading = false } = useArticles();
  const { rows: categories = [] } = useCategories();

  const articles = Array.isArray(propData) ? propData : hookRows;
  const loading = typeof propLoading === "boolean" ? propLoading : hookLoading;

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Filtered list derived from hooks
  const filtered = useMemo(() => {
    let rows = Array.isArray(articles) ? articles : [];

    const q = String(searchTerm || "")
      .trim()
      .toLowerCase();
    if (q) {
      rows = rows.filter((r) => {
        const title = String(r.title || "").toLowerCase();
        const summary = stripHtml(r.summary || "").toLowerCase();
        const author = String(r.author || "").toLowerCase();
        return title.includes(q) || summary.includes(q) || author.includes(q);
      });
    }

    if (categoryFilter !== "all") {
      rows = rows.filter(
        (r) =>
          String(r.category || r.categoryId || "") === String(categoryFilter)
      );
    }

    return rows;
  }, [articles, searchTerm, categoryFilter]);

  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <div className="space-y-4">
      {/* Filters row: search + categories on one row */}
      <div className="flex items-center gap-3 mb-2">
        <input
          type="search"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 h-10 rounded-lg px-4"
          style={{
            backgroundColor: colors.bg2,
            color: colors.text,
            border: `1px solid ${colors.ring}`,
          }}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 rounded-lg px-3"
          style={{
            backgroundColor: colors.bg2,
            color: colors.text,
            border: `1px solid ${colors.ring}`,
          }}
        >
          <option value="all">All Categories</option>
          {safeCategories.map((c) => (
            <option key={c.id ?? c} value={c.id ?? c}>
              {c.name ?? c}
            </option>
          ))}
        </select>
      </div>

      {/* Articles table */}
      <div className="overflow-x-auto">
        <table className="min-w-full w-full text-sm">
          <thead>
            <tr style={{ color: "#d4af37" }}>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Author</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Updated</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center"
                  style={{ color: colors.text2 }}
                >
                  Loading articles...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center"
                  style={{ color: colors.text2 }}
                >
                  No articles found
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr
                  key={a.id}
                  style={{ backgroundColor: colors.bg2 }}
                  className="hover:opacity-95"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium" style={{ color: colors.text }}>
                      {a.title}
                    </div>
                    {a.summary ? (
                      <div
                        className="text-xs mt-1"
                        style={{ color: colors.text2 }}
                      >
                        {stripHtml(a.summary).slice(0, 120)}
                        {stripHtml(a.summary).length > 120 ? "..." : ""}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {a.category || a.categoryId || "Uncategorized"}
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {a.author || "Unknown"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded text-xs"
                      style={{
                        backgroundColor:
                          a.status === "published" ? "#4CAF5020" : "#99999920",
                        color:
                          a.status === "published" ? "#4CAF50" : colors.text2,
                      }}
                    >
                      {a.status || "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: colors.text2 }}>
                    {a.updatedAt
                      ? new Date(a.updatedAt).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onEdit?.(a)}
                      className="px-3 py-1.5 rounded-xl border text-xs"
                      style={{
                        borderColor: colors.ring,
                        backgroundColor: colors.bg2,
                        color: colors.text,
                      }}
                      title="Edit article"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
