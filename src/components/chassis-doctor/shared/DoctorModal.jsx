import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { MdClose } from "react-icons/md";
import { useTheme } from "../../../contexts/ThemeContext";

export default function DoctorModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = "max-w-lg",
}) {
  const { colors } = useTheme();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative w-full ${maxWidth} overflow-hidden rounded-2xl shadow-2xl`}
        style={{
          backgroundColor: colors.card || colors.bg2,
          border: `1px solid ${colors.ring}`,
          color: colors.text,
        }}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="flex items-start justify-between gap-3 px-5 py-4"
          style={{ borderBottom: `1px solid ${colors.ring}` }}
        >
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {subtitle ? (
              <p className="mt-1 text-sm" style={{ color: colors.text2 }}>
                {subtitle}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2"
            style={{ color: colors.text2 }}
            aria-label="Close modal"
          >
            <MdClose size={20} />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-5 py-5">{children}</div>

        {footer ? (
          <div
            className="px-5 pb-5 pt-1"
            style={{ borderTop: `1px solid ${colors.ring}` }}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body
  );
}