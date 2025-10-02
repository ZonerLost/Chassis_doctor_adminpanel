import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../../../contexts/ThemeContext";
import { MdClose } from "react-icons/md";

export default function MappingRuleEditorDrawer({
  isOpen,
  onClose,
  mapping = null,
  onSave,
}) {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    condition: "",
    action: "",
    priority: "Medium",
    isActive: true,
  });

  useEffect(() => {
    if (mapping) {
      setFormData({
        name: mapping.name || "",
        condition: mapping.condition || "",
        action: mapping.action || "",
        priority: mapping.priority || "Medium",
        isActive: mapping.isActive ?? true,
      });
    } else {
      setFormData({
        name: "",
        condition: "",
        action: "",
        priority: "Medium",
        isActive: true,
      });
    }
  }, [mapping, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative bg-white rounded-lg p-6 w-full max-w-md mx-4"
        style={{ backgroundColor: colors.card, color: colors.text }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {mapping ? "Edit Mapping Rule" : "Add Mapping Rule"}
          </h2>
          <button onClick={onClose}>
            <MdClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 rounded border"
              style={{
                backgroundColor: colors.bg2,
                borderColor: colors.ring,
                color: colors.text,
              }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Condition</label>
            <textarea
              value={formData.condition}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  condition: e.target.value,
                }))
              }
              className="w-full px-3 py-2 rounded border h-20"
              style={{
                backgroundColor: colors.bg2,
                borderColor: colors.ring,
                color: colors.text,
              }}
              placeholder="e.g., symptom = 'Oversteer' AND severity > 'Medium'"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Action</label>
            <input
              type="text"
              value={formData.action}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, action: e.target.value }))
              }
              className="w-full px-3 py-2 rounded border"
              style={{
                backgroundColor: colors.bg2,
                borderColor: colors.ring,
                color: colors.text,
              }}
              placeholder="e.g., Increase rear wing by 2 clicks"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded border"
              style={{
                borderColor: colors.ring,
                color: colors.text2,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded"
              style={{
                backgroundColor: colors.accent,
                color: "#000",
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
