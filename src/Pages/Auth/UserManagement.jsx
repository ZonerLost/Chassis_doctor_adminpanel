import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import SectionCard from "../../components/ui/common/SectionCard";
import SearchInput from "../../components/ui/common/SearchInput";
import { updateUser } from "../../Data/users.service";
import UserEditorDrawer from "../../components/user/UserEditorDrawer";
import { COLORS } from "../../components/ui/shared/theme";
import Pagination from "../../components/ui/common/Pagination";
import UserFiltersBar from "../../components/user/UserFiltersBar";
import UserDirectoryTable from "../../components/user/UserDirectoryTable";

const UserManagement = () => {
  const { colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const onEdit = (u) => {
    setSelected(u);
    setOpen(true);
  };

  const onSave = async (form) => {
    try {
      await updateUser(form);
      setOpen(false);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            User Directory
          </h1>
          <p className="mt-1" style={{ color: colors.text2 }}>
            Manage user accounts, roles, and permissions
          </p>
        </div>
      </div>

      {/* User Directory Section */}
      <SectionCard
        title="User Directory"
        headerRight={
          <div className="flex gap-3">
            <select
              className="px-3 py-2 text-sm rounded-lg border transition-colors duration-200"
              style={{
                backgroundColor: colors.hover,
                borderColor: colors.ring,
                color: colors.text,
              }}
            >
              <option>All Roles</option>
              <option>Admin</option>
              <option>Instructor</option>
              <option>Driver</option>
              <option>Staff</option>
            </select>
            <select
              className="px-3 py-2 text-sm rounded-lg border transition-colors duration-200"
              style={{
                backgroundColor: colors.hover,
                borderColor: colors.ring,
                color: colors.text,
              }}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Suspended</option>
              <option>Inactive</option>
            </select>
          </div>
        }
      >
        <div className="space-y-4">
          <SearchInput
            placeholder="Search users..."
            value={searchTerm}
            onChange={setSearchTerm}
          />

          {/* Users Table */}
          <div
            className="overflow-hidden rounded-xl border"
            style={{ borderColor: colors.ring }}
          >
            <table className="w-full">
              <thead>
                <tr
                  className="border-b"
                  style={{
                    backgroundColor: colors.hover,
                    borderColor: colors.ring,
                  }}
                >
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.accent }}
                  >
                    User
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.accent }}
                  >
                    Email
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.accent }}
                  >
                    Role
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.accent }}
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.accent }}
                  >
                    Courses
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.accent }}
                  >
                    Chassis
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.accent }}
                  >
                    Last Login
                  </th>
                  <th
                    className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.accent }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className="divide-y"
                style={{ divideColor: colors.ring }}
              >
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors duration-150 hover:bg-opacity-50"
                    style={{ backgroundColor: colors.bg2 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.hover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.bg2;
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm font-medium"
                        style={{ color: colors.text }}
                      >
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm"
                        style={{ color: colors.text2 }}
                      >
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: getRoleColor(user.role) + "20",
                          color: getRoleColor(user.role),
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: getStatusColor(user.status) + "20",
                          color: getStatusColor(user.status),
                        }}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm" style={{ color: colors.text2 }}>
                        -
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm" style={{ color: colors.text2 }}>
                        -
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm" style={{ color: colors.text2 }}>
                        {user.lastLogin}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          className="px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200"
                          style={{
                            backgroundColor: colors.hover,
                            color: colors.text,
                            border: `1px solid ${colors.ring}`,
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = colors.accent;
                            e.target.style.color = colors.bg;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = colors.hover;
                            e.target.style.color = colors.text;
                          }}
                          onClick={() => onEdit(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200"
                          style={{
                            backgroundColor:
                              user.status === "Active"
                                ? "#ef444420"
                                : colors.accent + "20",
                            color:
                              user.status === "Active"
                                ? "#ef4444"
                                : colors.accent,
                            border: `1px solid ${
                              user.status === "Active"
                                ? "#ef4444"
                                : colors.accent
                            }`,
                          }}
                        >
                          {user.status === "Active" ? "Suspend" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm" style={{ color: colors.text2 }}>
              Page of NaN • 1 items
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-2 text-sm rounded-lg border transition-colors duration-200 disabled:opacity-50"
                style={{
                  backgroundColor: colors.hover,
                  borderColor: colors.ring,
                  color: colors.text,
                }}
                disabled
              >
                Prev
              </button>
              <button
                className="px-3 py-2 text-sm rounded-lg border transition-colors duration-200 disabled:opacity-50"
                style={{
                  backgroundColor: colors.hover,
                  borderColor: colors.ring,
                  color: colors.text,
                }}
                disabled
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </SectionCard>

      {open && (
        <UserEditorDrawer
          user={selected}
          open={open}
          onClose={() => setOpen(false)}
          onSave={onSave}
        />
      )}
    </div>
  );
};

export default UserManagement;
