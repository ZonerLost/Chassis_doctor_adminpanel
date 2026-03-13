/*
 * Confirm Modal component for ui surfaces within the admin interface.
 * Keeps rendering behavior isolated so higher-level modules can focus on data flow.
 */

import React from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../../../contexts/ThemeContext";

const ConfirmModal = ({
  open,
  title = "Are you sure?",
  description,
  message = "",
  confirmText,
  confirmLabel = "Confirm",
  cancelText,
  cancelLabel = "Cancel",
  variant,
  confirmTone = "danger",
  loading = false,
  loadingLabel = "Working...",
  onConfirm,
  onCancel,
}) => {
  const { colors, isDark } = useTheme();
  const titleId = React.useId();
  const messageId = React.useId();
  const cancelButtonRef = React.useRef(null);
  const previousFocusRef = React.useRef(null);

  const resolvedDescription = description ?? message;
  const resolvedConfirmText = confirmText ?? confirmLabel;
  const resolvedCancelText = cancelText ?? cancelLabel;
  const resolvedVariant = variant ?? confirmTone;

  const variantStyles = {
    danger: {
      backgroundColor: colors.danger || "#EF4444",
      color: "#FFFFFF",
      boxShadow: "0 16px 40px rgba(239,68,68,0.24)",
    },
    primary: {
      backgroundColor: colors.accent,
      color: "#0B0B0F",
      boxShadow: "0 16px 40px rgba(212,175,55,0.18)",
    },
    neutral: {
      backgroundColor: colors.text,
      color: colors.bg,
      boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
    },
  };

  const confirmStyle =
    variantStyles[resolvedVariant] || variantStyles.danger;

  React.useEffect(() => {
    if (!open) return undefined;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => {
      cancelButtonRef.current?.focus();
    });

    const handleKeyDown = (event) => {
      if (event.key !== "Escape" || loading) return;
      event.preventDefault();
      onCancel?.();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [loading, onCancel, open]);

  if (!open) return null;

  const handleCancel = () => {
    if (loading) return;
    onCancel?.();
  };

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4 sm:p-6"
      style={{ zIndex: 12000 }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleCancel}
      />
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={resolvedDescription ? messageId : undefined}
        style={{
          background: isDark
            ? "linear-gradient(180deg, rgba(22,24,33,0.98) 0%, rgba(14,16,24,0.98) 100%)"
            : colors.card,
          borderColor: colors.ring,
          color: colors.text,
          boxShadow: "0 28px 90px rgba(0,0,0,0.45)",
        }}
      >
        <div className="border-b p-5 sm:p-6" style={{ borderColor: colors.ring }}>
          <div id={titleId} className="text-lg font-semibold tracking-tight">
            {title}
          </div>
          {resolvedDescription ? (
            <p
              id={messageId}
              className="mt-2 text-sm leading-6"
              style={{ color: colors.text2 }}
            >
              {resolvedDescription}
            </p>
          ) : null}
        </div>
        <div
          className="flex flex-col-reverse gap-3 border-t p-5 sm:flex-row sm:justify-end sm:p-6"
          style={{ borderColor: colors.ring }}
        >
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="rounded-xl border px-4 py-2.5 text-sm font-medium transition-opacity disabled:cursor-not-allowed"
            style={{
              backgroundColor: colors.bg2,
              color: colors.text,
              borderColor: colors.ring,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {resolvedCancelText}
          </button>
          <button
            type="button"
            onClick={loading ? undefined : onConfirm}
            disabled={loading}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity disabled:cursor-not-allowed"
            style={{
              ...confirmStyle,
              opacity: loading ? 0.75 : 1,
            }}
          >
            {loading ? loadingLabel : resolvedConfirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
