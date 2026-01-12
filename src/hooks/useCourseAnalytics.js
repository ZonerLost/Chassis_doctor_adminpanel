import { useEffect, useState, useCallback } from "react";
import { getCourseStats, listCoursesLookup } from "../services/analytics.service";

export function useCourseAnalytics() {
  const [courseId, setCourseId] = useState("");
  const [rows, setRows] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { rows } = await getCourseStats({
        courseId: courseId || undefined,
      });
      setRows(rows);
    } finally {
      setLoading(false);
    }
  }, [courseId]);
  const loadCourses = async () => setCourses(await listCoursesLookup());
  useEffect(() => {
    load();
  }, [courseId, load]);
  useEffect(() => {
    loadCourses();
  }, []);
  return { courseId, setCourseId, rows, courses, loading, reload: load };
}
