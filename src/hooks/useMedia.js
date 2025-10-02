import { useEffect, useState, useCallback } from "react";
import { listMedia, upsertMedia } from "../data/courses.service";

export function useMedia({ courseId }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await listMedia({ courseId, type, query });
      setRows(data);
    } finally {
      setLoading(false);
    }
  }, [courseId, type, query]);

  useEffect(() => {
    load();
  }, [load]);
  return {
    query,
    setQuery,
    type,
    setType,
    rows,
    loading,
    reload: load,
    save: async (m) => {
      await upsertMedia({ ...m, courseId });
      await load();
    },
  };
}
