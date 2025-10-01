import { useEffect, useState } from "react";
import { listTopics, upsertTopic } from "../Data/courses.service";

export function useTopics({ courseId }) {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setLoading(true);
    try {
      const { data } = await listTopics({ courseId, query });
      setRows(data);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [courseId, query]);
  return {
    query,
    setQuery,
    rows,
    loading,
    reload: load,
    save: async (t) => {
      await upsertTopic({ ...t, courseId });
      await load();
    },
  };
}
