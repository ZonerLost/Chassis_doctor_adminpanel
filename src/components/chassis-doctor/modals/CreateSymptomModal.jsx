import React, { useEffect, useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import DoctorButton from "../shared/DoctorButton";
import DoctorModal from "../shared/DoctorModal";

const INITIAL_FORM = {
  title: "",
  description: "",
  isActive: true,
};

const INITIAL_ERRORS = {
  title: "",
  description: "",
};

function validateForm(values) {
  const nextErrors = {
    title: values.title.trim() ? "" : "Symptom name is required.",
    description: values.description.trim()
      ? ""
      : "Description is required.",
  };

  return {
    isValid: !nextErrors.title && !nextErrors.description,
    errors: nextErrors,
  };
}

export default function CreateSymptomModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) {
  const { colors } = useTheme();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);

  useEffect(() => {
    if (!isOpen) return;

    setForm(INITIAL_FORM);
    setErrors(INITIAL_ERRORS);
  }, [isOpen]);

  const handleClose = () => {
    if (loading) return;
    onClose?.();
  };

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = validateForm(form);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    const shouldClose = await onSubmit?.({
      title: form.title.trim(),
      description: form.description.trim(),
      isActive: form.isActive,
    });

    if (shouldClose !== false) {
      onClose?.();
    }
  };

  const inputStyle = {
    backgroundColor: colors.bg2,
    border: `1px solid ${colors.ring}`,
    color: colors.text,
  };

  const errorTextStyle = {
    color: colors.danger,
  };

  return (
    <DoctorModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Symptom"
      subtitle="Add a new chassis symptom for adjustment workflows."
      footer={
        <div className="flex gap-2">
          <DoctorButton
            variant="secondary"
            className="flex-1"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </DoctorButton>
          <DoctorButton
            type="submit"
            form="create-symptom-form"
            className="flex-1"
            loading={loading}
          >
            Save Symptom
          </DoctorButton>
        </div>
      }
    >
      <form id="create-symptom-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="mb-1.5 block text-sm font-medium"
            style={{ color: colors.text }}
          >
            Symptom Name
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
            style={{
              ...inputStyle,
              borderColor: errors.title ? colors.danger : colors.ring,
            }}
            placeholder="e.g. Mid-corner understeer"
            aria-invalid={Boolean(errors.title)}
          />
          {errors.title ? (
            <p className="mt-1.5 text-xs" style={errorTextStyle}>
              {errors.title}
            </p>
          ) : null}
        </div>

        <div>
          <label
            className="mb-1.5 block text-sm font-medium"
            style={{ color: colors.text }}
          >
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            className="h-32 w-full rounded-xl px-3 py-2.5 text-sm outline-none"
            style={{
              ...inputStyle,
              borderColor: errors.description ? colors.danger : colors.ring,
            }}
            placeholder="Describe the symptom so the adjustment workflow is clear to admins."
            aria-invalid={Boolean(errors.description)}
          />
          {errors.description ? (
            <p className="mt-1.5 text-xs" style={errorTextStyle}>
              {errors.description}
            </p>
          ) : null}
        </div>

        <label
          className="flex items-center gap-3 rounded-xl px-3 py-3"
          style={inputStyle}
        >
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) => updateField("isActive", event.target.checked)}
          />
          <div>
            <div className="text-sm font-medium" style={{ color: colors.text }}>
              Active symptom
            </div>
            <div className="text-xs" style={{ color: colors.text2 }}>
              Inactive symptoms are saved but will not appear in the active dropdown.
            </div>
          </div>
        </label>
      </form>
    </DoctorModal>
  );
}
