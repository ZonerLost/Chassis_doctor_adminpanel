import React from "react";
import { MdEdit } from "react-icons/md";
import { useTheme } from "../../contexts/ThemeContext";

const RoleBadge = ({ role }) => {
  const colors = {
    admin: { bg: "#DC2626", text: "#FEE2E2" },
    instructor: { bg: "#059669", text: "#D1FAE5" },
    driver: { bg: "#0284C7", text: "#DBEAFE" },
    staff: { bg: "#7C2D12", text: "#FED7AA" },
  };

  const color = colors[role] || colors.driver;

  return (
    <span
      className="px-2 py-1 text-xs rounded-full font-medium"
      style={{ backgroundColor: color.bg + "20", color: color.bg }}
    >
      {role}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const isActive = status === "active";

  return (
    <span
      className="px-2 py-1 text-xs rounded-full font-medium"
      style={{
        backgroundColor: isActive ? "#059669" + "20" : "#DC2626" + "20",
        color: isActive ? "#059669" : "#DC2626",
      }}
    >
      {status}
    </span>
  );
};

export default function UserDirectoryTable({
  rows = [],
  loading,
  onEdit,
  onToggleSuspend,
}) {
  const { isDark, colors } = useTheme();

  const headerStyle = isDark
    ? { color: colors.accent, backgroundColor: "#1a1a1a" }
    : { color: "#000", backgroundColor: "#fff" };

  const bodyTextColor = isDark ? colors.text : "#000";

  return (
    <div>
      {/* Desktop / tablet: original table (hidden on small screens) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-[860px] w-full text-sm">
          <thead>
            <tr className="uppercase text-xs" style={headerStyle}>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Courses</th>
              <th className="px-4 py-3 text-left">Chassis</th>
              <th className="px-4 py-3 text-left">Last Login</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody
            className="divide-y"
            style={{ borderColor: colors.ring, color: bodyTextColor }}
          >
            {loading ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center"
                  style={{ color: colors.text2 }}
                >
                  Loading users…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center"
                  style={{ color: colors.text2 }}
                >
                  No users found.
                </td>
              </tr>
            ) : (
              rows.map((u) => (
                <tr key={u.id} className="hover:bg-black/10">
                  <td className="px-4 py-3">{u.fullName}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3 capitalize">
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="px-4 py-3 capitalize">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-4 py-3">{u.purchasedCourses}</td>
                  <td className="px-4 py-3">{u.chassisUses}</td>
                  <td className="px-4 py-3">
                    {new Intl.DateTimeFormat(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(u.lastLoginAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        className="px-3 py-1.5 rounded-xl border text-xs flex items-center gap-2"
                        style={{
                          borderColor: colors.ring,
                          backgroundColor: isDark ? colors.hover : "#fff",
                          color: isDark ? colors.text2 : "#000",
                        }}
                        onClick={() => onEdit?.(u)}
                      >
                        <span className="inline-block sm:hidden">
                          <MdEdit size={16} />
                        </span>
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        className="px-3 py-1.5 rounded-xl border text-xs"
                        style={{
                          borderColor: colors.ring,
                          backgroundColor: isDark ? colors.hover : "#fff",
                          color: isDark ? colors.text2 : "#000",
                        }}
                        onClick={() => onToggleSuspend?.(u)}
                      >
                        {u.status === "active" ? "Suspend" : "Activate"}
                      </button>
                    </div>
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
            Loading users…
          </div>
        ) : rows.length === 0 ? (
          <div
            className="p-3 rounded-lg"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
              color: colors.text2,
            }}
          >
            No users found.
          </div>
        ) : (
          rows.map((u) => (
            <div
              key={u.id}
              className="p-3 rounded-lg"
              style={{
                backgroundColor: colors.card || colors.bg2,
                border: `1px solid ${colors.ring}`,
                color: bodyTextColor,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600 }}>{u.fullName}</div>
                  <div
                    style={{
                      color: colors.text2,
                      fontSize: 13,
                      marginTop: 6,
                    }}
                  >
                    {u.email}
                  </div>
                  <div
                    style={{
                      color: colors.text2,
                      fontSize: 13,
                      marginTop: 6,
                    }}
                  >
                    <RoleBadge role={u.role} />
                  </div>
                  <div
                    style={{
                      color: colors.text2,
                      fontSize: 13,
                      marginTop: 6,
                    }}
                  >
                    Courses: {u.purchasedCourses} • Chassis: {u.chassisUses}
                  </div>
                  {u.lastLoginAt ? (
                    <div
                      className="mt-2 text-xs"
                      style={{ color: colors.text2 }}
                    >
                      Last login:{" "}
                      {new Intl.DateTimeFormat(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(u.lastLoginAt)}
                    </div>
                  ) : null}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    alignItems: "flex-end",
                  }}
                >
                  <div style={{ color: colors.text2, fontSize: 12 }}>
                    <StatusBadge status={u.status} />
                  </div>
                  <button
                    className="px-3 py-1.5 rounded-xl border text-xs"
                    style={{
                      borderColor: colors.ring,
                      backgroundColor: isDark ? colors.hover : "#fff",
                      color: isDark ? colors.text2 : "#000",
                    }}
                    onClick={() => onEdit?.(u)}
                  >
                    <span className="inline-block sm:hidden">
                      <MdEdit size={16} />
                    </span>
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-xl border text-xs"
                    style={{
                      borderColor: colors.ring,
                      backgroundColor: isDark ? colors.hover : "#fff",
                      color: isDark ? colors.text2 : "#000",
                    }}
                    onClick={() => onToggleSuspend?.(u)}
                  >
                    {u.status === "active" ? "Suspend" : "Activate"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
