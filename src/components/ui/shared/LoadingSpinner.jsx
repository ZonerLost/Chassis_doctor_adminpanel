import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

const LoadingSpinner = ({ label = "Loading...", subtle = false }) => {
  const { colors, isDark } = useTheme();
  const accentGlow = `${colors.accent}33`;
  const purpleGlow = `${colors.purple}33`;

  return (
    <div
      className={`flex items-center justify-center ${subtle ? "py-6" : "p-8"}`}
      style={{
        color: colors.text,
        background: subtle
          ? "transparent"
          : `linear-gradient(135deg, ${colors.bg} 0%, ${colors.bg2} 100%)`,
      }}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-70"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${accentGlow}, transparent 60%), radial-gradient(circle at 70% 70%, ${purpleGlow}, transparent 60%)`,
            }}
          />
          <div
            className="relative h-12 w-12"
            role="status"
            aria-live="polite"
            aria-label={label}
          >
            <div
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: `${colors.accent}33` }}
            />
            <div
              className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"
              style={{
                borderColor: colors.accent,
                borderTopColor: "transparent",
                boxShadow: `0 0 18px ${colors.accent}66`,
              }}
            />
            <div
              className="absolute inset-[6px] rounded-full border border-dashed animate-[spin_1.8s_linear_infinite]"
              style={{
                borderColor: colors.purple,
                opacity: 0.85,
              }}
            />
            <div
              className="absolute inset-3 rounded-full"
              style={{
                background: isDark
                  ? "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0))"
                  : "linear-gradient(145deg, rgba(0,0,0,0.03), rgba(0,0,0,0))",
                boxShadow: `inset 0 1px 0 ${colors.ring}`,
              }}
            />
          </div>
        </div>
        {label ? (
          <div className="flex flex-col">
            <span className="text-sm font-semibold" style={{ color: colors.text }}>
              {label}
            </span>
            <span className="text-xs tracking-wide" style={{ color: colors.text2 }}>
              Preparing your dashboard
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LoadingSpinner;
