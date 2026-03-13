/*
 * Create Recommendation Modal component for chassis doctor surfaces within the admin interface.
 * Keeps rendering behavior isolated so higher-level modules can focus on data flow.
 */

import React, { useEffect, useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import DoctorButton from "../shared/DoctorButton";
import DoctorModal from "../shared/DoctorModal";

const INITIAL_STATE = {
  title: "",
  details: "",
  category: "Other",
};

const INITIAL_ERRORS = {
  title: "",
  details: "",
};

const CATEGORIES = ["Understeer", "Oversteer", "Braking", "Balance", "Other"];

export default function CreateRecommendationModal({
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

    const nextErrors = {
      title: form.title.trim() ? "" : "Recommendation title is required.",
      details: form.details.trim() ? "" : "Recommendation details are required.",
    };

    if (nextErrors.title || nextErrors.details) {
      setErrors(nextErrors);
      return;
    }

    const shouldClose = await onSubmit?.({
      title: form.title.trim(),
      details: form.details.trim(),
      category: form.category,
    });

    if (shouldClose !== false) {
      onClose?.();
    }
  };

  return (
    <DoctorModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Recommendation"
      subtitle="Add a reusable chassis recommendation that can be attached to a set."
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
            form="create-recommendation-form"
            className="flex-1"
            loading={loading}
          >
            Save Recommendation
          </DoctorButton>
        </div>
      }
    >
      <form
        id="create-recommendation-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            style={{ color: colors.text }}
          >
            Title
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
            placeholder="e.g. Increase rear wing by 2 clicks"
            aria-invalid={Boolean(errors.title)}
          />
          {errors.title ? (
            <p className="mt-1.5 text-xs" style={{ color: colors.danger }}>
              {errors.title}
            </p>
          ) : null}
        </div>

        <div>
          <label
            className="mb-1 block text-sm font-medium"
            style={{ color: colors.text }}
          >
            Details
          </label>
          <textarea
            value={form.details}
            onChange={(e) =>
              updateField("details", e.target.value)
            }
            className="h-28 w-full rounded-xl px-3 py-2.5 text-sm outline-none"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${errors.details ? colors.danger : colors.ring}`,
              color: colors.text,
            }}
            placeholder="Explain the recommendation clearly..."
            aria-invalid={Boolean(errors.details)}
          />
          {errors.details ? (
            <p className="mt-1.5 text-xs" style={{ color: colors.danger }}>
              {errors.details}
            </p>
          ) : null}
        </div>

        <div>
          <label
            className="mb-1 block text-sm font-medium"
            style={{ color: colors.text }}
          >
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) =>
              updateField("category", e.target.value)
            }
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
              color: colors.text,
            }}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </form>
    </DoctorModal>
  );
}
