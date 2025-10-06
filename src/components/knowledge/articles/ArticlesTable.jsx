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

  const formatDate = (d) => {
    try {
      return d ? new Date(d).toLocaleDateString() : "—";
    } catch {
      return "—";
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters row: stack on small screens, inline on wider */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
        <input
          type="search"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:flex-1 h-10 rounded-lg px-4"
          style={{
            backgroundColor: colors.bg2,
            color: colors.text,
            border: `1px solid ${colors.ring}`,
          }}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 rounded-lg px-3 w-full sm:w-auto"
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

      {/* Desktop / tablet: table (hidden on small screens, scrolls when needed) */}
      <div
        className="hidden md:block overflow-x-auto rounded-lg"
        style={{
          border: `1px solid ${colors.ring}`,
          backgroundColor: colors.bg2,
        }}
      >
        <table
          className="min-w-[720px] w-full text-sm"
          style={{
            borderCollapse: "separate",
            borderSpacing: 0,
            backgroundColor: colors.bg2,
          }}
        >
          <thead>
            <tr
              style={{
                color: "#d4af37",
                borderBottom: `1px solid ${colors.ring}`,
              }}
            >
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Updated</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center"
                  style={{ color: colors.text2 }}
                >
                  Loading articles...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
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
                  <td
                    className="px-4 py-3"
                    style={{
                      color: colors.text,
                      borderBottom: `1px solid ${colors.ring}`,
                    }}
                  >
                    <div className="font-medium">{a.title}</div>
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
                  <td
                    className="px-4 py-3"
                    style={{
                      color: colors.text2,
                      borderBottom: `1px solid ${colors.ring}`,
                    }}
                  >
                    {a.category || a.categoryId || "Uncategorized"}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{
                      color: colors.text2,
                      borderBottom: `1px solid ${colors.ring}`,
                    }}
                  >
                    {a.status || "Draft"}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{
                      color: colors.text2,
                      borderBottom: `1px solid ${colors.ring}`,
                    }}
                  >
                    {formatDate(a.updatedAt)}
                  </td>
                  <td
                    className="px-4 py-3 text-right"
                    style={{ borderBottom: `1px solid ${colors.ring}` }}
                  >
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

      {/* Mobile: stacked cards (visible only on small screens) */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div
            className="p-3 rounded-lg"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
              color: colors.text2,
            }}
          >
            Loading articles...
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="p-3 rounded-lg"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
              color: colors.text2,
            }}
          >
            No articles
          </div>
        ) : (
          filtered.map((a) => (
            <div
              key={a.id}
              className="p-3 rounded-lg"
              style={{
                backgroundColor: colors.card || colors.bg2,
                border: `1px solid ${colors.ring}`,
                color: colors.text,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: colors.text }}>
                    {a.title}
                  </div>
                  <div
                    style={{ color: colors.text2, fontSize: 13, marginTop: 6 }}
                  >
                    {a.categoryName || a.categoryId || "—"}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ color: colors.text2, fontSize: 12 }}>
                    {a.status || "Draft"}
                  </div>
                  <div style={{ color: colors.text2, fontSize: 12 }}>
                    {formatDate(a.updatedAt)}
                  </div>
                </div>
              </div>

              {a.summary || a.excerpt ? (
                <div className="mt-3 text-sm" style={{ color: colors.text2 }}>
                  {a.summary || a.excerpt}
                </div>
              ) : null}

              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => onEdit?.(a)}
                  className="px-3 py-1.5 rounded-xl border text-xs"
                  style={{
                    borderColor: colors.ring,
                    backgroundColor: colors.bg2,
                    color: colors.text,
                  }}
                  aria-label={`Edit ${a.title}`}
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
