import { useEffect, useState } from "react";
import { listArticles, upsertArticle } from "../Data/knowledge.service";

export function useArticles() {
  const [state, setState] = useState({
    page: 1,
    pageSize: 10,
    query: "",
    categoryId: "all",
    status: "all",
    tag: "",
  });
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = async (patch = {}) => {
    const next = { ...state, ...patch };
    setState(next);
    setLoading(true);
    try {
      const { data, total } = await listArticles(next);
      setRows(data);
      setTotal(total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return {
    state,
    rows,
    total,
    loading,
    search: (q) => load({ page: 1, query: q }),
    setPage: (p) => load({ page: p }),
    setCategory: (id) => load({ page: 1, categoryId: id }),
    setStatus: (s) => load({ page: 1, status: s }),
    setTag: (t) => load({ page: 1, tag: t }),
    save: async (a, meta) => {
      await upsertArticle(a, meta);
      await load();
    },
  };
}
