import React from "react";
import { COLORS } from "../../components/ui/shared/theme.js";

const ROLE_OPTIONS = [
  { key: "driver", label: "Driver" },
  { key: "instructor", label: "Instructor" },
  { key: "staff", label: "Staff" },
  { key: "admin", label: "Admin" },
];

export default function RolesPermissionsTable({ rows, onPromote }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[700px] w-full text-sm">
        <thead>
          <tr
            className="uppercase text-xs"
            style={{ color: COLORS.accent, backgroundColor: "#f0fdf4" }}
          >
            <th className="px-4 py-3 text-left">User</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Current Role</th>
            <th className="px-4 py-3 text-right">Change To</th>
          </tr>
        </thead>
        <tbody
          className="divide-y"
          style={{ borderColor: COLORS.ring, color: COLORS.text }}
        >
          {rows.map((u) => (
            <tr key={u.id} className="hover:bg-black/10">
              <td className="px-4 py-3">{u.fullName}</td>
              <td className="px-4 py-3">{u.email}</td>
              <td className="px-4 py-3 capitalize">{u.role}</td>
              <td className="px-4 py-3 text-right">
                <select
                  className="rounded-xl border px-3 py-2 text-xs"
                  style={{
                    borderColor: COLORS.ring,
                    backgroundColor: COLORS.hover,
                    color: COLORS.text,
                  }}
                  defaultValue={u.role}
                  onChange={(e) => onPromote(u, e.target.value)}
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
