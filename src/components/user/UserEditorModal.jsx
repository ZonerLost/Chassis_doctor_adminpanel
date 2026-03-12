import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MdClose, MdSave, MdUpload } from "react-icons/md";
import { useTheme } from "../../contexts/ThemeContext";

const emptyForm = {
  fullName: "",
  email: "",
  status: "active",
  phone: "",
  location: "",
  dob: "",
  avatarUrl: "",
  avatarFile: null,
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
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const next = buildInitialForm(user);
    setForm(next);
    setErrors({});
    setPreviewUrl(next.avatarUrl || "");
  }, [user, isOpen]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen) return null;

  const patch = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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

  const validate = () => {
    const nextErrors = {};
    const email = String(form?.email || "").trim();
    const fullName = String(form?.fullName || "").trim();
    const phone = String(form?.phone || "").trim();

    if (!fullName) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!email) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (phone && !/^[0-9+\-\s()]{7,20}$/.test(phone)) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
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
          onClick={onClose}
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
              onClick={onClose}
              className="p-2 rounded-lg"
              style={{ backgroundColor: colors.bg2 }}
            >
              <MdClose size={18} style={{ color: colors.text2 }} />
            </button>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-5">
              <div className="flex items-center gap-4">
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
                      borderColor: errors.fullName ? "#EF4444" : colors.ring,
                      backgroundColor: colors.hover,
                      color: colors.text,
                    }}
                    value={form?.fullName || ""}
                    onChange={(event) => patch("fullName", event.target.value)}
                  />
                  {errors.fullName ? (
                    <div className="text-xs mt-1 text-red-400">
                      {errors.fullName}
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
                    className="w-full rounded-xl border px-3 py-2"
                    style={{
                      borderColor: errors.email ? "#EF4444" : colors.ring,
                      backgroundColor: colors.hover,
                      color: colors.text,
                    }}
                    value={form?.email || ""}
                    onChange={(event) => patch("email", event.target.value)}
                  />
                  {errors.email ? (
                    <div className="text-xs mt-1 text-red-400">
                      {errors.email}
                    </div>
                  ) : null}
                </label>

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
                      borderColor: errors.phone ? "#EF4444" : colors.ring,
                      backgroundColor: colors.hover,
                      color: colors.text,
                    }}
                    value={form?.phone || ""}
                    onChange={(event) => patch("phone", event.target.value)}
                    placeholder="+92 300 1234567"
                  />
                  {errors.phone ? (
                    <div className="text-xs mt-1 text-red-400">
                      {errors.phone}
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
                  } catch (error) {
                    console.error("Save failed", error);
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
  } catch (error) {
    console.error("UserEditorModal render error:", error);
    return null;
  }
}
