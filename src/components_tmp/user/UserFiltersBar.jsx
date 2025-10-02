import React from "react";
import SearchInput from "../ui/common/SearchInput";
import { COLORS } from "../../components/ui/shared/theme.js";

export default function UserFiltersBar({
  search,
  onSearch,
  role,
  onRoleChange,
  status,
  onStatusChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="flex-1 max-w-md">
        <SearchInput
          placeholder="Search users..."
          value={search}
          onChange={onSearch}
        />
      </div>

      <div className="flex gap-3">
        <select
          className="px-3 py-2 rounded-xl border text-sm"
          style={{
            borderColor: COLORS.ring,
            backgroundColor: COLORS.hover,
            color: COLORS.text,
          }}
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="instructor">Instructor</option>
          <option value="driver">Driver</option>
          <option value="staff">Staff</option>
        </select>

        <select
          className="px-3 py-2 rounded-xl border text-sm"
          style={{
            borderColor: COLORS.ring,
            backgroundColor: COLORS.hover,
            color: COLORS.text,
          }}
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
    </div>
  );
}
