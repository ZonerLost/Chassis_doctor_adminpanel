import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { MdPersonAdd } from "react-icons/md";
import SearchInput from "../components/ui/common/SearchInput";
import SectionCard from "../components/ui/common/SectionCard";
import LoadingSpinner from "../components/ui/shared/LoadingSpinner.jsx";
import UserDirectoryTable from "../components/user/UserDirectoryTable";
import UserEditorModal from "../components/user/UserEditorModal";
import { useTheme } from "../contexts/ThemeContext";
import { useUsers } from "../hooks/useUsers";

const PAGE_SIZE_OPTIONS = [15, 50, 100];

const UserManagement = () => {
  const { colors, isDark } = useTheme();
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const {
    rows,
    loading,
    total,
    page,
    pageSize,
    totalPages,
    searchTerm,
    statusFilter,
    showingFrom,
    showingTo,
    setPage,
    setPageSize,
    setSearchTerm,
    setStatusFilter,
    save,
    remove,
  } = useUsers();

  const statusOptions = useMemo(
    () => [
      { label: "All Status", value: "" },
      { label: "Active", value: "active" },
      { label: "Suspended", value: "suspended" },
      { label: "Inactive", value: "inactive" },
    ],
    []
  );

  const openCreate = () => {
    setSelected(null);
    setOpen(true);
  };

  const openEdit = (user) => {
    setSelected(user);
    setOpen(true);
  };

  const handleSave = async (form) => {
    try {
      await save(form);
      toast.success(
        form?.id ? "User updated successfully." : "User created successfully."
      );
      setOpen(false);
    } catch (error) {
      console.error("Failed to save user:", error);
      toast.error(error?.message || "Could not save user.");
    }
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Delete ${user?.fullName || user?.email || "this user"}?`
    );

    if (!confirmed) return;

    try {
      await remove(user.id);
      toast.success("User deleted successfully.");
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error(error?.message || "Could not delete user.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            User Directory
          </h1>
          <p className="mt-1" style={{ color: colors.text2 }}>
            Manage user accounts and contact information
          </p>
        </div>
      </div>

      <SectionCard
        title="User Directory"
        headerRight={
          <div className="flex gap-3 flex-col sm:flex-row sm:items-center w-full sm:w-auto">
            <div className="w-full sm:w-auto flex justify-end sm:justify-start">
              <button
                onClick={openCreate}
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
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                {statusOptions.map((option) => (
                  <option
                    key={option.value || "all"}
                    value={option.value}
                    style={{ backgroundColor: colors.card, color: colors.text }}
                  >
                    {option.label}
                  </option>
                ))}
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
                aria-label="Rows per page"
                value={pageSize}
                onChange={(event) => setPageSize(event.target.value)}
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option
                    key={size}
                    value={size}
                    style={{ backgroundColor: colors.card, color: colors.text }}
                  >
                    {size} / page
                  </option>
                ))}
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

          <div
            className="overflow-hidden rounded-xl border"
            style={{ borderColor: colors.ring }}
          >
            {loading ? (
              <div className="flex justify-center py-12 sm:py-16">
                <LoadingSpinner label="Loading users..." subtle />
              </div>
            ) : (
              <UserDirectoryTable
                rows={rows}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm" style={{ color: colors.text2 }}>
              Showing {showingFrom}-{showingTo} of {total} users
            </div>

            <div className="flex items-center gap-2">
              <button
                className="px-3 py-2 text-sm rounded-lg border transition-colors duration-200 disabled:opacity-50"
                style={{
                  backgroundColor: colors.hover,
                  borderColor: colors.ring,
                  color: colors.text,
                }}
                disabled={page <= 1 || loading}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </button>

              <div
                className="text-sm min-w-[72px] text-center"
                style={{ color: colors.text2 }}
              >
                {page} / {totalPages}
              </div>

              <button
                className="px-3 py-2 text-sm rounded-lg border transition-colors duration-200 disabled:opacity-50"
                style={{
                  backgroundColor: colors.hover,
                  borderColor: colors.ring,
                  color: colors.text,
                }}
                disabled={page >= totalPages || loading}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </SectionCard>

      {open ? (
        <UserEditorModal
          isOpen={open}
          user={selected}
          onClose={() => setOpen(false)}
          onSave={handleSave}
        />
      ) : null}
    </div>
  );
};

export default UserManagement;
