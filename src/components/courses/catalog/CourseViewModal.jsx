/*
 * Course View Modal component for courses surfaces within the admin interface.
 * Keeps rendering behavior isolated so higher-level modules can focus on data flow.
 */

import React, { useMemo } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../../../contexts/ThemeContext";
import useBodyScrollLock from "../../../hooks/useBodyScrollLock";

export default function CourseViewModal({ isOpen, onClose, course }) {
  const { colors } = useTheme();

  useBodyScrollLock(isOpen);

  const panelStyle = useMemo(
    () => ({
      backgroundColor: colors.card || colors.bg2,
      color: colors.text,
      border: `1px solid ${colors.ring}`,
      boxShadow: "0 24px 64px rgba(0, 0, 0, 0.38)",
    }),
    [colors.bg2, colors.card, colors.ring, colors.text]
  );

  const scrollAreaStyle = useMemo(
    () => ({
      WebkitOverflowScrolling: "touch",
      overscrollBehavior: "contain",
    }),
    []
  );

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-2 sm:p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Course view"
        className="relative flex h-[min(88vh,720px)] w-full max-w-3xl min-h-0 flex-col overflow-hidden rounded-[24px]"
        style={panelStyle}
      >
        <div
          className="shrink-0 border-b px-4 py-4 sm:px-6"
          style={{ borderColor: colors.ring }}
        >
          <div className="break-words text-lg font-semibold sm:text-xl">
            {course?.title || "Course"}
          </div>
        </div>

        <div
          className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5"
          style={scrollAreaStyle}
        >
          <div style={{ color: colors.text2 }}>{course?.category || "-"}</div>
          <div
            className="mt-3 whitespace-pre-line break-words"
            style={{ color: colors.text }}
          >
            {course?.description || "No description available."}
          </div>
        </div>

        <div
          className="shrink-0 border-t px-4 py-4 text-right sm:px-6"
          style={{ borderColor: colors.ring }}
        >
          <button
            onClick={onClose}
            className="w-full rounded-lg px-4 py-2.5 sm:w-auto"
            style={{ backgroundColor: colors.bg2, color: colors.text }}
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}