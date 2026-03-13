/*
 * Create Adjustment Set Modal component for chassis doctor surfaces within the admin interface.
 * Keeps rendering behavior isolated so higher-level modules can focus on data flow.
 */

import React, { useEffect, useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import DoctorButton from "../shared/DoctorButton";
import DoctorModal from "../shared/DoctorModal";

const INITIAL_STATE = {
  title: "",
  isActive: true,
};

const INITIAL_ERRORS = {
  title: "",
};

export default function CreateAdjustmentSetModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) {
  const { colors } = useTheme();
  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState(INITIAL_ERRORS);

  useEffect(() => {
    if (!isOpen) return;

    setForm(INITIAL_STATE);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setErrors({
        title: "Set title is required.",
      });
      return;
    }

    const shouldClose = await onSubmit?.({
      title: form.title.trim(),
      isActive: form.isActive,
    });

    if (shouldClose !== false) {
      onClose?.();
    }
  };

  return (
    <DoctorModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Adjustment Set"
      subtitle="Create a reusable adjustment set for the selected symptom."
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
            form="create-adjustment-set-form"
            className="flex-1"
            loading={loading}
          >
            Save Set
          </DoctorButton>
        </div>
      }
    >
      <form
        id="create-adjustment-set-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            style={{ color: colors.text }}
          >
            Set Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) =>
              updateField("title", e.target.value)
            }
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${errors.title ? colors.danger : colors.ring}`,
              color: colors.text,
            }}
            placeholder="e.g. Corner Exit Recovery"
            aria-invalid={Boolean(errors.title)}
          />
          {errors.title ? (
            <p className="mt-1.5 text-xs" style={{ color: colors.danger }}>
              {errors.title}
            </p>
          ) : null}
        </div>

        <label
          className="flex items-center gap-3 rounded-xl px-3 py-3"
          style={{
            backgroundColor: colors.bg2,
            border: `1px solid ${colors.ring}`,
          }}
        >
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              updateField("isActive", e.target.checked)
            }
          />
          <span className="text-sm" style={{ color: colors.text }}>
            Mark this set as active
          </span>
        </label>
      </form>
    </DoctorModal>
  );
}
