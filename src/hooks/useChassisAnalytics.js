/*
 * Custom hook that encapsulates chassis analytics state, side effects, and async workflows.
 * Provides a reusable boundary between domain operations and page-level UI orchestration.
 */

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getChassisAnalytics } from "../services/analytics.service";

export function useChassisAnalytics() {
  const [symptoms, setSymptoms] = useState([]);
  const [fixes, setFixes] = useState([]);
  const [summary, setSummary] = useState([]);
  const [exportRows, setExportRows] = useState({
    symptoms: [],
    fixes: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);

      try {
        const result = await getChassisAnalytics();
        if (ignore) return;

        setSymptoms(result.symptoms || []);
        setFixes(result.fixes || []);
        setSummary(result.summary || []);
        setExportRows(
          result.exportRows || {
            symptoms: [],
            fixes: [],
          }
        );
      } catch (error) {
        if (!ignore) {
          toast.error(error.message || "Failed to load chassis analytics");
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
    symptoms,
    fixes,
    summary,
    exportRows,
    loading,
  };
}