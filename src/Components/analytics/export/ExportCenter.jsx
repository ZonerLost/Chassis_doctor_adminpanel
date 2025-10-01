import React, { useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function ExportCenter({ schedules = [], onExport, onSchedule }) {
  const { colors } = useTheme();
  const [type, setType] = useState("engagement");
  const [cadence, setCadence] = useState("weekly");
  const [email, setEmail] = useState("");

  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-3 gap-3">
        <label className="block text-xs">
          <span className="block mb-1" style={{ color: colors.text2 }}>
            Report Type
          </span>
          <select
            className="w-full rounded-xl border px-3 py-2"
            style={{
              borderColor: colors.ring,
              backgroundColor: colors.hover,
              color: colors.text,
            }}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="engagement">Engagement</option>
            <option value="courses">Courses</option>
            <option value="chassis">Chassis</option>
          </select>
        </label>
        <div className="flex items-end gap-2">
          <button
            className="px-3 py-2 rounded-xl border"
            style={{
              borderColor: colors.ring,
              backgroundColor: colors.hover,
              color: colors.text2,
            }}
            onClick={() => onExport?.(type)}
          >
            Download CSV
          </button>
        </div>
      </div>

      <div
        className="p-4 rounded-2xl border"
        style={{ borderColor: colors.ring, backgroundColor: colors.hover }}
      >
        <div
          className="text-sm font-semibold mb-3"
          style={{ color: colors.text }}
        >
          Schedule automated report
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <label className="block text-xs">
            <span className="block mb-1" style={{ color: colors.text2 }}>
              Cadence
            </span>
            <select
              className="w-full rounded-xl border px-3 py-2"
              style={{
                borderColor: colors.ring,
                backgroundColor: colors.hover,
                color: colors.text,
              }}
              value={cadence}
              onChange={(e) => setCadence(e.target.value)}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
          <label className="block text-xs md:col-span-2">
            <span className="block mb-1" style={{ color: colors.text2 }}>
              Email
            </span>
            <input
              type="email"
              placeholder="ops@example.com"
              className="w-full rounded-xl border px-3 py-2"
              style={{
                borderColor: colors.ring,
                backgroundColor: colors.hover,
                color: colors.text,
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
        <div className="mt-3 flex items-center justify-end">
          <button
            className="px-4 py-2 rounded-xl border"
            style={{
              borderColor: colors.accent,
              backgroundColor: colors.accent + "26",
              color: colors.accent,
            }}
            onClick={() => email && onSchedule?.({ type, cadence, email })}
          >
            Schedule
          </button>
        </div>
      </div>

      <div>
        <div
          className="text-sm font-semibold mb-2"
          style={{ color: colors.text }}
        >
          Scheduled Reports
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[680px] w-full text-sm">
            <thead>
            <tr
              className="uppercase text-xs"
              style={{ color: colors.accent, backgroundColor: colors.accent + "10" }}
            >
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Cadence</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Created</th>
            </tr>
          </thead>
            <tbody
              className="divide-y"
              style={{ borderColor: colors.ring, color: colors.text }}
            >
              {schedules.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center"
                    style={{ color: colors.text2 }}
                  >
                    No schedules
                  </td>
                </tr>
              ) : (
                schedules.map((s) => (
                  <tr key={s.id} className="hover:bg-black/10">
                    <td className="px-4 py-3 capitalize">{s.type}</td>
                    <td className="px-4 py-3 capitalize">{s.cadence}</td>
                    <td className="px-4 py-3">{s.email}</td>
                    <td className="px-4 py-3">
                      {new Intl.DateTimeFormat(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      }).format(
                        new Date(
                          typeof s.createdAt === "number"
                            ? s.createdAt
                            : s.createdAt
                        )
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
