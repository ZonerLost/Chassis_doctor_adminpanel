import { useEffect, useRef, useState, useCallback } from "react";
import {
  listCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../services/courses.service";
import { listRevisions } from "../services/knowledge.service";

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

  // inside useCourses.js

  const load = useCallback(async (patch = {}) => {
    const next = { ...stateRef.current, ...patch };

    const willSetState = !shallowEqual(next, stateRef.current);

    const id = ++fetchId.current;

    if (willSetState && mounted.current) {
      setState((prev) => (shallowEqual(prev, next) ? prev : next));
    }

    setLoading(true);
    setError(null);
    try {
      const res = await listCourses(next);
      if (!mounted.current || fetchId.current !== id) return;

      const data = res?.data ?? res?.rows ?? res?.items ?? [];
      const totalCount =
        typeof res?.total === "number" ? res.total : data.length;

      setRows(Array.isArray(data) ? data : []);
      setTotal(totalCount);
    } catch (err) {
      console.error("useCourses load error:", err);
      if (mounted.current && fetchId.current === id) setError(err);
    } finally {
      if (mounted.current && fetchId.current === id) setLoading(false);
    }
  }, []);

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
    const res = course.id
      ? await updateCourse(course.id, course)
      : await createCourse(course);
    const saved = res?.data ?? res?.item ?? res ?? course;

    // optimistic update of hook rows
    setRows((prev) => {
      const exists = prev.some((r) => String(r.id) === String(saved.id));
      if (exists)
        return prev.map((r) => (String(r.id) === String(saved.id) ? saved : r));
      return [saved, ...prev];
    });

    // background reload if you have load()
    load && load();

    return saved;
  };

  return {
    state,
    rows,
    // compatibility aliases for components expecting other key names
    courses: rows,
    items: rows,
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

export const useCoursesV3 = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({}); // Add filters state

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, success, error: apiError } = await listCourses(filters);
      if (success) {
        setRows(data);
      } else {
        setError(apiError);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]); // Only depend on load, which itself depends on filters

  const save = async (courseData) => {
    try {
      setLoading(true);
      let result;

      if (courseData.id) {
        result = await updateCourse(courseData.id, courseData);
      } else {
        result = await createCourse(courseData);
      }

      if (result.success) {
        await load(); // Reload the list
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    try {
      setLoading(true);
      const result = await deleteCourse(id);

      if (result.success) {
        await load(); // Reload the list
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    rows,
    loading,
    error,
    reload: load,
    save,
    remove,
    filters,
    setFilters, // Expose filters and setter
  };
};

export function useRevisions({ articleId = null } = {}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listRevisions({ articleId });
      // normalize response (support { data }, { rows }, or direct array)
      const data = res?.data ?? res?.rows ?? res ?? [];
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("useRevisions load error:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [articleId]);
  useEffect(() => {
    load();
  }, [load]);
  return { rows, loading, reload: load };
}
