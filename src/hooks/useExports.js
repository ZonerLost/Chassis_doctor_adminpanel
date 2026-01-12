import { useEffect, useState } from "react";
import {
  exportCSV,
  listSchedules,
  scheduleReport,
} from "../services/analytics.service";

export function useExports() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setLoading(true);
    try {
      setSchedules(await listSchedules());
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const generateCSV = async (type, filters = {}) => {
    const csv = await exportCSV({ type, filters });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const schedule = async ({ type, cadence, email }) => {
    await scheduleReport({ type, cadence, email });
    await load();
  };

  return { schedules, loading, reload: load, generateCSV, schedule };
}
