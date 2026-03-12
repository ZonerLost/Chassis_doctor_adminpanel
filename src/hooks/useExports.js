import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { downloadAnalyticsReport } from "../services/analytics.service";

const STORAGE_KEY = "analytics_export_history_v1";

function readHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function useExports() {
  const [history, setHistory] = useState(readHistory);
  const [loading, setLoading] = useState(false);

  const sortedHistory = useMemo(() => {
    return [...history].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [history]);

  const generateReport = async ({ scope, format, payload }) => {
    setLoading(true);

    try {
      const file = downloadAnalyticsReport({
        scope,
        format,
        payload,
      });

      const next = [
        {
          id:
            globalThis.crypto?.randomUUID?.() ||
            `${Date.now()}-${Math.random()}`,
          createdAt: new Date().toISOString(),
          scope,
          format: file.format,
          fileName: file.fileName,
        },
        ...sortedHistory,
      ].slice(0, 12);

      setHistory(next);
      saveHistory(next);
      toast.success("Report exported successfully");
    } catch (error) {
      toast.error(error.message || "Failed to export report");
    } finally {
      setLoading(false);
    }
  };

  return {
    history: sortedHistory,
    loading,
    generateReport,
  };
}