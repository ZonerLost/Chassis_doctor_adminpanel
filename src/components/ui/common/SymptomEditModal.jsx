import React, { useState, useEffect } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import SimpleModal from "./SimpleModal";

export default function SymptomEditModal({
  open,
  onClose,
  onSave,
  onDelete,
  symptom = null,
}) {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    severity: "Medium",
    frequency: "",
    description: "",
  });

  useEffect(() => {
    if (symptom) {
      setFormData({
        name: symptom.name || "",
        category: symptom.category || "",
        severity: symptom.severity || "Medium",
        frequency: symptom.frequency || "",
        description: symptom.description || "",
      });
    } else {
      setFormData({
        name: "",
        category: "",
        severity: "Medium",
        frequency: "",
        description: "",
      });
    }
  }, [symptom, open]);

  const handleSave = () => {
    onSave(formData);
  };

  const handleDelete = () => {
    if (
      symptom &&
      window.confirm("Are you sure you want to delete this symptom?")
    ) {
      onDelete(symptom);
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title="Edit Symptom"
      subtitle="Diagnostic symptom details"
      onSave={handleSave}
      onDelete={handleDelete}
      showSave={true}
      showDelete={!!symptom}
      saveText="Save"
      deleteText="Delete"
    >
      <div className="space-y-4">
        {/* Name Field */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: colors.text }}
          >
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter symptom name"
            className="w-full px-3 py-2.5 rounded-lg border text-sm"
            style={{
              borderColor: colors.ring,
              backgroundColor: colors.hover,
              color: colors.text,
            }}
          />
        </div>

        {/* Category Field */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: colors.text }}
          >
            Category
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            placeholder="Enter category"
            className="w-full px-3 py-2.5 rounded-lg border text-sm"
            style={{
              borderColor: colors.ring,
              backgroundColor: colors.hover,
              color: colors.text,
            }}
          />
        </div>

        {/* Severity and Frequency Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.text }}
            >
              Severity
            </label>
            <select
              value={formData.severity}
              onChange={(e) =>
                setFormData({ ...formData, severity: e.target.value })
              }
              className="w-full px-3 py-2.5 rounded-lg border text-sm"
              style={{
                borderColor: colors.ring,
                backgroundColor: colors.hover,
                color: colors.text,
              }}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.text }}
            >
              Frequency (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.frequency}
              onChange={(e) =>
                setFormData({ ...formData, frequency: e.target.value })
              }
              placeholder="0-100"
              className="w-full px-3 py-2.5 rounded-lg border text-sm"
              style={{
                borderColor: colors.ring,
                backgroundColor: colors.hover,
                color: colors.text,
              }}
            />
          </div>
        </div>

        {/* Description Field */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: colors.text }}
          >
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter symptom description"
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border text-sm resize-none"
            style={{
              borderColor: colors.ring,
              backgroundColor: colors.hover,
              color: colors.text,
            }}
          />
        </div>
      </div>
    </SimpleModal>
  );
}

/* Usage Example:
<SymptomEditModal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  onSave={(data) => console.log("Save:", data)}
  onDelete={(symptom) => console.log("Delete:", symptom)}
  symptom={selectedSymptom} // null for new, object for edit
/>
*/
