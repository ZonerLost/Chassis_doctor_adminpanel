import { useEffect, useState } from "react";
import {
  listRules,
  upsertRule,
  listCauses,
  listFixes,
  evaluateDiagnostic,
} from "../Data/chassis.service"; // Fixed: capital D in Data

export function useMappings({ symptomId, trackTypeId }) {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [causes, setCauses] = useState([]);
  const [fixes, setFixes] = useState([]);
  const [results, setResults] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: r }, { data: c }, { data: f }] = await Promise.all([
        listRules({ symptomId, trackTypeId }),
        listCauses(),
        listFixes(),
      ]);
      setRules(r);
      setCauses(c);
      setFixes(f);
    } finally {
      setLoading(false);
    }
  };

  const simulate = async () => {
    if (!symptomId) return setResults([]);
    const out = await evaluateDiagnostic({ symptomId, trackTypeId });
    setResults(out);
  };

  useEffect(() => {
    load();
  }, [symptomId, trackTypeId]);
  useEffect(() => {
    simulate();
  }, [rules, symptomId, trackTypeId]);

  return {
    rules,
    loading,
    causes,
    fixes,
    results,
    saveRule: async (r) => {
      await upsertRule(r);
      await load();
    },
  };
}
