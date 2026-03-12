import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCourseAnalytics } from "../services/analytics.service";

export function useCourseAnalytics() {
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState([]);
  const [exportRows, setExportRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);

      try {
        const result = await getCourseAnalytics();
        if (ignore) return;

        setRows(result.rows || []);
        setSummary(result.summary || []);
        setExportRows(result.exportRows || []);
      } catch (error) {
        if (!ignore) {
          toast.error(error.message || "Failed to load course analytics");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  return {
    rows,
    summary,
    exportRows,
    loading,
  };
}