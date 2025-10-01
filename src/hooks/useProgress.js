import { useEffect, useState } from "react";
import { listProgress } from "../Data/courses.service";

export function useProgress() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setLoading(true);
    try {
      setRows(await listProgress());
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  return { rows, loading, reload: load };
}
