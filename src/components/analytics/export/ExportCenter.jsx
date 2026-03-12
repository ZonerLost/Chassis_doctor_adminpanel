import React, { useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function ExportCenter({
  history = [],
  loading = false,
  onExport,
}) {
  const { colors } = useTheme();
  const [format, setFormat] = useState("csv");
  const [scope, setScope] = useState("all");

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl p-4"
        style={{
          backgroundColor: colors.bg2,
          border: `1px solid ${colors.ring}`,
        }}
      >
        <h3 className="text-lg font-semibold" style={{ color: colors.accent }}>
          Export Options
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label
              className="mb-1 block text-sm"
              style={{ color: colors.text2 }}
            >
              Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{
                backgroundColor: colors.bg2,
                border: `1px solid ${colors.ring}`,
                color: colors.text,
              }}
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>

          <div>
            <label
              className="mb-1 block text-sm"
              style={{ color: colors.text2 }}
            >
              Report Scope
            </label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{
                backgroundColor: colors.bg2,
                border: `1px solid ${colors.ring}`,
                color: colors.text,
              }}
            >
              <option value="all">All Sections</option>
              <option value="engagement">Engagement</option>
              <option value="courses">Courses</option>
              <option value="chassis">Chassis</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => onExport?.({ format, scope })}
              disabled={loading}
              className="w-full rounded-xl px-4 py-2.5 text-sm font-medium disabled:cursor-not-allowed"
              style={{
                backgroundColor: colors.accent,
                color: "#000",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Exporting..." : "Export Report"}
            </button>
          </div>
        </div>
      </div>

      <div
        className="rounded-2xl p-4"
        style={{
          backgroundColor: colors.bg2,
          border: `1px solid ${colors.ring}`,
        }}
      >
        <h4 className="text-base font-semibold" style={{ color: colors.accent }}>
          Export History
        </h4>

        {history.length === 0 ? (
          <div className="mt-3 text-sm" style={{ color: colors.text2 }}>
            No exports yet.
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="rounded-xl px-3 py-3"
                style={{
                  backgroundColor: colors.bg2,
                  border: `1px solid ${colors.ring}`,
                }}
              >
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm font-medium" style={{ color: colors.text }}>
                      {item.fileName}
                    </div>
                    <div className="text-xs" style={{ color: colors.text2 }}>
                      {item.format} • {item.scope}
                    </div>
                  </div>

                  <div className="text-xs" style={{ color: colors.text2 }}>
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}