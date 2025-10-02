import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

export default function ActionBtn({ to, icon: Icon, label, onClick }) {
  const { colors } = useTheme();
  const content = (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm"
      style={{
        borderColor: colors.ring,
        backgroundColor: colors.hover,
        color: colors.text,
      }}
    >
      {Icon ? <Icon size={16} /> : null}
      <span>{label}</span>
    </button>
  );

  return to ? (
    <Link to={to} style={{ textDecoration: "none" }}>
      {content}
    </Link>
  ) : (
    content
  );
}