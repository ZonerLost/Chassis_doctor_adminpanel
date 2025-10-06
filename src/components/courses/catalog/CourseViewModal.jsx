import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function CourseViewModal({ isOpen, onClose, course }) {
  const { colors } = useTheme();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative w-full max-w-full sm:max-w-2xl rounded-xl shadow-2xl overflow-auto"
        style={{
          backgroundColor: colors.card || colors.bg2,
          color: colors.text,
        }}
      >
        <div className="p-4 border-b" style={{ borderColor: colors.ring }}>
          <div className="font-semibold">{course?.title}</div>
        </div>

        <div className="p-4">
          <div style={{ color: colors.text2 }}>{course?.category}</div>
          <div className="mt-3" style={{ color: colors.text }}>
            {course?.description}
          </div>
        </div>

        <div
          className="p-4 border-t text-right"
          style={{ borderColor: colors.ring }}
        >
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg"
            style={{ backgroundColor: colors.bg2, color: colors.text }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
