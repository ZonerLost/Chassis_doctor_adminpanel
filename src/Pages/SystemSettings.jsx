import React, { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";

export default function SystemSettings() {
  const { colors } = useTheme();
  const [settings, setSettings] = useState({
    maintenance: false,
    allowRegistrations: true,
  });

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("system_settings") || "{}");
      if (Object.keys(s).length) setSettings(s);
    } catch {
      // Ignore JSON parse errors
    }
  }, []);

  // Save function removed as it was unused

  return (
    <div className="space-y-6">
      <h1 style={{ color: colors.text }} className="text-2xl font-semibold">
        System Settings
      </h1>

      <div
        className="rounded-2xl p-4"
        style={{
          backgroundColor: colors.bg2,
          border: `1px solid ${colors.ring}`,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <div style={{ color: colors.text }}>Maintenance mode</div>
            <div className="text-xs" style={{ color: colors.text2 }}>
              Disable public access while performing maintenance
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.maintenance}
            onChange={(e) =>
              setSettings((s) => ({ ...s, maintenance: e.target.checked }))
            }
            className="h-5 w-5"
          />
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <div style={{ color: colors.text }}>Allow new registrations</div>
            <div className="text-xs" style={{ color: colors.text2 }}>
              Toggle public user sign-up
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.allowRegistrations}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                allowRegistrations: e.target.checked,
              }))
            }
            className="h-5 w-5"
          />
        </div>

        {/* Save button removed per design request */}
      </div>
    </div>
  );
}
