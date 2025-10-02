import { useEffect, useState } from "react";
import { listRevisions } from "../data/knowledge.service";

export function useRevisions({ articleId = null } = {}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setLoading(true);
    try {
      setRows(await listRevisions({ articleId }));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [articleId]);
  return { rows, loading, reload: load };
}
