/*
 * Custom hook that encapsulates categories state, side effects, and async workflows.
 * Provides a reusable boundary between domain operations and page-level UI orchestration.
 */

import { useEffect, useState } from "react";
import { listCategories, upsertCategory } from "../services/knowledge.service";

export function useCategories() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setLoading(true);
    try {
      const { data } = await listCategories();
      setRows(data);
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
    save: async (c) => {
      await upsertCategory(c);
      await load();
    },
  };
}
