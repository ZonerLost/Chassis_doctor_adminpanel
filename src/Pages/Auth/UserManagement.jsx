import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import SectionCard from "../../components/ui/common/SectionCard";
import SearchInput from "../../components/ui/common/SearchInput";
// updateUser is accessed through the useUsers hook; keep import commented for reference
// import { updateUser } from "../../data/users.service";
import { useUsers } from "../../hooks/useUsers";
import { MdPersonAdd } from "react-icons/md";
import UserEditorDrawer from "../../components/user/UserEditorDrawer";
import UserEditorModal from "../../components/user/UserEditorModal";
import { COLORS } from "../../components/ui/shared/theme.js";
import Pagination from "../../components/ui/common/Pagination";
import UserFiltersBar from "../../components/user/UserFiltersBar";
import UserDirectoryTable from "../../components/user/UserDirectoryTable";

const UserManagement = () => {
  const { colors, isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const { rows: users, save: saveUser } = useUsers();

  // Filter users based on search term, role, and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      !roleFilter || user.role?.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus =
      !statusFilter ||
      user.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesRole && matchesStatus;
  });

  const onEdit = (u) => {
    setSelected(u);
    setOpen(true);
  };

  const onSave = async (form) => {
    try {
      await saveUser(form);
      setOpen(false);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  // role/status badges are handled by UserDirectoryTable

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
          // Responsive control group: stack on small screens, inline on sm+
          <div className="flex gap-3 flex-col sm:flex-row sm:items-center w-full sm:w-auto">
            <div className="w-full sm:w-auto flex justify-end sm:justify-start">
              <button
                onClick={() => {
                  setSelected(null);
                  setOpen(true);
                }}
                aria-label="Add user"
                className="px-3 py-2 rounded-lg flex items-center gap-2"
                style={{
                  backgroundColor: colors.accent,
                  color: "#000",
                }}
              >
                <span className="hidden sm:inline">Add User</span>
                <MdPersonAdd className="sm:hidden" />
              </button>
            </div>
            <div className="w-full sm:w-auto">
              <select
                className="w-full sm:w-auto px-3 py-2 text-sm rounded-lg border transition-colors duration-200 appearance-none cursor-pointer"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.ring,
                  color: colors.text,
                  colorScheme: isDark ? "dark" : "light",
                }}
                aria-label="Filter by role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option
                  value=""
                  style={{ backgroundColor: colors.card, color: colors.text }}
                >
                  All Roles
                </option>
                <option
                  value="admin"
                  style={{ backgroundColor: colors.card, color: colors.text }}
                >
                  Admin
                </option>
                <option
                  value="instructor"
                  style={{ backgroundColor: colors.card, color: colors.text }}
                >
                  Instructor
                </option>
                <option
                  value="driver"
                  style={{ backgroundColor: colors.card, color: colors.text }}
                >
                  Driver
                </option>
                <option
                  value="staff"
                  style={{ backgroundColor: colors.card, color: colors.text }}
                >
                  Staff
                </option>
              </select>
            </div>

            <div className="w-full sm:w-auto">
              <select
                className="w-full sm:w-auto px-3 py-2 text-sm rounded-lg border transition-colors duration-200 appearance-none cursor-pointer"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.ring,
                  color: colors.text,
                  colorScheme: isDark ? "dark" : "light",
                }}
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option
                  value=""
                  style={{ backgroundColor: colors.card, color: colors.text }}
                >
                  All Status
                </option>
                <option
                  value="active"
                  style={{ backgroundColor: colors.card, color: colors.text }}
                >
                  Active
                </option>
                <option
                  value="suspended"
                  style={{ backgroundColor: colors.card, color: colors.text }}
                >
                  Suspended
                </option>
                <option
                  value="inactive"
                  style={{ backgroundColor: colors.card, color: colors.text }}
                >
                  Inactive
                </option>
              </select>
            </div>
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
            <UserDirectoryTable
              rows={filteredUsers}
              loading={false}
              onEdit={onEdit}
              onToggleSuspend={async (u) => {
                // toggle status and save
                const next = {
                  ...u,
                  status: u.status === "active" ? "suspended" : "active",
                };
                try {
                  await saveUser(next);
                } catch (err) {
                  console.error("Failed toggling user status", err);
                }
              }}
            />
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm" style={{ color: colors.text2 }}>
              Showing {filteredUsers.length} of {users.length} users
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
        <UserEditorModal
          isOpen={open}
          user={selected}
          onClose={() => setOpen(false)}
          onSave={onSave}
        />
      )}
    </div>
  );
};

export default UserManagement;
