import React from "react";
import { COLORS } from "../../components/ui/shared/theme.js";

export default function SessionMonitorTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[760px] w-full text-sm">
        <thead>
          <tr
            className="uppercase text-xs"
            style={{ color: COLORS.accent, backgroundColor: "#f0fdf4" }}
          >
            <th className="px-4 py-3 text-left">User</th>
            <th className="px-4 py-3 text-left">Device</th>
            <th className="px-4 py-3 text-left">IP</th>
            <th className="px-4 py-3 text-left">Last Login</th>
          </tr>
        </thead>
        <tbody
          className="divide-y"
          style={{ borderColor: COLORS.ring, color: COLORS.text }}
        >
          {rows.map((u) => (
            <tr key={u.id} className="hover:bg-black/10">
              <td className="px-4 py-3">{u.fullName}</td>
              <td className="px-4 py-3">{u.device}</td>
              <td className="px-4 py-3">{u.lastLoginIp}</td>
              <td className="px-4 py-3">
                {new Intl.DateTimeFormat(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(u.lastLoginAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
