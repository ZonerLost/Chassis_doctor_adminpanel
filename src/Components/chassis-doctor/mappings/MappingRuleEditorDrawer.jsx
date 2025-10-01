import React, { useEffect, useState } from "react";
import { COLORS } from "../../ui/shared/theme";

export default function MappingRuleEditorDrawer({
  open,
  onClose,
  onSave,
  rule,
  causes,
  fixes,
  selectedSymptom,
  selectedTrack,
}) {
  const [form, setForm] = useState(
    rule || { causeId: causes?.[0]?.id, fixId: fixes?.[0]?.id, weight: 1 }
  );
  useEffect(
    () =>
      setForm(
        rule || { causeId: causes?.[0]?.id, fixId: fixes?.[0]?.id, weight: 1 }
      ),
    [rule, causes, fixes]
  );
  if (!open) return null;
  const patch = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60" onClick={onClose} />
      <div
        className="w-full max-w-md h-full p-5 overflow-y-auto"
        style={{ backgroundColor: COLORS.bg2, color: COLORS.text }}
      >
        <h3 className="text-lg font-semibold mb-1">
          {form?.id ? "Edit" : "Add"} Mapping Rule
        </h3>
        <p className="text-xs mb-3" style={{ color: COLORS.text2 }}>
          Symptom: <b>{selectedSymptom?.name || "—"}</b> • Track:{" "}
          <b>
            {selectedTrack
              ? `${selectedTrack.type}/${selectedTrack.surface}/${selectedTrack.condition}`
              : "Any"}
          </b>
        </p>
        <div className="space-y-3 mt-2">
          <label className="block text-sm">
            <span
              className="block text-xs mb-1"
              style={{ color: COLORS.text2 }}
            >
              Cause
            </span>
            <select
              className="w-full rounded-xl border px-3 py-2"
              style={{
                borderColor: COLORS.ring,
                backgroundColor: COLORS.hover,
                color: COLORS.text,
              }}
              value={form.causeId}
              onChange={(e) => patch("causeId", e.target.value)}
            >
              {causes?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span
              className="block text-xs mb-1"
              style={{ color: COLORS.text2 }}
            >
              Fix
            </span>
            <select
              className="w-full rounded-xl border px-3 py-2"
              style={{
                borderColor: COLORS.ring,
                backgroundColor: COLORS.hover,
                color: COLORS.text,
              }}
              value={form.fixId}
              onChange={(e) => patch("fixId", e.target.value)}
            >
              {fixes?.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span
              className="block text-xs mb-1"
              style={{ color: COLORS.text2 }}
            >
              Weight
            </span>
            <input
              type="number"
              min={1}
              max={5}
              className="w-full rounded-xl border px-3 py-2"
              style={{
                borderColor: COLORS.ring,
                backgroundColor: COLORS.hover,
                color: COLORS.text,
              }}
              value={form.weight}
              onChange={(e) => patch("weight", Number(e.target.value || 1))}
            />
          </label>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            className="px-4 py-2 rounded-xl border"
            style={{
              borderColor: COLORS.ring,
              backgroundColor: COLORS.hover,
              color: COLORS.text2,
            }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-xl border"
            style={{
              borderColor: "#D4AF37",
              backgroundColor: "#D4AF3726",
              color: "#D4AF37",
            }}
            onClick={() => onSave(form)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
