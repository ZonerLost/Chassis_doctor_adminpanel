// Update this import only if your Supabase client file lives somewhere else.
import { supabase } from "../lib/supabaseClient";

export const DASHBOARD_RANGE_OPTIONS = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "12m", label: "Last 12 months" },
  { value: "all", label: "All time" },
];

export const EMPTY_DASHBOARD_OVERVIEW = {
  summary: {
    totalUsers: 0,
    activeUsers: 0,
    newSignups: 0,
    logins: 0,
    enrollments: 0,
    completions: 0,
    publishedCourses: 0,
    activeSymptoms: 0,
    avgRating: 0,
  },
  changes: {
    newSignups: null,
    logins: null,
    enrollments: null,
    completions: null,
  },
  charts: {
    userGrowth: [],
    coursePerformance: [],
  },
  recentUsers: [],
  recentCourses: [],
  recentActivity: [],
  health: [],
  lastUpdatedAt: null,
};

function toDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(input) {
  const date = new Date(input);
  date.setHours(0, 0, 0, 0);
  return date;
}

function endOfDay(input) {
  const date = new Date(input);
  date.setHours(23, 59, 59, 999);
  return date;
}

function startOfMonth(input) {
  const date = new Date(input);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(input, amount) {
  const date = new Date(input);
  date.setDate(date.getDate() + amount);
  return date;
}

function addMonths(input, amount) {
  const date = new Date(input);
  date.setMonth(date.getMonth() + amount);
  return date;
}

function formatDayLabel(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatMonthLabel(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(date);
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function safeCount(response) {
  if (response?.error) {
    throw new Error(response.error.message || "Supabase query failed.");
  }
  return response?.count ?? 0;
}

function safeData(response) {
  if (response?.error) {
    throw new Error(response.error.message || "Supabase query failed.");
  }
  return response?.data ?? [];
}

function calculateAverage(values = []) {
  if (!values.length) return 0;
  const total = values.reduce((sum, value) => sum + Number(value || 0), 0);
  return total / values.length;
}

function calculateChange(current, previous) {
  if (previous == null) return null;
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return Number((((current - previous) / previous) * 100).toFixed(2));
}

function countInWindow(rows, key, start, end) {
  return rows.reduce((count, row) => {
    const date = toDate(row[key]);
    if (!date) return count;
    if (start && date < start) return count;
    if (end && date >= end) return count;
    return count + 1;
  }, 0);
}

function buildBuckets(range) {
  const now = new Date();

  if (range === "7d") {
    const start = startOfDay(addDays(now, -6));
    const buckets = [];
    let cursor = new Date(start);

    while (cursor <= endOfDay(now)) {
      const next = addDays(cursor, 1);
      buckets.push({
        key: cursor.toISOString(),
        label: formatDayLabel(cursor),
        start: new Date(cursor),
        end: next,
      });
      cursor = next;
    }

    return buckets;
  }

  if (range === "30d") {
    const start = startOfDay(addDays(now, -29));
    const buckets = [];
    let cursor = new Date(start);

    while (cursor <= endOfDay(now)) {
      const next = addDays(cursor, 1);
      buckets.push({
        key: cursor.toISOString(),
        label: formatDayLabel(cursor),
        start: new Date(cursor),
        end: next,
      });
      cursor = next;
    }

    return buckets;
  }

  const monthsBack = range === "90d" ? 2 : 11;
  const start = startOfMonth(addMonths(now, -monthsBack));
  const end = startOfMonth(addMonths(now, 1));
  const buckets = [];
  let cursor = new Date(start);

  while (cursor < end) {
    const next = startOfMonth(addMonths(cursor, 1));
    buckets.push({
      key: cursor.toISOString(),
      label: formatMonthLabel(cursor),
      start: new Date(cursor),
      end: next,
    });
    cursor = next;
  }

  return buckets;
}

function resolveRangeMeta(range) {
  const now = new Date();

  if (range === "all") {
    return {
      currentStart: null,
      previousStart: null,
      previousEnd: null,
      metricQueryStart: null,
      chartBuckets: buildBuckets("12m"),
      label: "All time",
    };
  }

  if (range === "7d") {
    const currentStart = startOfDay(addDays(now, -6));
    const previousStart = startOfDay(addDays(currentStart, -7));
    return {
      currentStart,
      previousStart,
      previousEnd: currentStart,
      metricQueryStart: previousStart,
      chartBuckets: buildBuckets("7d"),
      label: "Last 7 days",
    };
  }

  if (range === "30d") {
    const currentStart = startOfDay(addDays(now, -29));
    const previousStart = startOfDay(addDays(currentStart, -30));
    return {
      currentStart,
      previousStart,
      previousEnd: currentStart,
      metricQueryStart: previousStart,
      chartBuckets: buildBuckets("30d"),
      label: "Last 30 days",
    };
  }

  if (range === "90d") {
    const currentStart = startOfDay(addDays(now, -89));
    const previousStart = startOfDay(addDays(currentStart, -90));
    return {
      currentStart,
      previousStart,
      previousEnd: currentStart,
      metricQueryStart: previousStart,
      chartBuckets: buildBuckets("90d"),
      label: "Last 90 days",
    };
  }

  const currentStart = startOfMonth(addMonths(now, -11));
  const previousStart = startOfMonth(addMonths(currentStart, -12));

  return {
    currentStart,
    previousStart,
    previousEnd: currentStart,
    metricQueryStart: previousStart,
    chartBuckets: buildBuckets("12m"),
    label: "Last 12 months",
  };
}

function buildSeriesFromBuckets(rows, key, buckets) {
  return buckets.map((bucket) => ({
    key: bucket.key,
    label: bucket.label,
    value: countInWindow(rows, key, bucket.start, bucket.end),
  }));
}

function mergeActivityItems(items = [], limit = 8) {
  return [...items]
    .filter((item) => item?.at)
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, limit);
}

export async function getDashboardOverview({ range = "30d" } = {}) {
  const rangeMeta = resolveRangeMeta(range);

  let signupsMetricsQuery = supabase.from("users").select("created_at");
  let loginsMetricsQuery = supabase
    .from("users")
    .select("id, full_name, email, avatar_url, last_login_at")
    .not("last_login_at", "is", null);

  let enrollmentsMetricsQuery = supabase
    .from("course_enrollments")
    .select("enrolled_at, completed_at");

  let reviewsMetricsQuery = supabase
    .from("course_reviews")
    .select("id, course_id, user_id, rating, review_text, created_at");

  if (rangeMeta.metricQueryStart) {
    const isoStart = rangeMeta.metricQueryStart.toISOString();

    signupsMetricsQuery = signupsMetricsQuery.gte("created_at", isoStart);
    loginsMetricsQuery = loginsMetricsQuery.gte("last_login_at", isoStart);
    enrollmentsMetricsQuery = enrollmentsMetricsQuery.or(
      `enrolled_at.gte.${isoStart},completed_at.gte.${isoStart}`
    );
    reviewsMetricsQuery = reviewsMetricsQuery.gte("created_at", isoStart);
  }

  const [
    totalUsersResponse,
    activeUsersResponse,
    publishedCoursesResponse,
    activeSymptomsResponse,
    signupsMetricsResponse,
    loginsMetricsResponse,
    enrollmentsMetricsResponse,
    reviewsMetricsResponse,
    recentUsersResponse,
    recentCoursesResponse,
    latestReviewsResponse,
  ] = await Promise.all([
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("courses")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("chassis_symptoms")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    signupsMetricsQuery,
    loginsMetricsQuery,
    enrollmentsMetricsQuery,
    reviewsMetricsQuery,
    supabase
      .from("users")
      .select("id, full_name, email, avatar_url, last_login_at, created_at, status")
      .or("last_login_at.not.is.null,created_at.not.is.null")
      .order("last_login_at", { ascending: false, nullsFirst: false })
      .limit(6),
    supabase
      .from("courses")
      .select(
        "id, title, category, description, level, duration_minutes, thumbnail_url, is_published, created_at"
      )
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("course_reviews")
      .select("id, course_id, user_id, rating, review_text, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const totalUsers = safeCount(totalUsersResponse);
  const activeUsers = safeCount(activeUsersResponse);
  const publishedCourses = safeCount(publishedCoursesResponse);
  const activeSymptoms = safeCount(activeSymptomsResponse);

  const signupsRows = safeData(signupsMetricsResponse);
  const loginsRows = safeData(loginsMetricsResponse);
  const enrollmentsRows = safeData(enrollmentsMetricsResponse);
  const reviewsRows = safeData(reviewsMetricsResponse);
  const recentUsers = safeData(recentUsersResponse);
  const recentCourses = safeData(recentCoursesResponse);
  const latestReviews = safeData(latestReviewsResponse);

  const userIds = [...new Set(latestReviews.map((row) => row.user_id).filter(Boolean))];
  const courseIds = [
    ...new Set(
      [...latestReviews.map((row) => row.course_id), ...recentCourses.map((row) => row.id)].filter(Boolean)
    ),
  ];

  const [reviewUsersResponse, reviewCoursesResponse] = await Promise.all([
    userIds.length
      ? supabase
          .from("users")
          .select("id, full_name, email, avatar_url")
          .in("id", userIds)
      : Promise.resolve({ data: [], error: null }),
    courseIds.length
      ? supabase
          .from("courses")
          .select("id, title, thumbnail_url, category")
          .in("id", courseIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  const reviewUsers = safeData(reviewUsersResponse);
  const reviewCourses = safeData(reviewCoursesResponse);

  const userMap = reviewUsers.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

  const courseMap = reviewCourses.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

  const currentStart = rangeMeta.currentStart;
  const previousStart = rangeMeta.previousStart;
  const previousEnd = rangeMeta.previousEnd;

  const currentNewSignups =
    currentStart == null
      ? totalUsers
      : countInWindow(signupsRows, "created_at", currentStart, null);

  const previousNewSignups =
    previousStart == null
      ? null
      : countInWindow(signupsRows, "created_at", previousStart, previousEnd);

  const currentLogins =
    currentStart == null
      ? loginsRows.length
      : countInWindow(loginsRows, "last_login_at", currentStart, null);

  const previousLogins =
    previousStart == null
      ? null
      : countInWindow(loginsRows, "last_login_at", previousStart, previousEnd);

  const currentEnrollments =
    currentStart == null
      ? enrollmentsRows.length
      : countInWindow(enrollmentsRows, "enrolled_at", currentStart, null);

  const previousEnrollments =
    previousStart == null
      ? null
      : countInWindow(enrollmentsRows, "enrolled_at", previousStart, previousEnd);

  const currentCompletions =
    currentStart == null
      ? enrollmentsRows.filter((row) => row.completed_at).length
      : countInWindow(enrollmentsRows, "completed_at", currentStart, null);

  const previousCompletions =
    previousStart == null
      ? null
      : countInWindow(enrollmentsRows, "completed_at", previousStart, previousEnd);

  const averageRating = Number(calculateAverage(reviewsRows.map((row) => row.rating)).toFixed(1));

  const signupSeries = buildSeriesFromBuckets(signupsRows, "created_at", rangeMeta.chartBuckets);
  const loginSeries = buildSeriesFromBuckets(loginsRows, "last_login_at", rangeMeta.chartBuckets);
  const enrollmentSeries = buildSeriesFromBuckets(
    enrollmentsRows,
    "enrolled_at",
    rangeMeta.chartBuckets
  );
  const completionSeries = buildSeriesFromBuckets(
    enrollmentsRows,
    "completed_at",
    rangeMeta.chartBuckets
  );
  const reviewSeries = buildSeriesFromBuckets(reviewsRows, "created_at", rangeMeta.chartBuckets);

  const charts = {
    userGrowth: rangeMeta.chartBuckets.map((bucket, index) => ({
      key: bucket.key,
      label: bucket.label,
      signups: signupSeries[index]?.value ?? 0,
      logins: loginSeries[index]?.value ?? 0,
    })),
    coursePerformance: rangeMeta.chartBuckets.map((bucket, index) => ({
      key: bucket.key,
      label: bucket.label,
      enrollments: enrollmentSeries[index]?.value ?? 0,
      completions: completionSeries[index]?.value ?? 0,
      reviews: reviewSeries[index]?.value ?? 0,
    })),
  };

  const reviewActivity = latestReviews.map((review) => {
    const reviewUser = userMap[review.user_id];
    const reviewCourse = courseMap[review.course_id];

    return {
      id: `review-${review.id}`,
      type: "review",
      title: `${reviewCourse?.title || "Course"} received ${review.rating}-star feedback`,
      subtitle:
        review.review_text?.trim() ||
        reviewUser?.full_name ||
        reviewUser?.email ||
        "New review submitted",
      at: review.created_at,
      thumbnail: reviewCourse?.thumbnail_url || null,
    };
  });

  const loginActivity = recentUsers
    .filter((user) => user.last_login_at)
    .map((user) => ({
      id: `login-${user.id}`,
      type: "login",
      title: `${user.full_name || user.email || "User"} logged in`,
      subtitle: user.email || "Recent activity",
      at: user.last_login_at,
      thumbnail: user.avatar_url || null,
    }));

  const courseActivity = recentCourses.map((course) => ({
    id: `course-${course.id}`,
    type: "course",
    title: `Published: ${course.title}`,
    subtitle: course.category || "Course library",
    at: course.created_at,
    thumbnail: course.thumbnail_url || null,
  }));

  const signupActivity = recentUsers
    .filter((user) => user.created_at)
    .map((user) => ({
      id: `signup-${user.id}`,
      type: "signup",
      title: `${user.full_name || user.email || "User"} signed up`,
      subtitle: user.email || "New user account",
      at: user.created_at,
      thumbnail: user.avatar_url || null,
    }));

  const recentActivity = mergeActivityItems([
    ...reviewActivity,
    ...loginActivity,
    ...courseActivity,
    ...signupActivity,
  ]);

  const health = [
    {
      key: "users",
      label: "Users",
      status: totalUsers > 0 ? "Healthy" : "No data",
      meta: `${activeUsers} active • ${totalUsers} total`,
    },
    {
      key: "courses",
      label: "Courses",
      status: publishedCourses > 0 ? "Healthy" : "No data",
      meta: `${publishedCourses} published`,
    },
    {
      key: "symptoms",
      label: "Symptoms",
      status: activeSymptoms > 0 ? "Healthy" : "No data",
      meta: `${activeSymptoms} active`,
    },
    {
      key: "reviews",
      label: "Reviews",
      status: reviewsRows.length > 0 ? "Healthy" : "No data",
      meta: `${reviewsRows.length} total • avg ${averageRating || 0}`,
    },
  ];

  return {
    summary: {
      totalUsers,
      activeUsers,
      newSignups: currentNewSignups,
      logins: currentLogins,
      enrollments: currentEnrollments,
      completions: currentCompletions,
      publishedCourses,
      activeSymptoms,
      avgRating: averageRating,
    },
    changes: {
      newSignups: calculateChange(currentNewSignups, previousNewSignups),
      logins: calculateChange(currentLogins, previousLogins),
      enrollments: calculateChange(currentEnrollments, previousEnrollments),
      completions: calculateChange(currentCompletions, previousCompletions),
    },
    charts,
    recentUsers: recentUsers
      .filter((user) => user.last_login_at || user.created_at)
      .sort((a, b) => {
        const dateA = new Date(b.last_login_at || b.created_at).getTime();
        const dateB = new Date(a.last_login_at || a.created_at).getTime();
        return dateA - dateB;
      })
      .slice(0, 6),
    recentCourses: recentCourses.map((course) => ({
      ...course,
      created_label: course.created_at ? formatShortDate(course.created_at) : "—",
    })),
    recentActivity,
    health,
    rangeLabel: rangeMeta.label,
    lastUpdatedAt: new Date().toISOString(),
  };
}