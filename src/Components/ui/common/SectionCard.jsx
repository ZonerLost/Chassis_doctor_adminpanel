import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function SectionCard({ 
  title, 
  headerRight, 
  children, 
  className = "" 
}) {
  const { colors } = useTheme();

  return (
    <div
      className={`rounded-2xl border shadow-sm transition-colors duration-300 ${className}`}
      style={{
        backgroundColor: colors.card,
        borderColor: colors.ring,
      }}
    >
      {title && (
        <div
          className="flex items-center justify-between p-4 md:p-6 border-b"
          style={{ borderColor: colors.ring }}
        >
          <h2 className="text-lg font-semibold" style={{ color: colors.text }}>
            {title}
          </h2>
          {headerRight}
        </div>
      )}
      <div className="p-4 md:p-6">{children}</div>
    </div>
  );
}
