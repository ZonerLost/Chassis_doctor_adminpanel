import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function DoctorSectionCard({
  title,
  subtitle,
  right,
  children,
}) {
  const { colors } = useTheme();

  return (
    <section
      className="rounded-2xl p-4 md:p-5"
      style={{
        backgroundColor: colors.bg2,
        border: `1px solid ${colors.ring}`,
      }}
    >
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-base font-semibold" style={{ color: colors.text }}>
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-sm" style={{ color: colors.text2 }}>
              {subtitle}
            </p>
          ) : null}
        </div>

        {right ? <div className="shrink-0">{right}</div> : null}
      </div>

      {children}
    </section>
  );
}