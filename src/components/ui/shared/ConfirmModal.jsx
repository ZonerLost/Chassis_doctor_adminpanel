import React from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../../../contexts/ThemeContext";

const ConfirmModal = ({
  open,
  title = "Are you sure?",
  message = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmTone = "danger",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const { colors } = useTheme();
  if (!open) return null;

  const confirmBg =
    confirmTone === "danger" ? "#EF4444" : confirmTone === "primary" ? colors.accent : colors.text;
  const confirmColor = confirmTone === "danger" ? "#0B0B0F" : "#0B0B0F";

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={loading ? undefined : onCancel} />
      <div
        className="relative w-full max-w-md rounded-xl shadow-2xl border"
        style={{ backgroundColor: colors.card, borderColor: colors.ring, color: colors.text }}
      >
        <div className="p-4 border-b" style={{ borderColor: colors.ring }}>
          <div className="text-lg font-semibold">{title}</div>
        </div>
        <div className="p-4 text-sm" style={{ color: colors.text2 }}>
          {message}
        </div>
        <div className="p-4 flex items-center justify-end gap-3 border-t" style={{ borderColor: colors.ring }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: colors.bg2,
              color: colors.text,
              border: `1px solid ${colors.ring}`,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{
              backgroundColor: confirmBg,
              color: confirmColor,
              opacity: loading ? 0.75 : 1,
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            }}
          >
            {loading ? "Working..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
