import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function SettingsPanel(props) {
  const { colors } = useTheme();

  // track small screens so subtitle can be forced to next line on phones
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const onChange = (e) => setIsMobile(e.matches);
    // modern + fallback APIs
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  return (
    <div
      className="w-full p-4 rounded-lg"
      style={{
        backgroundColor: colors.bg2,
        border: `1px solid ${colors.ring}`,
        color: colors.text,
      }}
    >
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start sm:items-center justify-between gap-2">
          <div style={{ minWidth: 0 }}>
            {/* render subtitle on its own line for mobile, inline for >=sm */}
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="w-full">
                  <h2
                    className="text-xl sm:text-2xl font-semibold"
                    style={{
                      color: colors.accent,
                      lineHeight: 1.2,
                      marginBottom: isMobile ? "0.25rem" : 0,
                    }}
                  >
                    Settings
                  </h2>

                  {isMobile ? (
                    <p
                      className="text-sm mt-1"
                      style={{
                        color: colors.text2,
                        display: "block",
                        lineHeight: 1.4,
                      }}
                    >
                      Manage profile, system and brand settings
                    </p>
                  ) : (
                    <p
                      className="text-sm sm:text-base inline-block sm:ml-4 align-middle"
                      style={{
                        color: colors.text2,
                        lineHeight: 1.4,
                      }}
                    >
                      Manage profile, system and brand settings
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  style={{
                    color: colors.text2,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Support Email
                </label>
                <input
                  className="w-full px-3 py-2 rounded-xl text-sm"
                  style={{
                    backgroundColor: colors.bg2,
                    color: colors.text,
                    border: `1px solid ${colors.ring}`,
                  }}
                  defaultValue={props.supportEmail}
                  aria-label="Support email"
                />
              </div>

              <div>
                <label
                  style={{
                    color: colors.text2,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Notification Channel
                </label>
                <select
                  className="w-full px-3 py-2 rounded-xl text-sm"
                  style={{
                    backgroundColor: colors.bg2,
                    color: colors.text,
                    border: `1px solid ${colors.ring}`,
                  }}
                  defaultValue={props.notificationChannel}
                  aria-label="Notification channel"
                >
                  <option value="email">Email</option>
                  <option value="slack">Slack</option>
                  <option value="none">None</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label
                  style={{
                    color: colors.text2,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Notes
                </label>
                <textarea
                  className="w-full px-3 py-2 rounded-xl text-sm"
                  style={{
                    backgroundColor: colors.bg2,
                    color: colors.text,
                    border: `1px solid ${colors.ring}`,
                    minHeight: 96,
                  }}
                  defaultValue={props.notes || ""}
                  aria-label="Notes"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex flex-col md:flex-row md:justify-end gap-2">
              <button
                className="px-3 py-2 rounded-xl w-full md:w-auto"
                style={{
                  backgroundColor: colors.bg2,
                  border: `1px solid ${colors.ring}`,
                  color: colors.text,
                }}
                onClick={props.onCancel}
              >
                Cancel
              </button>

              <button
                className="px-3 py-2 rounded-xl w-full md:w-auto"
                style={{
                  backgroundColor: colors.accent,
                  border: `1px solid ${colors.accent}`,
                  color: colors.bg,
                }}
                onClick={props.onSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
