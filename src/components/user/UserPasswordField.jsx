/*
 * User Password Field component for user surfaces within the admin interface.
 * Keeps rendering behavior isolated so higher-level modules can focus on data flow.
 */

import React from "react";
import {
  MdLock,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { useTheme } from "../../contexts/ThemeContext";

export default function UserPasswordField({
  id,
  label,
  value,
  placeholder,
  showPassword,
  onChange,
  onBlur,
  onToggleVisibility,
  error,
  helperText = "",
}) {
  const { colors } = useTheme();
  const hint = error || helperText;

  return (
    <label className="block text-sm sm:col-span-2" htmlFor={id}>
      <span className="block text-xs mb-1" style={{ color: colors.text2 }}>
        {label}
      </span>
      <div className="relative">
        <MdLock
          className="absolute left-3 top-1/2 -translate-y-1/2"
          size={18}
          style={{ color: colors.text2 }}
        />
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          className="w-full rounded-xl border px-3 py-2 pl-10 pr-10 text-sm outline-none"
          style={{
            borderColor: error ? "#EF4444" : colors.ring,
            backgroundColor: colors.hover,
            color: colors.text,
          }}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={hint ? `${id}-hint` : undefined}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: colors.text2 }}
          aria-label={`${showPassword ? "Hide" : "Show"} ${label.toLowerCase()}`}
        >
          {showPassword ? (
            <MdVisibilityOff size={18} />
          ) : (
            <MdVisibility size={18} />
          )}
        </button>
      </div>
      {hint ? (
        <div
          id={`${id}-hint`}
          className={`mt-1 text-xs ${error ? "text-red-400" : ""}`}
          style={error ? undefined : { color: colors.text2 }}
        >
          {hint}
        </div>
      ) : null}
    </label>
  );
}
