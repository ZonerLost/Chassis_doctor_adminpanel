import React, { useEffect, useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import DoctorButton from "../shared/DoctorButton";
import DoctorModal from "../shared/DoctorModal";

const INITIAL_STATE = {
  title: "",
  details: "",
  category: "Other",
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

  useEffect(() => {
    if (isOpen) {
      setForm(INITIAL_STATE);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const shouldClose = await onSubmit?.({
      title: form.title,
      details: form.details,
      category: form.category,
    });

    if (shouldClose !== false) {
      onClose?.();
    }
  };

  return (
    <DoctorModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Recommendation"
      subtitle="Add a reusable chassis recommendation that can be attached to a set."
      footer={
        <div className="flex gap-2">
          <DoctorButton
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </DoctorButton>
          <DoctorButton
            type="submit"
            form="create-recommendation-form"
            className="flex-1"
            loading={loading}
          >
            Create Recommendation
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
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
              color: colors.text,
            }}
            placeholder="e.g. Increase rear wing by 2 clicks"
            required
          />
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
              setForm((prev) => ({ ...prev, details: e.target.value }))
            }
            className="h-28 w-full rounded-xl px-3 py-2.5 text-sm outline-none"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
              color: colors.text,
            }}
            placeholder="Explain the recommendation clearly..."
            required
          />
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
              setForm((prev) => ({ ...prev, category: e.target.value }))
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