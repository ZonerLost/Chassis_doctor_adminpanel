import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { MdClose, MdSave, MdEdit } from "react-icons/md";

export default function UserEditorModal({ isOpen, onClose, user, onSave }) {
  const { colors } = useTheme();
  const [form, setForm] = useState(user || null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  useEffect(
    () =>
      setForm(
        user || {
          fullName: "",
          email: "",
          role: "driver",
          status: "active",
          purchasedCourses: 0,
          chassisUses: 0,
        }
      ),
    [user, isOpen]
  );
  if (!isOpen) return null;

  const patch = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    const email = String(form?.email || "").trim();
    // require a gmail address
    if (!email) {
      e.email = "Email is required.";
    } else if (!/^\S+@gmail\.com$/i.test(email)) {
      e.email = "Enter a valid Gmail address (example@gmail.com).";
    }

    const purchased = Number(form?.purchasedCourses ?? 0);
    if (!Number.isFinite(purchased) || purchased <= 0) {
      e.purchasedCourses = "Courses must be a number greater than 0.";
    }

    const chassis = Number(form?.chassisUses ?? 0);
    if (!Number.isFinite(chassis) || chassis <= 0) {
      e.chassisUses = "Chassis must be a number greater than 0.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  try {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
          style={{
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        />

        <div
          className="relative bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          style={{ backgroundColor: colors.card, color: colors.text }}
        >
          <div
            className="flex items-center justify-between p-5 border-b"
            style={{ borderColor: colors.ring }}
          >
            <div>
              <h3 className="text-lg font-semibold">
                {user ? "Edit User" : "Add User"}
              </h3>
              <p className="text-sm mt-1" style={{ color: colors.text2 }}>
                {user
                  ? "Update profile fields and save."
                  : "Fill the fields to create a new user."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg"
              style={{ backgroundColor: colors.bg2 }}
            >
              <MdClose size={18} style={{ color: colors.text2 }} />
            </button>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-3">
              <label className="block text-sm">
                <span
                  className="block text-xs mb-1"
                  style={{ color: colors.text2 }}
                >
                  Full Name
                </span>
                <input
                  className="w-full rounded-xl border px-3 py-2"
                  style={{
                    borderColor: colors.ring,
                    backgroundColor: colors.hover,
                    color: colors.text,
                  }}
                  value={form?.fullName || ""}
                  onChange={(e) => patch("fullName", e.target.value)}
                />
              </label>

              <label className="block text-sm">
                <span
                  className="block text-xs mb-1"
                  style={{ color: colors.text2 }}
                >
                  Email
                </span>
                <input
                  className="w-full rounded-xl border px-3 py-2"
                  style={{
                    borderColor: colors.ring,
                    backgroundColor: colors.hover,
                    color: colors.text,
                  }}
                  value={form?.email || ""}
                  onChange={(e) => patch("email", e.target.value)}
                />
                {errors.email && (
                  <div className="text-xs mt-1 text-red-400">
                    {errors.email}
                  </div>
                )}
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm">
                  <span
                    className="block text-xs mb-1"
                    style={{ color: colors.text2 }}
                  >
                    Role
                  </span>
                  <select
                    className="w-full rounded-xl border px-3 py-2"
                    style={{
                      borderColor: colors.ring,
                      backgroundColor: colors.hover,
                      color: colors.text,
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
                    style={{ color: colors.text2 }}
                  >
                    Status
                  </span>
                  <select
                    className="w-full rounded-xl border px-3 py-2"
                    style={{
                      borderColor: colors.ring,
                      backgroundColor: colors.hover,
                      color: colors.text,
                    }}
                    value={form?.status || "active"}
                    onChange={(e) => patch("status", e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <label className="block text-sm">
                  <span
                    className="block text-xs mb-1"
                    style={{ color: colors.text2 }}
                  >
                    Courses
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-full rounded-xl border px-3 py-2"
                    style={{
                      borderColor: colors.ring,
                      backgroundColor: colors.hover,
                      color: colors.text,
                    }}
                    value={String(form?.purchasedCourses ?? 0)}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9]/g, "");
                      patch("purchasedCourses", v === "" ? 0 : Number(v));
                    }}
                  />
                  {errors.purchasedCourses && (
                    <div className="text-xs mt-1 text-red-400">
                      {errors.purchasedCourses}
                    </div>
                  )}
                </label>

                <label className="block text-sm">
                  <span
                    className="block text-xs mb-1"
                    style={{ color: colors.text2 }}
                  >
                    Chassis
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-full rounded-xl border px-3 py-2"
                    style={{
                      borderColor: colors.ring,
                      backgroundColor: colors.hover,
                      color: colors.text,
                    }}
                    value={String(form?.chassisUses ?? 0)}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9]/g, "");
                      patch("chassisUses", v === "" ? 0 : Number(v));
                    }}
                  />
                  {errors.chassisUses && (
                    <div className="text-xs mt-1 text-red-400">
                      {errors.chassisUses}
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${colors.ring}` }}>
            <div className="p-4 px-6 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-medium border"
                style={{
                  borderColor: colors.ring,
                  color: colors.text2,
                  backgroundColor: colors.bg2,
                }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!validate()) return;
                  try {
                    setSaving(true);
                    await onSave?.(form);
                  } catch (err) {
                    console.error("Save failed", err);
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 disabled:opacity-60"
                style={{ backgroundColor: colors.accent, color: "#000" }}
              >
                <MdSave />
                <span>{saving ? "Saving..." : "Save"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  } catch (err) {
    console.error("UserEditorModal render error:", err);
    return null;
  }
}
