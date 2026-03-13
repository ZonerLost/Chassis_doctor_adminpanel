/*
 * Custom hook that encapsulates engagement state, side effects, and async workflows.
 * Provides a reusable boundary between domain operations and page-level UI orchestration.
 */

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getDefaultDateRange,
  getEngagementAnalytics,
} from "../services/analytics.service";

export function useEngagement() {
  const defaultRange = getDefaultDateRange(14);

  const [from, setFrom] = useState(defaultRange.from);
  const [to, setTo] = useState(defaultRange.to);
  const [kpis, setKpis] = useState([]);
  const [rows, setRows] = useState([]);
  const [exportRows, setExportRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);

      try {
        const result = await getEngagementAnalytics({ from, to });
        if (ignore) return;

        setKpis(result.kpis || []);
        setRows(result.rows || []);
        setExportRows(result.exportRows || []);
      } catch (error) {
        if (!ignore) {
          toast.error(error.message || "Failed to load engagement analytics");
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
  }, [from, to]);

  return {
    from,
    to,
    setFrom,
    setTo,
    kpis,
    rows,
    exportRows,
    loading,
  };
}