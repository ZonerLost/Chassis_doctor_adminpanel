import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MdClose, MdLock, MdSave, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useTheme } from "../../contexts/ThemeContext";

export default function ChangePasswordModal({
  isOpen,
  loading = false,
  onClose,
  onSubmit,
}) {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setShowPassword(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const inputStyle = {
    backgroundColor: colors.hover,
    color: colors.text,
    border: `1px solid ${colors.ring}`,
  };

  const validate = () => {
    const nextErrors = {};

    if ((form.password || "").length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await onSubmit?.(form.password);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={loading ? undefined : onClose}
        style={{
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      />

      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{
          backgroundColor: colors.card,
          color: colors.text,
          border: `1px solid ${colors.ring}`,
        }}
      >
        <div
          className="flex items-center justify-between p-5 border-b"
          style={{ borderColor: colors.ring }}
        >
          <div>
            <h3 className="text-lg font-semibold">Change Password</h3>
            <p className="text-sm mt-1" style={{ color: colors.text2 }}>
              Set a new password for your admin account.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-lg"
            style={{ backgroundColor: colors.bg2 }}
          >
            <MdClose size={18} style={{ color: colors.text2 }} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs mb-1" style={{ color: colors.text2 }}>
              New Password
            </label>
            <div className="relative">
              <MdLock
                className="absolute left-3 top-1/2 -translate-y-1/2"
                size={18}
                style={{ color: colors.text2 }}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                className="w-full h-11 rounded-xl pl-10 pr-10 text-sm outline-none"
                style={{
                  ...inputStyle,
                  border: `1px solid ${errors.password ? "#EF4444" : colors.ring}`,
                }}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: colors.text2 }}
              >
                {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
              </button>
            </div>
            {errors.password ? (
              <div className="mt-1 text-xs text-red-400">{errors.password}</div>
            ) : null}
          </div>

          <div>
            <label className="block text-xs mb-1" style={{ color: colors.text2 }}>
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
              }
              className="w-full h-11 rounded-xl px-3 text-sm outline-none"
              style={{
                ...inputStyle,
                border: `1px solid ${errors.confirmPassword ? "#EF4444" : colors.ring}`,
              }}
              placeholder="Confirm new password"
            />
            {errors.confirmPassword ? (
              <div className="mt-1 text-xs text-red-400">{errors.confirmPassword}</div>
            ) : null}
          </div>
        </div>

        <div
          className="p-4 flex items-center justify-end gap-3 border-t"
          style={{ borderColor: colors.ring }}
        >
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-sm border"
            style={{
              backgroundColor: colors.bg2,
              borderColor: colors.ring,
              color: colors.text2,
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
            style={{
              backgroundColor: colors.accent,
              color: "#000",
              opacity: loading ? 0.7 : 1,
            }}
          >
            <MdSave size={16} />
            <span>{loading ? "Updating..." : "Update Password"}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}