import React, { useEffect, useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import DoctorButton from "../shared/DoctorButton";
import DoctorModal from "../shared/DoctorModal";

const INITIAL_STATE = {
  title: "",
  isActive: true,
};

export default function CreateAdjustmentSetModal({
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
      isActive: form.isActive,
    });

    if (shouldClose !== false) {
      onClose?.();
    }
  };

  return (
    <DoctorModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Adjustment Set"
      subtitle="Create a reusable adjustment set for the selected symptom."
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
            form="create-adjustment-set-form"
            className="flex-1"
            loading={loading}
          >
            Create Set
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
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
            style={{
              backgroundColor: colors.bg2,
              border: `1px solid ${colors.ring}`,
              color: colors.text,
            }}
            placeholder="e.g. Corner Exit Recovery"
            required
          />
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
              setForm((prev) => ({ ...prev, isActive: e.target.checked }))
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