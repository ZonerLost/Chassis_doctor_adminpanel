import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function DoctorButton({
  children,
  icon: Icon,
  loading = false,
  disabled = false,
  variant = "primary",
  type = "button",
  className = "",
  ...props
}) {
  const { colors } = useTheme();

  const isDisabled = disabled || loading;

  const stylesByVariant = {
    primary: {
      backgroundColor: colors.accent,
      color: "#000",
      border: `1px solid ${colors.accent}`,
    },
    secondary: {
      backgroundColor: colors.bg2,
      color: colors.text,
      border: `1px solid ${colors.ring}`,
    },
    danger: {
      backgroundColor: "rgba(239,68,68,0.12)",
      color: "#f87171",
      border: "1px solid rgba(239,68,68,0.25)",
    },
  };

  const styles = stylesByVariant[variant] || stylesByVariant.primary;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed ${className}`}
      style={{
        ...styles,
        opacity: isDisabled ? 0.65 : 1,
      }}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      ) : Icon ? (
        <Icon size={18} />
      ) : null}
      {children}
    </button>
  );
}
