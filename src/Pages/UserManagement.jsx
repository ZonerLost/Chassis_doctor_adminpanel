import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { MdPersonAdd } from "react-icons/md";
import SearchInput from "../components/ui/common/SearchInput";
import SectionCard from "../components/ui/common/SectionCard";
import ConfirmModal from "../components/ui/shared/ConfirmModal";
import LoadingSpinner from "../components/ui/shared/LoadingSpinner.jsx";
import UserDirectoryTable from "../components/user/UserDirectoryTable";
import UserEditorModal from "../components/user/UserEditorModal";
import { useTheme } from "../contexts/ThemeContext";
import { useUsers } from "../hooks/useUsers";

const PAGE_SIZE_OPTIONS = [15, 50, 100];
const DEFAULT_NEW_USER_ROLE = "parent";

const getUserDisplayName = (user) =>
  user?.fullName?.trim() || user?.email?.trim() || "this user";

const UserManagement = () => {
  const { colors, isDark } = useTheme();
  const [editingUser, setEditingUser] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    setEditingUser(null);
    setEditorOpen(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setEditorOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;

    setDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const openDeleteModal = (user) => {
    if (!user || isDeleting) return;

    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleSave = async (form) => {
    const isCreate = !form?.id;
    const normalizedForm = isCreate
      ? { ...form, role: DEFAULT_NEW_USER_ROLE }
      : { ...form, role: undefined };

    try {
      await save(normalizedForm);
      toast.success(
        isCreate ? "User added successfully." : "User updated successfully."
      );
      setEditorOpen(false);
    } catch (error) {
      console.error(
        isCreate ? "Failed to create user:" : "Failed to update user:",
        error
      );
      toast.error(
        isCreate
          ? "Could not add user. Please try again."
          : "Could not update user. Please try again."
      );
    }
  };

  const handleDelete = async () => {
    if (!selectedUser?.id || isDeleting) return;

    setIsDeleting(true);

    try {
      await remove(selectedUser.id);
      toast.success("User deleted successfully");
      setDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error(error?.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
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
                onDelete={openDeleteModal}
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

      {editorOpen ? (
        <UserEditorModal
          isOpen={editorOpen}
          user={editingUser}
          onClose={() => setEditorOpen(false)}
          onSave={handleSave}
        />
      ) : null}

      <ConfirmModal
        open={deleteModalOpen}
        title="Delete user"
        description={
          selectedUser
            ? `Are you sure you want to delete ${getUserDisplayName(
                selectedUser
              )}? This action cannot be undone.`
            : ""
        }
        confirmText="Delete User"
        cancelText="Cancel"
        loading={isDeleting}
        loadingLabel="Deleting..."
        variant="danger"
        onCancel={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default UserManagement;
