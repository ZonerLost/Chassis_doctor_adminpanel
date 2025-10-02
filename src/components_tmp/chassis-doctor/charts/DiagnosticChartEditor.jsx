import React, { useMemo, useState } from "react";
import { COLORS } from "../../ui/shared/theme.js";
// A very simple JSON view of current rules for export/publish
export default function DiagnosticChartEditor({ rules, onPublish }) {
  const [text, setText] = useState("");
  useMemo(() => {
    try {
      setText(JSON.stringify(rules, null, 2));
    } catch {
      setText("[]");
    }
  }, [rules]);

  return (
    <div>
      <textarea
        className="w-full rounded-xl border p-3 text-xs"
        rows={12}
        style={{
          borderColor: COLORS.ring,
          backgroundColor: COLORS.hover,
          color: COLORS.text,
        }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          className="px-4 py-2 rounded-xl border"
          style={{
            borderColor: COLORS.ring,
            backgroundColor: COLORS.hover,
            color: COLORS.text2,
          }}
          onClick={() => setText(JSON.stringify(rules, null, 2))}
        >
          Reset
        </button>
        <button
          className="px-4 py-2 rounded-xl border"
          style={{
            borderColor: "#D4AF37",
            backgroundColor: "#D4AF3726",
            color: "#D4AF37",
          }}
          onClick={() => onPublish?.(text)}
        >
          Publish
        </button>
      </div>
    </div>
  );
}
