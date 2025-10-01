import { useEffect, useState } from "react";
import { listSymptoms, upsertSymptom } from "../data/chassis.service";

export function useSymptoms() {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await listSymptoms({ query });
      setRows(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [query]);

  return {
    query,
    setQuery,
    rows,
    loading,
    reload: load,
    save: async (sym) => {
      await upsertSymptom(sym);
      await load();
    },
  };
}
