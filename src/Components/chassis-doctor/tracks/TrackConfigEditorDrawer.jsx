import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../../../contexts/ThemeContext";
import { MdClose } from "react-icons/md";

export default function TrackConfigEditorDrawer({
  isOpen,
  onClose,
  config = null,
  onSave,
}) {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    trackName: "",
    category: "Street Circuit",
    frontWing: 5,
    rearWing: 5,
    suspension: "Medium",
    brakeBalance: 55,
    differential: "Open",
    notes: "",
  });

  useEffect(() => {
    if (config) {
      setFormData({
        trackName: config.trackName || "",
        category: config.category || "Street Circuit",
        frontWing: config.frontWing || 5,
        rearWing: config.rearWing || 5,
        suspension: config.suspension || "Medium",
        brakeBalance: config.brakeBalance || 55,
        differential: config.differential || "Open",
        notes: config.notes || "",
      });
    } else {
      setFormData({
        trackName: "",
        category: "Street Circuit",
        frontWing: 5,
        rearWing: 5,
        suspension: "Medium",
        brakeBalance: 55,
        differential: "Open",
        notes: "",
      });
    }
  }, [config, isOpen]);

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
            {config ? "Edit Track Config" : "Add Track Config"}
          </h2>
          <button onClick={onClose}>
            <MdClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Track Name</label>
            <input
              type="text"
              value={formData.trackName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, trackName: e.target.value }))
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Front Wing
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.frontWing}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    frontWing: Number(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 rounded border"
                style={{
                  backgroundColor: colors.bg2,
                  borderColor: colors.ring,
                  color: colors.text,
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Rear Wing
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.rearWing}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rearWing: Number(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 rounded border"
                style={{
                  backgroundColor: colors.bg2,
                  borderColor: colors.ring,
                  color: colors.text,
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              className="w-full px-3 py-2 rounded border h-20"
              style={{
                backgroundColor: colors.bg2,
                borderColor: colors.ring,
                color: colors.text,
              }}
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
