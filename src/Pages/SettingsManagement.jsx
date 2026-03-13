/*
 * Page container for settings management workflows in the admin interface.
 * Composes feature hooks and presentational components at the route boundary.
 */

import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  MdEmail,
  MdImage,
  MdLockReset,
  MdRefresh,
  MdSave,
  MdUpload,
  MdVpnKey,
} from "react-icons/md";
import { useTheme } from "../contexts/ThemeContext.jsx";
import ChangePasswordModal from "../components/support/ChangePasswordModal.jsx";
import {
  changeCurrentAdminPassword,
  getCurrentAdminProfile,
  sendAdminPasswordResetEmail,
  updateCurrentAdminProfile,
} from "../services/settings.service.js";

function toDraft(profile) {
  return {
    fullName: profile?.fullName || "",
    email: profile?.email || "",
    avatarUrl: profile?.avatarUrl || "",
    avatarFile: null,
  };
}

export default function SettingsManagement() {
  const { colors } = useTheme();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const [profile, setProfile] = useState({
    id: "",
    fullName: "",
    email: "",
    avatarUrl: "",
  });

  const [draft, setDraft] = useState({
    fullName: "",
    email: "",
    avatarUrl: "",
    avatarFile: null,
  });

  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await getCurrentAdminProfile();
        if (!active) return;

        setProfile(data);
        setDraft(toDraft(data));
        setPreviewUrl(data.avatarUrl || "");
      } catch (error) {
        if (!active) return;
        toast.error(error?.message || "Failed to load settings.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const inputStyle = useMemo(
    () => ({
      backgroundColor: colors.hover,
      color: colors.text,
      border: `1px solid ${colors.ring}`,
    }),
    [colors]
  );

  const initials = useMemo(() => {
    return (
      draft.fullName
        ?.split(" ")
        ?.filter(Boolean)
        ?.slice(0, 2)
        ?.map((part) => part[0]?.toUpperCase())
        ?.join("") || "A"
    );
  }, [draft.fullName]);

  const patch = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    patch("avatarFile", file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleReset = () => {
    const next = toDraft(profile);
    setDraft(next);

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(profile.avatarUrl || "");
  };

  const handleSave = async () => {
    if (!draft.fullName.trim()) {
      toast.error("Full name is required.");
      return;
    }

    if (!draft.email.trim()) {
      toast.error("Email is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(draft.email.trim())) {
      toast.error("Enter a valid email address.");
      return;
    }

    try {
      setSaving(true);

      const result = await updateCurrentAdminProfile({
        fullName: draft.fullName,
        email: draft.email,
        avatarFile: draft.avatarFile,
      });

      setProfile(result.profile);
      setDraft(toDraft(result.profile));
      setPreviewUrl(result.profile.avatarUrl || "");

      toast.success("Profile updated successfully.");

      if (result.emailChangeRequested) {
        toast(
          "Your email change request was submitted. Check your inbox if confirmation is required.",
          {
            icon: "📩",
          }
        );
      }
    } catch (error) {
      toast.error(error?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      setResetLoading(true);
      await sendAdminPasswordResetEmail();
      toast.success("Password reset email sent.");
    } catch (error) {
      toast.error(error?.message || "Failed to send reset email.");
    } finally {
      setResetLoading(false);
    }
  };

  const handlePasswordChange = async (newPassword) => {
    try {
      setPasswordLoading(true);
      await changeCurrentAdminPassword(newPassword);
      toast.success("Password updated successfully.");
      setPasswordModalOpen(false);
    } catch (error) {
      toast.error(error?.message || "Failed to update password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const avatarSrc = previewUrl || draft.avatarUrl || "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: colors.text }}>
            Settings
          </h1>
          <p className="mt-1 text-sm" style={{ color: colors.text2 }}>
            Manage your admin profile and account security
          </p>
        </div>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: colors.bg2,
          border: `1px solid ${colors.ring}`,
        }}
      >
        <div
          className="px-5 py-4 border-b"
          style={{ borderColor: colors.ring }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: colors.accent }}>
            Profile
          </h2>
        </div>

        {loading ? (
          <div className="p-6 text-sm" style={{ color: colors.text2 }}>
            Loading settings...
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={draft.fullName || "Admin avatar"}
                  className="w-24 h-24 rounded-full object-cover border"
                  style={{ borderColor: colors.ring }}
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-full border flex items-center justify-center text-2xl font-semibold"
                  style={{
                    borderColor: colors.ring,
                    backgroundColor: colors.hover,
                    color: colors.text,
                  }}
                >
                  {initials}
                </div>
              )}

              <div className="space-y-2">
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
                    onChange={handleAvatarChange}
                  />
                </label>

                <p className="text-xs" style={{ color: colors.text2 }}>
                  Upload a JPG, PNG, or WEBP image for your admin profile.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1" style={{ color: colors.text2 }}>
                  Full Name
                </label>
                <div className="relative">
                  <MdImage
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    size={18}
                    style={{ color: colors.text2 }}
                  />
                  <input
                    value={draft.fullName}
                    onChange={(e) => patch("fullName", e.target.value)}
                    className="w-full rounded-xl pl-10 pr-3 h-11 text-sm outline-none"
                    style={inputStyle}
                    placeholder="Admin full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs mb-1" style={{ color: colors.text2 }}>
                  Admin Email
                </label>
                <div className="relative">
                  <MdEmail
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    size={18}
                    style={{ color: colors.text2 }}
                  />
                  <input
                    value={draft.email}
                    onChange={(e) => patch("email", e.target.value)}
                    className="w-full rounded-xl pl-10 pr-3 h-11 text-sm outline-none"
                    style={inputStyle}
                    placeholder="admin@example.com"
                  />
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl p-4"
              style={{
                backgroundColor: colors.card,
                border: `1px solid ${colors.ring}`,
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: colors.text }}>
                    Security
                  </h3>
                  <p className="mt-1 text-xs" style={{ color: colors.text2 }}>
                    Change your password instantly or send yourself a reset email.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => setPasswordModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: colors.hover,
                      border: `1px solid ${colors.ring}`,
                      color: colors.text,
                    }}
                  >
                    <MdVpnKey size={16} />
                    <span>Change Password</span>
                  </button>

                  <button
                    onClick={handleForgotPassword}
                    disabled={resetLoading}
                    className="px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: colors.hover,
                      border: `1px solid ${colors.ring}`,
                      color: colors.text,
                      opacity: resetLoading ? 0.7 : 1,
                    }}
                  >
                    <MdLockReset size={16} />
                    <span>{resetLoading ? "Sending..." : "Forgot Password"}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                onClick={handleReset}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                style={{
                  backgroundColor: colors.hover,
                  border: `1px solid ${colors.ring}`,
                  color: colors.text2,
                }}
              >
                <MdRefresh size={16} />
                <span>Reset</span>
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                style={{
                  backgroundColor: colors.accent,
                  color: "#000",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                <MdSave size={16} />
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <ChangePasswordModal
        isOpen={passwordModalOpen}
        loading={passwordLoading}
        onClose={() => setPasswordModalOpen(false)}
        onSubmit={handlePasswordChange}
      />
    </div>
  );
}