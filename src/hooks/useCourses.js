import { useEffect, useRef, useState, useCallback } from "react";
import { listCourses, upsertCourse } from "../Data/courses.service";

function shallowEqual(a, b) {
  if (a === b) return true;
  const ka = Object.keys(a || {});
  const kb = Object.keys(b || {});
  if (ka.length !== kb.length) return false;
  for (let k of ka) {
    if (a[k] !== b[k]) return false;
  }
  return true;
}

export function useCourses(initial = {}) {
  const mounted = useRef(false);
  const fetchId = useRef(0);
  const [state, setState] = useState({
    page: initial.page || 1,
    pageSize: initial.pageSize || 10,
    query: initial.query || "",
    level: initial.level || "all",
    access: initial.access || "all",
  });

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      // invalidate pending fetches
      const currentFetchId = fetchId.current;
      fetchId.current = currentFetchId + 1;
    };
  }, []);

  const load = useCallback(
    async (patch = {}) => {
      // Merge current state with patch (use stateRef to avoid stale closure)
      const next = { ...stateRef.current, ...patch };

      // If nothing changed, avoid unnecessary setState but still fetch once (keeps UI in sync)
      const willSetState = !shallowEqual(next, stateRef.current);

      // bump fetch id for this request
      const id = ++fetchId.current;

      if (willSetState && mounted.current) {
        // set state only if different to avoid spurious renders
        setState((prev) => (shallowEqual(prev, next) ? prev : next));
      }

      setLoading(true);
      setError(null);
      try {
        const res = await listCourses(next);
        if (!mounted.current || fetchId.current !== id) return; // stale -> ignore

        // Normalize response shape { data, total } expected from your service
        const data = res?.data ?? res?.items ?? [];
        const totalCount =
          typeof res?.total === "number" ? res.total : data.length;

        setRows(data);
        setTotal(totalCount);
      } catch (err) {
        console.error("useCourses load error:", err);
        if (mounted.current && fetchId.current === id) setError(err);
      } finally {
        if (mounted.current && fetchId.current === id) setLoading(false);
      }
    },
    [] // stable
  );

  // initial load once
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const search = (q) => load({ page: 1, query: q });
  const setPage = (p) => load({ page: p });
  const setLevel = (v) => load({ page: 1, level: v });
  const setAccess = (v) => load({ page: 1, access: v });
  const setPageSize = (pageSize) => load({ page: 1, pageSize });

  const save = async (course) => {
    await upsertCourse(course);
    // refresh current view after save
    await load();
  };

  return {
    state,
    rows,
    total,
    loading,
    error,
    setState,
    search,
    setPage,
    setLevel,
    setAccess,
    setPageSize,
    save,
    refresh: load,
  };
}

export const useCoursesV2 = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCourses([
        {
          id: 1,
          title: "Introduction to Formula 1",
          level: "beginner",
          isPaid: false,
          priceCents: 0,
          summary: "Learn the basics of Formula 1 racing and history",
        },
        {
          id: 2,
          title: "Advanced Chassis Setup",
          level: "advanced",
          isPaid: true,
          priceCents: 9999,
          summary: "Master the art of chassis tuning and optimization",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const addToCatalog = (course) => {
    setCourses((prev) => [...prev, { ...course, id: Date.now() }]);
  };

  const removeFromCatalog = (courseId) => {
    setCourses((prev) => prev.filter((course) => course.id !== courseId));
  };

  const updateCourse = (courseId, updates) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId ? { ...course, ...updates } : course
      )
    );
  };

  return {
    courses,
    loading,
    fetchCatalog,
    addToCatalog,
    removeFromCatalog,
    updateCourse,
  };
};
