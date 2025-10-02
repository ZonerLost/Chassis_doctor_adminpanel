import React, { useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function ExportCenter({ schedules = [], onExport, onSchedule }) {
  const { colors } = useTheme();
  const [type, setType] = useState("engagement");
  const [cadence, setCadence] = useState("weekly");
  const [email, setEmail] = useState("");

  return (
    <div className="w-full max-w-6xl mx-auto px-4 grid gap-6">
      {/* Export Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <label className="block text-xs">
          <span className="block mb-1" style={{ color: colors.text2 }}>
            Report Type
          </span>
          <select
            className="w-full rounded-xl border px-3 py-2 appearance-none cursor-pointer"
            style={{
              borderColor: colors.ring,
              backgroundColor: colors.card,
              color: colors.text,
            }}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option
              value="engagement"
              style={{ backgroundColor: colors.card, color: colors.text }}
            >
              Engagement
            </option>
            <option
              value="courses"
              style={{ backgroundColor: colors.card, color: colors.text }}
            >
              Courses
            </option>
            <option
              value="chassis"
              style={{ backgroundColor: colors.card, color: colors.text }}
            >
              Chassis
            </option>
          </select>
        </label>

        <div className="flex sm:items-end">
          <button
            className="w-full sm:w-auto px-3 py-2 rounded-xl border"
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

      {/* Schedule Section */}
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="block text-xs">
            <span className="block mb-1" style={{ color: colors.text2 }}>
              Cadence
            </span>
            <select
              className="w-full rounded-xl border px-3 py-2 appearance-none cursor-pointer"
              style={{
                borderColor: colors.ring,
                backgroundColor: colors.card,
                color: colors.text,
              }}
              value={cadence}
              onChange={(e) => setCadence(e.target.value)}
            >
              <option
                value="weekly"
                style={{ backgroundColor: colors.card, color: colors.text }}
              >
                Weekly
              </option>
              <option
                value="monthly"
                style={{ backgroundColor: colors.card, color: colors.text }}
              >
                Monthly
              </option>
            </select>
          </label>

          <label className="block text-xs sm:col-span-2">
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

        <div className="mt-3 flex justify-end">
          <button
            className={`px-4 py-2 rounded-xl border ${
              !email ? "opacity-50 cursor-not-allowed" : ""
            }`}
            style={{
              borderColor: colors.accent,
              backgroundColor: colors.accent + "26",
              color: colors.accent,
            }}
            disabled={!email}
            onClick={() => email && onSchedule?.({ type, cadence, email })}
          >
            Schedule
          </button>
        </div>
      </div>

      {/* Scheduled Reports */}
      <div>
        <div
          className="text-sm font-semibold mb-2"
          style={{ color: colors.text }}
        >
          Scheduled Reports
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block">
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead>
              <tr
                className="uppercase text-xs"
                style={{
                  color: colors.accent,
                  backgroundColor: colors.accent + "10",
                }}
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
                  <tr key={s.id} className="hover:bg-black/5">
                    <td className="px-4 py-3 capitalize">{s.type}</td>
                    <td className="px-4 py-3 capitalize">{s.cadence}</td>
                    <td className="px-4 py-3">{s.email}</td>
                    <td className="px-4 py-3">
                      {new Intl.DateTimeFormat(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      }).format(new Date(s.createdAt))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-3">
          {schedules.length === 0 ? (
            <div
              className="p-4 rounded-xl text-center border"
              style={{ borderColor: colors.ring, color: colors.text2 }}
            >
              No schedules
            </div>
          ) : (
            schedules.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-xl border"
                style={{
                  borderColor: colors.ring,
                  backgroundColor: colors.hover,
                }}
              >
                <div className="text-sm">
                  <span className="font-semibold">Type:</span>{" "}
                  <span className="capitalize">{s.type}</span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Cadence:</span>{" "}
                  <span className="capitalize">{s.cadence}</span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Email:</span> {s.email}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Created:</span>{" "}
                  {new Intl.DateTimeFormat(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  }).format(new Date(s.createdAt))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
