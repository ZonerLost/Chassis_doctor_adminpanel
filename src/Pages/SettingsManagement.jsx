import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext.jsx";
import SystemSettings from "./SystemSettings.jsx";
import SupportMediaSettingsPage from "./SupportMediaSettingsPage.jsx";
import SettingsPanel from "../components/support/SettingsPanel.jsx";

export default function SettingsManagement() {
  const { colors } = useTheme();

  const TABS = [
    { key: "profile", label: "Profile" },
    { key: "system", label: "System" },
    { key: "media", label: "Media" },
    { key: "brand", label: "Brand & Roles" },
  ];

  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("admin_profile") || "{}");
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("admin_profile", JSON.stringify(profile));
  }, [profile]);

  // refs to child save/reset handlers (registered by children)
  const saveRef = useRef(null);
  const resetRef = useRef(null);

  const saveProfile = (next) => {
    setProfile((p) => ({ ...p, ...next }));
    // toast/notification can be added here
  };

  const handleGlobalSave = async () => {
    if (typeof saveRef.current === "function") {
      try {
        await saveRef.current();
        // optionally re-load profile from storage
      } catch {
        // ignore - child handles validation messages
      }
    } else {
      // fallback: if on profile tab, persist profile state
      if (tab === "profile") saveProfile(profile);
      alert("Saved (demo)");
    }
  };

  const handleGlobalReset = () => {
    if (typeof resetRef.current === "function") {
      resetRef.current();
    } else {
      // fallback: reset stored profile to defaults
      setProfile({});
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-semibold" style={{ color: colors.text }}>
          Settings
        </h1>
        <div className="text-xs sm:text-sm" style={{ color: colors.text2 }}>
          Manage profile, system and brand settings
        </div>
      </div>

      {/* Styled module header like other analytics modules */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${colors.ring}` }}
      >
        <div style={{ backgroundColor: colors.accent + "10" }}>
          <div className="px-2 sm:px-4 py-2 sm:py-3 overflow-x-auto">
            <div className="flex items-center gap-2 sm:gap-4 md:gap-6 min-w-max">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="uppercase text-xs font-semibold whitespace-nowrap"
                style={{
                  color: colors.accent,
                  padding: "6px 10px",
                  borderRadius: 8,
                  background:
                    tab === t.key ? colors.accent + "15" : "transparent",
                  boxShadow:
                    tab === t.key ? `inset 0 -2px 0 ${colors.accent}` : "none",
                }}
              >
                {t.label}
              </button>
            ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        {tab === "profile" && (
          <div
            className="rounded-2xl p-3 sm:p-4"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
            }}
          >
            <ProfileSettings
              value={profile}
              onSave={saveProfile}
              registerSave={(saveFn, resetFn) => {
                saveRef.current = saveFn;
                resetRef.current = resetFn;
              }}
            />
          </div>
        )}

        {tab === "system" && (
          <div
            className="rounded-2xl p-3 sm:p-4"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
            }}
          >
            <SystemSettings
              registerSave={(s, r) => {
                saveRef.current = s;
                resetRef.current = r;
              }}
            />
          </div>
        )}

        {tab === "media" && (
          <div
            className="rounded-2xl p-3 sm:p-4"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
            }}
          >
            <SupportMediaSettingsPage />
          </div>
        )}

        {tab === "brand" && (
          <div
            className="rounded-2xl p-3 sm:p-4"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
            }}
          >
            <SettingsPanel
              brand={{}}
              founders={[]}
              plans={{ tiers: [] }}
              integrations={[]}
              roles={[]}
              audit={[]}
              onSaveBrand={() => alert("Brand saved (demo)")}
              onSaveFounders={() => alert("Founders saved (demo)")}
              onSavePlans={() => alert("Plans saved (demo)")}
              onSaveIntegrations={() => alert("Integrations saved (demo)")}
              onSaveRoles={() => alert("Roles saved (demo)")}
              onExportAudit={() => alert("Export audit (demo)")}
            />
          </div>
        )}
      </div>

      {/* Persistent action bar */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
        <button
          onClick={handleGlobalReset}
          className="px-4 py-2 rounded-xl text-sm w-full sm:w-auto"
          style={{
            backgroundColor: colors.hover,
            border: `1px solid ${colors.ring}`,
            color: colors.text2,
          }}
        >
          Reset
        </button>

        <button
          onClick={handleGlobalSave}
          className="px-4 py-2 rounded-full text-sm font-semibold flex items-center justify-center uppercase tracking-wider w-full sm:w-auto"
          style={{
            backgroundColor: colors.bg2, // dark pill background
            color: colors.gold || "#D4AF37", // gold text
            border: `1px solid ${colors.ring}`, // subtle border
            minWidth: 96,
            height: 40,
            boxShadow: `0 6px 18px ${
              colors.gold ? colors.gold + "22" : "#D4AF3722"
            }`,
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

/* ------------------- Profile form (theme-matching) ------------------- */
function ProfileSettings({
  value = {},
  onSave = () => {},
  registerSave = () => {},
}) {
  const { colors } = useTheme();
  const [form, setForm] = useState({
    name: value.name || "",
    email: value.email || "",
    avatar: value.avatar || "/assets/Logo.png",
    timezone:
      value.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    locale: value.locale || navigator.language || "en-US",
    changePwd: false,
    password: "",
    confirm: "",
  });

  useEffect(() => {
    setForm((f) => ({
      ...f,
      name: value.name || f.name,
      email: value.email || f.email,
    }));
  }, [value]);

  // register save/reset so parent "Save" / "Reset" works
  useEffect(() => {
    const saveFn = async () => {
      if (form.changePwd && form.password.length < 6) {
        alert("Password must be 6+ chars");
        throw new Error("validation");
      }
      if (form.changePwd && form.password !== form.confirm) {
        alert("Passwords do not match");
        throw new Error("validation");
      }
      onSave({
        name: form.name,
        email: form.email,
        avatar: form.avatar,
        timezone: form.timezone,
        locale: form.locale,
      });
      alert("Profile saved (demo)");
    };

    const resetFn = () => {
      setForm({
        name: "",
        email: "",
        avatar: "/assets/Logo.png",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locale: navigator.language || "en-US",
        changePwd: false,
        password: "",
        confirm: "",
      });
    };

    registerSave(saveFn, resetFn);

    return () => registerSave(null, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, onSave]);

  const inputStyle = {
    backgroundColor: colors.hover || "#12131A",
    color: colors.text,
    border: `1px solid ${colors.ring}`,
  };

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="text-xs" style={{ color: colors.text2 }}>
            Full name
          </label>
          <input
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            className="mt-1 w-full rounded-xl px-3 h-11 text-sm outline-none"
            style={inputStyle}
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="text-xs" style={{ color: colors.text2 }}>
            Avatar URL
          </label>
          <input
            value={form.avatar}
            onChange={(e) => setForm((s) => ({ ...s, avatar: e.target.value }))}
            className="mt-1 w-full rounded-xl px-3 h-11 text-sm outline-none"
            style={inputStyle}
            placeholder="/assets/avatar.png"
          />
        </div>

        <div>
          <label className="text-xs" style={{ color: colors.text2 }}>
            Email
          </label>
          <input
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            className="mt-1 w-full rounded-xl px-3 h-11 text-sm outline-none"
            style={inputStyle}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="text-xs" style={{ color: colors.text2 }}>
            Timezone
          </label>
          <input
            value={form.timezone}
            onChange={(e) =>
              setForm((s) => ({ ...s, timezone: e.target.value }))
            }
            className="mt-1 w-full rounded-xl px-3 h-11 text-sm outline-none"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="text-xs" style={{ color: colors.text2 }}>
            Locale
          </label>
          <input
            value={form.locale}
            onChange={(e) => setForm((s) => ({ ...s, locale: e.target.value }))}
            className="mt-1 w-full rounded-xl px-3 h-11 text-sm outline-none"
            style={inputStyle}
          />
        </div>
      </div>

      <div
        className="rounded-2xl p-3"
        style={{
          backgroundColor: colors.card || colors.bg2,
          border: `1px solid ${colors.ring}`,
        }}
      >
        <label
          className="inline-flex items-center gap-2 text-sm"
          style={{ color: colors.text2 }}
        >
          <input
            type="checkbox"
            checked={form.changePwd}
            onChange={(e) =>
              setForm((s) => ({ ...s, changePwd: e.target.checked }))
            }
            className="accent-[#6E56CF]"
          />
          Change password
        </label>

        {form.changePwd && (
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <input
              value={form.password}
              onChange={(e) =>
                setForm((s) => ({ ...s, password: e.target.value }))
              }
              type="password"
              placeholder="New password"
              className="rounded-xl px-3 h-11 text-sm outline-none"
              style={inputStyle}
            />
            <input
              value={form.confirm}
              onChange={(e) =>
                setForm((s) => ({ ...s, confirm: e.target.value }))
              }
              type="password"
              placeholder="Confirm password"
              className="rounded-xl px-3 h-11 text-sm outline-none"
              style={inputStyle}
            />
          </div>
        )}
      </div>
    </form>
  );
}
