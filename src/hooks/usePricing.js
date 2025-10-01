import { useEffect, useState } from "react";
import { listPricing, updatePricing } from "../Data/courses.service";

export function usePricing() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setLoading(true);
    try {
      setRows(await listPricing());
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  return {
    rows,
    loading,
    reload: load,
    save: async (courseId, patch) => {
      await updatePricing(courseId, patch);
      await load();
    },
  };
}
