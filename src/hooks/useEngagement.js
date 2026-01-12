import { useEffect, useState, useCallback } from "react";
import { getEngagement } from "../services/analytics.service";

export function useEngagement() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rows, setRows] = useState([]);
  const [kpis, setKpis] = useState({});
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { rows, kpis } = await getEngagement({ from, to });
      setRows(rows);
      setKpis(kpis);
    } finally {
      setLoading(false);
    }
  }, [from, to]);
  useEffect(() => {
    load();
  }, [from, to, load]);
  return { from, to, setFrom, setTo, rows, kpis, loading, reload: load };
}
