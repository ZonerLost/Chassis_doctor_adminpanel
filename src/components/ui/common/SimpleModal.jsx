import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { MdClose } from "react-icons/md";

export default function SimpleModal({ 
  open, 
  onClose, 
  title, 
  subtitle,
  children,
  onSave,
  onDelete,
  saveText = "Save",
  deleteText = "Delete",
  showSave = true,
  showDelete = false 
}) {
  const { colors } = useTheme();

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-2xl shadow-2xl w-full max-w-md"
        style={{ backgroundColor: colors.card }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: colors.text }}>
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm mt-1" style={{ color: colors.text2 }}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-opacity-20 transition-colors"
            style={{ color: colors.text2 }}
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {children}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 pt-0">
          {showDelete && (
            <button
              onClick={onDelete}
              className="px-6 py-2.5 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
              style={{
                backgroundColor: "#EF4444",
                color: "#FFFFFF",
              }}
            >
              {deleteText}
            </button>
          )}
          
          {showSave && (
            <button
              onClick={onSave}
              className="px-6 py-2.5 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
              style={{
                backgroundColor: colors.accent,
                color: "#000000",
              }}
            >
              {saveText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}