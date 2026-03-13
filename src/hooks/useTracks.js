/*
 * Custom hook that encapsulates tracks state, side effects, and async workflows.
 * Provides a reusable boundary between domain operations and page-level UI orchestration.
 */

import { useEffect, useState } from "react";
import { listTracks, upsertTrack } from "../data/chassis.service";

export function useTracks() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setLoading(true);
    try {
      const { data } = await listTracks();
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
    save: async (t) => {
      await upsertTrack(t);
      await load();
    },
  };
}
