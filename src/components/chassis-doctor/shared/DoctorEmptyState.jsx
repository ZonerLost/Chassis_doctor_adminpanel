/*
 * Doctor Empty State component for chassis doctor surfaces within the admin interface.
 * Keeps rendering behavior isolated so higher-level modules can focus on data flow.
 */

import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import DoctorButton from "./DoctorButton";

export default function DoctorEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionIcon,
  actionVariant = "primary",
  onAction,
  actionDisabled = false,
  className = "",
}) {
  const { colors } = useTheme();

  return (
    <div
      className={`rounded-2xl border border-dashed px-5 py-6 text-center ${className}`}
      style={{
        backgroundColor: colors.card || colors.bg,
        borderColor: colors.ring,
      }}
    >
      {Icon ? (
        <div className="mb-4 flex justify-center">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{
              backgroundColor: `${colors.accent}18`,
              color: colors.accent,
            }}
          >
            <Icon size={22} />
          </div>
        </div>
      ) : null}

      <h3 className="text-sm font-semibold" style={{ color: colors.text }}>
        {title}
      </h3>

      {description ? (
        <p
          className="mx-auto mt-2 max-w-2xl text-sm leading-6"
          style={{ color: colors.text2 }}
        >
          {description}
        </p>
      ) : null}

      {actionLabel && onAction ? (
        <div className="mt-5 flex justify-center">
          <DoctorButton
            icon={actionIcon}
            variant={actionVariant}
            onClick={onAction}
            disabled={actionDisabled}
          >
            {actionLabel}
          </DoctorButton>
        </div>
      ) : null}
    </div>
  );
}
