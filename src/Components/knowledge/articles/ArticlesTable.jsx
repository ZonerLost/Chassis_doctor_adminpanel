import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { getCategoryName } from "../../../Data/knowledge.service";

export default function ArticlesTable({ rows = [], loading, onEdit }) {
  const { colors } = useTheme();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[900px] w-full text-sm">
        <thead>
          <tr
            className="uppercase text-xs"
            style={{ color: colors.accent, backgroundColor: colors.bg2 }}
          >
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Tags</th>
            <th className="px-4 py-3 text-left">Updated</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody
          className="divide-y"
          style={{ borderColor: colors.ring, color: colors.text }}
        >
          {loading ? (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-8 text-center"
                style={{ color: colors.text2 }}
              >
                Loading…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-10 text-center"
                style={{ color: colors.text2 }}
              >
                No articles found.
              </td>
            </tr>
          ) : (
            rows.map((a) => (
              <tr
                key={a.id}
                style={{ backgroundColor: colors.bg2 }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = colors.hover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = colors.bg2)
                }
              >
                <td
                  className="px-4 py-3 font-medium"
                  style={{ color: colors.text }}
                >
                  {a.title}
                </td>
                <td
                  className="px-4 py-3"
                  style={{ color: colors.text2 }}
                >
                  {getCategoryName(a.categoryId)}
                </td>
                <td className="px-4 py-3 capitalize">
                  {a.status === "published" && (
                    <span
                      className="px-2 py-1 rounded-lg text-xs"
                      style={{
                        backgroundColor: colors.accent + "20",
                        color: colors.accent,
                      }}
                    >
                      Published
                    </span>
                  )}
                  {a.status === "draft" && (
                    <span
                      className="px-2 py-1 rounded-lg text-xs"
                      style={{
                        backgroundColor: colors.ring,
                        color: colors.text2,
                      }}
                    >
                      Draft
                    </span>
                  )}
                  {a.status === "scheduled" && (
                    <span
                      className="px-2 py-1 rounded-lg text-xs"
                      style={{
                        backgroundColor: colors.accent + "10",
                        color: colors.accent,
                      }}
                    >
                      Scheduled
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(a.tags || []).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-lg text-xs"
                        style={{
                          backgroundColor: colors.hover,
                          color: colors.text2,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3" style={{ color: colors.text2 }}>
                  {a.updatedAt
                    ? new Intl.DateTimeFormat(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(
                        typeof a.updatedAt === "number"
                          ? new Date(a.updatedAt)
                          : a.updatedAt
                      )
                    : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    className="px-3 py-1.5 rounded-xl border text-xs"
                    style={{
                      borderColor: colors.ring,
                      backgroundColor: colors.hover,
                      color: colors.text2,
                    }}
                    onClick={() => onEdit && onEdit(a)}
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
  );
}
