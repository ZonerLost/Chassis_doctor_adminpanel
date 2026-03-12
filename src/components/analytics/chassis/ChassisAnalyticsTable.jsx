import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import AnalyticsStatCard from "../shared/AnalyticsStatCard";
import AnalyticsToolbar from "../shared/AnalyticsToolbar";
import TablePagination from "../shared/TablePagination";

function TableShell({ title, children, colors }) {
  return (
    <div
      className="rounded-2xl"
      style={{
        backgroundColor: colors.bg2,
        border: `1px solid ${colors.ring}`,
      }}
    >
      <div
        className="px-4 py-3 text-sm font-semibold"
        style={{
          color: colors.accent,
          borderBottom: `1px solid ${colors.ring}`,
        }}
      >
        {title}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function ChassisAnalyticsTable({
  symptoms = [],
  fixes = [],
  summary = [],
  loading = false,
}) {
  const { colors } = useTheme();

  const [symptomQuery, setSymptomQuery] = useState("");
  const [symptomStatus, setSymptomStatus] = useState("all");
  const [symptomPageSize, setSymptomPageSize] = useState(10);
  const [symptomPage, setSymptomPage] = useState(1);

  const [fixQuery, setFixQuery] = useState("");
  const [fixCategory, setFixCategory] = useState("all");
  const [fixPageSize, setFixPageSize] = useState(10);
  const [fixPage, setFixPage] = useState(1);

  const categories = useMemo(() => {
    return Array.from(new Set(fixes.map((item) => item.category).filter(Boolean))).sort();
  }, [fixes]);

  const filteredSymptoms = useMemo(() => {
    const q = symptomQuery.trim().toLowerCase();

    return symptoms.filter((row) => {
      const matchesQuery =
        !q ||
        row.key.toLowerCase().includes(q) ||
        String(row.description || "").toLowerCase().includes(q);

      const matchesStatus =
        symptomStatus === "all" ||
        (symptomStatus === "active" && row.isActive) ||
        (symptomStatus === "inactive" && !row.isActive);

      return matchesQuery && matchesStatus;
    });
  }, [symptoms, symptomQuery, symptomStatus]);

  const filteredFixes = useMemo(() => {
    const q = fixQuery.trim().toLowerCase();

    return fixes.filter((row) => {
      const matchesQuery =
        !q ||
        row.key.toLowerCase().includes(q) ||
        String(row.category || "").toLowerCase().includes(q);

      const matchesCategory =
        fixCategory === "all" || row.category === fixCategory;

      return matchesQuery && matchesCategory;
    });
  }, [fixes, fixQuery, fixCategory]);

  useEffect(() => {
    setSymptomPage(1);
  }, [symptomQuery, symptomStatus, symptomPageSize]);

  useEffect(() => {
    setFixPage(1);
  }, [fixQuery, fixCategory, fixPageSize]);

  const symptomTotal = filteredSymptoms.length;
  const symptomTotalPages = Math.max(1, Math.ceil(symptomTotal / symptomPageSize));
  const safeSymptomPage = Math.min(symptomPage, symptomTotalPages);
  const symptomRows = filteredSymptoms.slice(
    (safeSymptomPage - 1) * symptomPageSize,
    safeSymptomPage * symptomPageSize
  );

  const fixTotal = filteredFixes.length;
  const fixTotalPages = Math.max(1, Math.ceil(fixTotal / fixPageSize));
  const safeFixPage = Math.min(fixPage, fixTotalPages);
  const fixRows = filteredFixes.slice(
    (safeFixPage - 1) * fixPageSize,
    safeFixPage * fixPageSize
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <AnalyticsStatCard
            key={item.key}
            label={item.label}
            value={item.value}
            help={item.help}
          />
        ))}
      </div>

      <TableShell title="Most Reported Symptoms" colors={colors}>
        <AnalyticsToolbar
          search={symptomQuery}
          onSearch={setSymptomQuery}
          searchPlaceholder="Search symptoms..."
          pageSize={symptomPageSize}
          onPageSize={setSymptomPageSize}
          filters={[
            {
              key: "status",
              value: symptomStatus,
              onChange: setSymptomStatus,
              options: [
                { label: "All Statuses", value: "all" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ],
            },
          ]}
        />

        <div
          className="overflow-x-auto rounded-2xl"
          style={{
            border: `1px solid ${colors.ring}`,
            backgroundColor: colors.bg2,
          }}
        >
          <table className="min-w-[760px] w-full text-sm">
            <thead>
              <tr
                className="text-xs uppercase"
                style={{ color: colors.accent }}
              >
                <th className="px-4 py-3 text-left">Symptom</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Count</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center"
                    style={{ color: colors.text2 }}
                  >
                    Loading...
                  </td>
                </tr>
              ) : symptomRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center"
                    style={{ color: colors.text2 }}
                  >
                    No symptom analytics found.
                  </td>
                </tr>
              ) : (
                symptomRows.map((row) => (
                  <tr
                    key={row.key}
                    style={{
                      borderTop: `1px solid ${colors.ring}`,
                    }}
                  >
                    <td className="px-4 py-3 font-medium" style={{ color: colors.text }}>
                      {row.key}
                    </td>
                    <td className="px-4 py-3" style={{ color: colors.text2 }}>
                      {row.description || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: row.isActive
                            ? "rgba(34,197,94,0.14)"
                            : "rgba(239,68,68,0.14)",
                          color: row.isActive ? "#22c55e" : "#ef4444",
                        }}
                      >
                        {row.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: colors.text2 }}>
                      {row.count}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          page={safeSymptomPage}
          pageSize={symptomPageSize}
          totalItems={symptomTotal}
          onPageChange={setSymptomPage}
        />
      </TableShell>

      <TableShell title="Top Fixes Applied" colors={colors}>
        <AnalyticsToolbar
          search={fixQuery}
          onSearch={setFixQuery}
          searchPlaceholder="Search fixes..."
          pageSize={fixPageSize}
          onPageSize={setFixPageSize}
          filters={[
            {
              key: "category",
              value: fixCategory,
              onChange: setFixCategory,
              options: [
                { label: "All Categories", value: "all" },
                ...categories.map((value) => ({
                  label: value,
                  value,
                })),
              ],
            },
          ]}
        />

        <div
          className="overflow-x-auto rounded-2xl"
          style={{
            border: `1px solid ${colors.ring}`,
            backgroundColor: colors.bg2,
          }}
        >
          <table className="min-w-[620px] w-full text-sm">
            <thead>
              <tr
                className="text-xs uppercase"
                style={{ color: colors.accent }}
              >
                <th className="px-4 py-3 text-left">Fix</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Count</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-10 text-center"
                    style={{ color: colors.text2 }}
                  >
                    Loading...
                  </td>
                </tr>
              ) : fixRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-10 text-center"
                    style={{ color: colors.text2 }}
                  >
                    No fix analytics found.
                  </td>
                </tr>
              ) : (
                fixRows.map((row) => (
                  <tr
                    key={row.key}
                    style={{
                      borderTop: `1px solid ${colors.ring}`,
                    }}
                  >
                    <td className="px-4 py-3 font-medium" style={{ color: colors.text }}>
                      {row.key}
                    </td>
                    <td className="px-4 py-3" style={{ color: colors.text2 }}>
                      {row.category || "Other"}
                    </td>
                    <td className="px-4 py-3" style={{ color: colors.text2 }}>
                      {row.count}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          page={safeFixPage}
          pageSize={fixPageSize}
          totalItems={fixTotal}
          onPageChange={setFixPage}
        />
      </TableShell>
    </div>
  );
}