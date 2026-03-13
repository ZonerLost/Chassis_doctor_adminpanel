import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

export default function ActionBtn({
  to,
  icon: Icon,
  label,
  onClick,
  disabled = false,
  type = "button",
}) {
  const { colors } = useTheme();

  const sharedClassName =
    "inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition";

  const sharedStyle = {
    borderColor: colors.ring,
    backgroundColor: colors.hover,
    color: colors.text,
    opacity: disabled ? 0.6 : 1,
    pointerEvents: disabled ? "none" : "auto",
    textDecoration: "none",
  };

  const content = (
    <>
      {Icon ? <Icon size={16} /> : null}
      <span>{label}</span>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={sharedClassName}
        style={sharedStyle}
        aria-disabled={disabled}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={sharedClassName}
      style={sharedStyle}
    >
      {content}
    </button>
  );
}
