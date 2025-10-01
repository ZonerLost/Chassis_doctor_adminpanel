import React, { useEffect, useState } from "react";
import { COLORS } from "../ui/shared/theme";

export default function UserEditorDrawer({ open, onClose, user, onSave }) {
  const [form, setForm] = useState(user || null);
  useEffect(() => setForm(user || null), [user]);
  if (!open) return null;

  const patch = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60" onClick={onClose} />
      <div
        className="w-full max-w-md h-full p-5 overflow-y-auto"
        style={{ backgroundColor: COLORS.bg2, color: COLORS.text }}
      >
        <h3 className="text-lg font-semibold mb-1">Edit User</h3>
        <p className="text-xs mb-4" style={{ color: COLORS.text2 }}>
          Update profile fields and save.
        </p>

        <div className="space-y-3">
          <label className="block text-sm">
            <span
              className="block text-xs mb-1"
              style={{ color: COLORS.text2 }}
            >
              Full Name
            </span>
            <input
              className="w-full rounded-xl border px-3 py-2"
              style={{
                borderColor: COLORS.ring,
                backgroundColor: COLORS.hover,
                color: COLORS.text,
              }}
              value={form?.fullName || ""}
              onChange={(e) => patch("fullName", e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span
              className="block text-xs mb-1"
              style={{ color: COLORS.text2 }}
            >
              Email
            </span>
            <input
              className="w-full rounded-xl border px-3 py-2"
              style={{
                borderColor: COLORS.ring,
                backgroundColor: COLORS.hover,
                color: COLORS.text,
              }}
              value={form?.email || ""}
              onChange={(e) => patch("email", e.target.value)}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span
                className="block text-xs mb-1"
                style={{ color: COLORS.text2 }}
              >
                Role
              </span>
              <select
                className="w-full rounded-xl border px-3 py-2"
                style={{
                  borderColor: COLORS.ring,
                  backgroundColor: COLORS.hover,
                  color: COLORS.text,
                }}
                value={form?.role || "driver"}
                onChange={(e) => patch("role", e.target.value)}
              >
                <option value="driver">Driver</option>
                <option value="instructor">Instructor</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <label className="block text-sm">
              <span
                className="block text-xs mb-1"
                style={{ color: COLORS.text2 }}
              >
                Status
              </span>
              <select
                className="w-full rounded-xl border px-3 py-2"
                style={{
                  borderColor: COLORS.ring,
                  backgroundColor: COLORS.hover,
                  color: COLORS.text,
                }}
                value={form?.status || "active"}
                onChange={(e) => patch("status", e.target.value)}
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            className="px-4 py-2 rounded-xl border"
            style={{
              borderColor: COLORS.ring,
              backgroundColor: COLORS.hover,
              color: COLORS.text2,
            }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-xl border"
            style={{
              borderColor: COLORS.accent,
              backgroundColor: COLORS.accent + "26",
              color: COLORS.accent,
            }}
            onClick={() => onSave?.(form)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
