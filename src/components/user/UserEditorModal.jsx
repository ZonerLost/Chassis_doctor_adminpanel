/*
 * User Editor Modal component for user surfaces within the admin interface.
 * Keeps rendering behavior isolated so higher-level modules can focus on data flow.
 */

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MdClose, MdSave, MdUpload } from "react-icons/md";
import { useTheme } from "../../contexts/ThemeContext";
import UserPasswordField from "./UserPasswordField";
import {
  USER_PASSWORD_HELPER_TEXT,
  validateUserEditorForm,
} from "./userEditorValidation";

const emptyForm = {
  fullName: "",
  email: "",
  role: "parent",
  status: "active",
  phone: "",
  location: "",
  dob: "",
  avatarUrl: "",
  avatarFile: null,
  password: "",
  confirmPassword: "",
};

function buildInitialForm(user) {
  if (!user) {
    return { ...emptyForm };
  }

  return {
    ...emptyForm,
    id: user.id,
    fullName: user.fullName || "",
    email: user.email || "",
    role: user.role || "parent",
    status: user.status || "active",
    phone: user.phone || "",
    location: user.location || "",
    dob: user.dob || "",
    avatarUrl: user.avatarUrl || "",
  };
}

export default function UserEditorModal({ isOpen, onClose, user, onSave }) {
  const { colors } = useTheme();
  const [form, setForm] = useState(buildInitialForm(user));
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [touchedFields, setTouchedFields] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const mountedRef = useRef(false);

  const isCreateMode = !user?.id;
  const validationErrors = validateUserEditorForm(form, {
    requirePassword: isCreateMode,
  });
  const isFormValid = Object.keys(validationErrors).length === 0;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const next = buildInitialForm(user);
    setForm(next);
    setTouchedFields({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPreviewUrl(next.avatarUrl || "");
  }, [user, isOpen]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setShowPassword(false);
      setShowConfirmPassword(false);
      setTouchedFields({});
      onClose?.();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const patch = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const touchField = (field) => {
    setTouchedFields((prev) =>
      prev[field] ? prev : { ...prev, [field]: true }
    );
  };

  const getFieldError = (field) =>
    touchedFields[field] ? validationErrors[field] : "";

  const handleClose = () => {
    setShowPassword(false);
    setShowConfirmPassword(false);
    setTouchedFields({});
    onClose?.();
  };

  const onAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    patch("avatarFile", file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const initials =
    form?.fullName
      ?.split(" ")
      ?.filter(Boolean)
      ?.slice(0, 2)
      ?.map((part) => part[0]?.toUpperCase())
      ?.join("") || "U";

  const avatarSrc = previewUrl || "";

  try {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50"
          onClick={handleClose}
          style={{
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        />

        <div
          className="relative rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
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
                  ? "Update profile details and save."
                  : "Fill the fields to create a new user."}
              </p>
            </div>

            <button
              onClick={handleClose}
              aria-label="Close user editor"
              className="p-2 rounded-lg"
              style={{ backgroundColor: colors.bg2 }}
            >
              <MdClose size={18} style={{ color: colors.text2 }} />
            </button>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-5">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={form?.fullName || "User avatar"}
                    className="w-20 h-20 rounded-full object-cover border"
                    style={{ borderColor: colors.ring }}
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-lg font-semibold border"
                    style={{
                      borderColor: colors.ring,
                      backgroundColor: colors.hover,
                      color: colors.text,
                    }}
                  >
                    {initials}
                  </div>
                )}

                <div className="flex-1">
                  <label
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer border text-sm font-medium"
                    style={{
                      borderColor: colors.ring,
                      backgroundColor: colors.hover,
                      color: colors.text,
                    }}
                  >
                    <MdUpload size={18} />
                    <span>Upload Avatar</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onAvatarChange}
                    />
                  </label>

                  <p className="text-xs mt-2" style={{ color: colors.text2 }}>
                    JPG, PNG or WEBP image
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-sm sm:col-span-2">
                  <span
                    className="block text-xs mb-1"
                    style={{ color: colors.text2 }}
                  >
                    Full Name
                  </span>
                  <input
                    className="w-full rounded-xl border px-3 py-2"
                    style={{
                      borderColor: getFieldError("fullName")
                        ? "#EF4444"
                        : colors.ring,
                      backgroundColor: colors.hover,
                      color: colors.text,
                    }}
                    value={form?.fullName || ""}
                    onChange={(event) => patch("fullName", event.target.value)}
                    onBlur={() => touchField("fullName")}
                    placeholder="Enter full name"
                    aria-invalid={Boolean(getFieldError("fullName"))}
                  />
                  {getFieldError("fullName") ? (
                    <div className="text-xs mt-1 text-red-400">
                      {getFieldError("fullName")}
                    </div>
                  ) : null}
                </label>

                <label className="block text-sm sm:col-span-2">
                  <span
                    className="block text-xs mb-1"
                    style={{ color: colors.text2 }}
                  >
                    Email
                  </span>
                  <input
                    type="email"
                    className="w-full rounded-xl border px-3 py-2"
                    style={{
                      borderColor: getFieldError("email")
                        ? "#EF4444"
                        : colors.ring,
                      backgroundColor: colors.hover,
                      color: colors.text,
                    }}
                    value={form?.email || ""}
                    onChange={(event) => patch("email", event.target.value)}
                    onBlur={() => touchField("email")}
                    placeholder="Enter email address"
                    aria-invalid={Boolean(getFieldError("email"))}
                  />
                  {getFieldError("email") ? (
                    <div className="text-xs mt-1 text-red-400">
                      {getFieldError("email")}
                    </div>
                  ) : null}
                </label>

                {isCreateMode ? (
                  <>
                    <UserPasswordField
                      id="add-user-password"
                      label="Password"
                      value={form?.password || ""}
                      placeholder="Enter password"
                      showPassword={showPassword}
                      onChange={(event) => patch("password", event.target.value)}
                      onBlur={() => touchField("password")}
                      onToggleVisibility={() =>
                        setShowPassword((prev) => !prev)
                      }
                      error={getFieldError("password")}
                      helperText={USER_PASSWORD_HELPER_TEXT}
                    />

                    <UserPasswordField
                      id="add-user-confirm-password"
                      label="Confirm Password"
                      value={form?.confirmPassword || ""}
                      placeholder="Re-enter password"
                      showPassword={showConfirmPassword}
                      onChange={(event) =>
                        patch("confirmPassword", event.target.value)
                      }
                      onBlur={() => touchField("confirmPassword")}
                      onToggleVisibility={() =>
                        setShowConfirmPassword((prev) => !prev)
                      }
                      error={getFieldError("confirmPassword")}
                    />
                  </>
                ) : null}

                <label className="block text-sm">
                  <span
                    className="block text-xs mb-1"
                    style={{ color: colors.text2 }}
                  >
                    Phone
                  </span>
                  <input
                    className="w-full rounded-xl border px-3 py-2"
                    style={{
                      borderColor: getFieldError("phone")
                        ? "#EF4444"
                        : colors.ring,
                      backgroundColor: colors.hover,
                      color: colors.text,
                    }}
                    value={form?.phone || ""}
                    onChange={(event) => patch("phone", event.target.value)}
                    onBlur={() => touchField("phone")}
                    placeholder="+92 300 1234567"
                    aria-invalid={Boolean(getFieldError("phone"))}
                  />
                  {getFieldError("phone") ? (
                    <div className="text-xs mt-1 text-red-400">
                      {getFieldError("phone")}
                    </div>
                  ) : null}
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
                    onChange={(event) => patch("status", event.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </label>

                <label className="block text-sm">
                  <span
                    className="block text-xs mb-1"
                    style={{ color: colors.text2 }}
                  >
                    Date of Birth
                  </span>
                  <input
                    type="date"
                    className="w-full rounded-xl border px-3 py-2"
                    style={{
                      borderColor: colors.ring,
                      backgroundColor: colors.hover,
                      color: colors.text,
                    }}
                    value={form?.dob || ""}
                    onChange={(event) => patch("dob", event.target.value)}
                  />
                </label>

                <label className="block text-sm">
                  <span
                    className="block text-xs mb-1"
                    style={{ color: colors.text2 }}
                  >
                    Location
                  </span>
                  <input
                    className="w-full rounded-xl border px-3 py-2"
                    style={{
                      borderColor: colors.ring,
                      backgroundColor: colors.hover,
                      color: colors.text,
                    }}
                    value={form?.location || ""}
                    onChange={(event) => patch("location", event.target.value)}
                    placeholder="City, Country"
                  />
                </label>
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${colors.ring}` }}>
            <div className="p-4 px-6 flex items-center justify-end gap-3">
              <button
                onClick={handleClose}
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
                  if (!isFormValid) return;

                  try {
                    setSaving(true);
                    await onSave?.({
                      ...form,
                      role: form?.role || "parent",
                    });
                    if (mountedRef.current) {
                      setForm(buildInitialForm(user));
                      setShowPassword(false);
                      setShowConfirmPassword(false);
                      setTouchedFields({});
                    }
                  } catch {
                    // Parent save handler owns error feedback.
                  } finally {
                    if (mountedRef.current) {
                      setSaving(false);
                    }
                  }
                }}
                disabled={saving || !isFormValid}
                className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
  } catch (error) {
    console.error("UserEditorModal render error:", error);
    return null;
  }
}
