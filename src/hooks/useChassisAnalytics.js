import { useEffect, useState } from "react";
import { getChassisStats } from "../Data/analytics.service";

export function useChassisAnalytics() {
  const [symptoms, setSymptoms] = useState([]);
  const [fixes, setFixes] = useState([]);
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setLoading(true);
    try {
      const { symptoms, fixes } = await getChassisStats();
      setSymptoms(symptoms);
      setFixes(fixes);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  return { symptoms, fixes, loading, reload: load };
}
