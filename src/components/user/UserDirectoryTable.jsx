import React from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { useTheme } from "../../contexts/ThemeContext";

const formatDateTime = (value) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
};

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
};

const StatusBadge = ({ status }) => {
  const normalized = String(status || "").toLowerCase();

  const styles = {
    active: { bg: "#05966920", color: "#059669", label: "Active" },
    suspended: { bg: "#DC262620", color: "#DC2626", label: "Suspended" },
    inactive: { bg: "#6B728020", color: "#9CA3AF", label: "Inactive" },
  };

  const current = styles[normalized] || styles.active;

  return (
    <span
      className="px-2 py-1 text-xs rounded-full font-medium"
      style={{
        backgroundColor: current.bg,
        color: current.color,
      }}
    >
      {current.label}
    </span>
  );
};

const AvatarNameCell = ({ user, colors }) => {
  const initials =
    user?.fullName
      ?.split(" ")
      ?.filter(Boolean)
      ?.slice(0, 2)
      ?.map((part) => part[0]?.toUpperCase())
      ?.join("") || "U";

  return (
    <div className="flex items-center gap-3 min-w-0">
      {user?.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.fullName || "User avatar"}
          className="w-10 h-10 rounded-full object-cover border shrink-0"
          style={{ borderColor: colors.ring }}
        />
      ) : (
        <div
          className="w-10 h-10 rounded-full border shrink-0 flex items-center justify-center text-xs font-semibold"
          style={{
            borderColor: colors.ring,
            backgroundColor: colors.hover,
            color: colors.text,
          }}
        >
          {initials}
        </div>
      )}

      <div className="min-w-0">
        <div className="font-medium truncate">{user?.fullName || "-"}</div>
        <div className="text-xs truncate" style={{ color: colors.text2 }}>
          {user?.email || "-"}
        </div>
      </div>
    </div>
  );
};

export default function UserDirectoryTable({
  rows = [],
  onEdit,
  onDelete,
}) {
  const { isDark, colors } = useTheme();

  const headerStyle = isDark
    ? { color: colors.accent, backgroundColor: "#1a1a1a" }
    : { color: "#000", backgroundColor: "#fff" };

  const bodyTextColor = isDark ? colors.text : "#000";

  return (
    <div>
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-[1100px] w-full text-sm">
          <thead>
            <tr className="uppercase text-xs" style={headerStyle}>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">DOB</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Last Login</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody
            className="divide-y"
            style={{ borderColor: colors.ring, color: bodyTextColor }}
          >
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center"
                  style={{ color: colors.text2 }}
                >
                  No users found.
                </td>
              </tr>
            ) : (
              rows.map((user) => (
                <tr key={user.id} className="hover:bg-black/10">
                  <td className="px-4 py-3">
                    <AvatarNameCell user={user} colors={colors} />
                  </td>
                  <td className="px-4 py-3">{user.phone || "-"}</td>
                  <td className="px-4 py-3">{user.location || "-"}</td>
                  <td className="px-4 py-3">{formatDate(user.dob)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-4 py-3">
                    {formatDateTime(user.lastLoginAt)}
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
                        onClick={() => onEdit?.(user)}
                      >
                        <MdEdit size={16} />
                        <span>Edit</span>
                      </button>

                      <button
                        className="px-3 py-1.5 rounded-xl border text-xs flex items-center gap-2"
                        style={{
                          borderColor: "#7F1D1D",
                          backgroundColor: "rgba(220, 38, 38, 0.08)",
                          color: "#F87171",
                        }}
                        onClick={() => onDelete?.(user)}
                      >
                        <MdDelete size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {rows.length === 0 ? (
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
          rows.map((user) => (
            <div
              key={user.id}
              className="p-4 rounded-lg"
              style={{
                backgroundColor: colors.card || colors.bg2,
                border: `1px solid ${colors.ring}`,
                color: bodyTextColor,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <AvatarNameCell user={user} colors={colors} />

                  <div
                    className="mt-3 text-sm space-y-1"
                    style={{ color: colors.text2 }}
                  >
                    <div>Phone: {user.phone || "-"}</div>
                    <div>Location: {user.location || "-"}</div>
                    <div>DOB: {formatDate(user.dob)}</div>
                    <div>Last login: {formatDateTime(user.lastLoginAt)}</div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <StatusBadge status={user.status} />

                  <button
                    className="px-3 py-1.5 rounded-xl border text-xs flex items-center gap-2"
                    style={{
                      borderColor: colors.ring,
                      backgroundColor: isDark ? colors.hover : "#fff",
                      color: isDark ? colors.text2 : "#000",
                    }}
                    onClick={() => onEdit?.(user)}
                  >
                    <MdEdit size={16} />
                    <span>Edit</span>
                  </button>

                  <button
                    className="px-3 py-1.5 rounded-xl border text-xs flex items-center gap-2"
                    style={{
                      borderColor: "#7F1D1D",
                      backgroundColor: "rgba(220, 38, 38, 0.08)",
                      color: "#F87171",
                    }}
                    onClick={() => onDelete?.(user)}
                  >
                    <MdDelete size={16} />
                    <span>Delete</span>
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
