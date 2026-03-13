/*
 * Service layer for dashboard data access, shaping, and error translation.
 * Centralizes API interaction details so UI components remain focused on presentation logic.
 */

import { supabase } from "../lib/supabaseClient";

const FALLBACK_LABEL = "\u2014";

/*
 * Supported dashboard ranges and the metadata required to compute
 * current and previous comparison windows.
 */
const RANGE_DEFINITIONS = {
  "7d": {
    label: "Last 7 days",
    unit: "day",
    currentDays: 7,
    previousDays: 7,
  },
  "30d": {
    label: "Last 30 days",
    unit: "day",
    currentDays: 30,
    previousDays: 30,
  },
  "90d": {
    label: "Last 90 days",
    unit: "month",
    currentDays: 90,
    previousDays: 90,
  },
  "12m": {
    label: "Last 12 months",
    unit: "month",
    currentMonths: 12,
    previousMonths: 12,
  },
  all: {
    label: "All time",
    unit: "month",
  },
};

const TABLE_COLUMNS = {
  users:
    "id, created_at, email, full_name, role, status, purchased_courses, chassis_uses, last_login_at, avatar_url, phone",
  courses:
    "id, title, category, description, level, duration_minutes, thumbnail_url, is_published, created_at",
  symptoms: "id, title, description, created_by, is_active, created_at",
  enrollments: "id, user_id, course_id, enrolled_at, completed_at",
  reviews: "id, course_id, user_id, rating, review_text, created_at",
};

const dayFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export const DASHBOARD_RANGE_OPTIONS = Object.entries(RANGE_DEFINITIONS).map(
  ([value, config]) => ({
    value,
    label: config.label,
  })
);

export const EMPTY_DASHBOARD_OVERVIEW = {
  summary: {
    totalUsers: 0,
    activeUsers: 0,
    newSignups: 0,
    logins: 0,
    enrollments: 0,
    completions: 0,
    avgRating: 0,
    publishedCourses: 0,
    totalCourses: 0,
    activeSymptoms: 0,
    totalSymptoms: 0,
    totalReviews: 0,
  },
  changes: {
    newSignups: null,
    logins: null,
    enrollments: null,
  },
  charts: {
    userGrowth: [],
    coursePerformance: [],
  },
  recentUsers: [],
  recentCourses: [],
  recentActivity: [],
  health: [],
  rangeLabel: RANGE_DEFINITIONS["12m"].label,
  lastUpdatedAt: null,
  lastUpdatedLabel: FALLBACK_LABEL,
};

/* Normalize Supabase errors so UI layers can render concise failure messages. */
function createReadableError(fallbackMessage, error) {
  return new Error(error?.message || fallbackMessage);
}

async function fetchRows(table, columns, fallbackMessage) {
  const { data, error } = await supabase.from(table).select(columns);

  if (error) {
    throw createReadableError(fallbackMessage, error);
  }

  return Array.isArray(data) ? data : [];
}

function cleanText(value, fallback = "") {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function toNumber(value, fallback = 0) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
}

/* Defensive date parser used by all range and chart computations. */
function parseDateSafe(value) {
  if (!value) return null;

  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toTimestamp(value) {
  const date = parseDateSafe(value);
  return date ? date.getTime() : null;
}

function startOfDay(value) {
  const date = parseDateSafe(value) || new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function startOfMonth(value) {
  const date = parseDateSafe(value) || new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(value, amount) {
  const date = parseDateSafe(value) || new Date();
  date.setDate(date.getDate() + amount);
  return date;
}

function addMonths(value, amount) {
  const date = startOfMonth(value);
  date.setMonth(date.getMonth() + amount);
  return startOfMonth(date);
}

function formatDateSafe(value) {
  const date = parseDateSafe(value);
  return date ? dateFormatter.format(date) : FALLBACK_LABEL;
}

function formatRelativeTimeSafe(value, referenceDate = new Date()) {
  const date = parseDateSafe(value);
  const reference = parseDateSafe(referenceDate) || new Date();

  if (!date) return FALLBACK_LABEL;

  const diffMs = reference.getTime() - date.getTime();
  if (!Number.isFinite(diffMs)) return FALLBACK_LABEL;

  if (diffMs < 0) {
    return formatDateSafe(date);
  }

  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDateSafe(date);
}

function sortByDateDescending(items, getValue) {
  return [...items].sort((left, right) => {
    const leftTime = toTimestamp(getValue(left)) ?? 0;
    const rightTime = toTimestamp(getValue(right)) ?? 0;
    return rightTime - leftTime;
  });
}

function matchesRange(value, start, endExclusive) {
  const timestamp = toTimestamp(value);
  if (timestamp == null) return false;

  if (start && timestamp < start.getTime()) return false;
  if (endExclusive && timestamp >= endExclusive.getTime()) return false;

  return true;
}

function filterRowsWithinRange(rows, getDateValue, start, endExclusive) {
  return rows.filter((row) => matchesRange(getDateValue(row), start, endExclusive));
}

function countWithinRange(rows, getDateValue, start, endExclusive) {
  return filterRowsWithinRange(rows, getDateValue, start, endExclusive).length;
}

function calculateAverageRating(rows) {
  const ratings = rows
    .map((row) => toNumber(row.rating, NaN))
    .filter((value) => Number.isFinite(value));

  if (!ratings.length) return 0;

  const total = ratings.reduce((sum, value) => sum + value, 0);
  return Number((total / ratings.length).toFixed(1));
}

function calculateChange(currentValue, previousValue) {
  if (previousValue == null) return null;
  if (previousValue === 0) return currentValue > 0 ? 100 : 0;

  return Number((((currentValue - previousValue) / previousValue) * 100).toFixed(1));
}

/*
 * Builds the active reporting range and, when available, the matching
 * previous window used for percentage change indicators.
 */
function resolveRangeConfig(range, now = new Date()) {
  const config = RANGE_DEFINITIONS[range] || RANGE_DEFINITIONS["30d"];
  const currentEndExclusive = new Date(now.getTime() + 1);

  if (range === "all") {
    return {
      value: "all",
      label: config.label,
      unit: config.unit,
      currentStart: null,
      currentEndExclusive,
      previousStart: null,
      previousEndExclusive: null,
    };
  }

  if (range === "12m") {
    const currentStart = startOfMonth(addMonths(now, -11));
    const previousStart = startOfMonth(addMonths(currentStart, -12));

    return {
      value: range,
      label: config.label,
      unit: config.unit,
      currentStart,
      currentEndExclusive,
      previousStart,
      previousEndExclusive: currentStart,
    };
  }

  const currentStart = startOfDay(addDays(now, -(config.currentDays - 1)));
  const previousStart = startOfDay(
    addDays(currentStart, -config.previousDays)
  );

  return {
    value: range,
    label: config.label,
    unit: config.unit,
    currentStart,
    currentEndExclusive,
    previousStart,
    previousEndExclusive: currentStart,
  };
}

function collectValidDates(values) {
  return values
    .map((value) => parseDateSafe(value))
    .filter(Boolean);
}

/*
 * Chooses chart boundaries dynamically so "all time" views still align
 * to month buckets while constrained ranges honor their configured unit.
 */
function resolveBucketWindow(rangeConfig, values, now = new Date()) {
  if (rangeConfig.unit === "day") {
    return {
      start: startOfDay(rangeConfig.currentStart || now),
      endExclusive: startOfDay(addDays(now, 1)),
      unit: "day",
    };
  }

  if (rangeConfig.value !== "all") {
    return {
      start: startOfMonth(rangeConfig.currentStart || now),
      endExclusive: startOfMonth(addMonths(now, 1)),
      unit: "month",
    };
  }

  const validDates = collectValidDates(values);
  const earliestDate = validDates.length
    ? new Date(Math.min(...validDates.map((date) => date.getTime())))
    : now;

  return {
    start: startOfMonth(earliestDate),
    endExclusive: startOfMonth(addMonths(now, 1)),
    unit: "month",
  };
}

function buildBuckets(start, endExclusive, unit) {
  const buckets = [];
  let cursor = new Date(start);

  while (cursor < endExclusive) {
    const next = unit === "day" ? startOfDay(addDays(cursor, 1)) : startOfMonth(addMonths(cursor, 1));

    buckets.push({
      key: cursor.toISOString(),
      label: unit === "day" ? dayFormatter.format(cursor) : monthFormatter.format(cursor),
      start: new Date(cursor),
      endExclusive: next,
    });

    cursor = next;
  }

  return buckets;
}

function buildChartSeries(rows, getDateValue, buckets) {
  return buckets.map((bucket) =>
    countWithinRange(rows, getDateValue, bucket.start, bucket.endExclusive)
  );
}

function mapUserRow(row) {
  const fullName = cleanText(row.full_name);
  const email = cleanText(row.email);
  const displayName = fullName || email || "User";

  return {
    id: row.id,
    fullName,
    email,
    displayName,
    role: cleanText(row.role),
    status: cleanText(row.status).toLowerCase() || "unknown",
    avatarUrl: cleanText(row.avatar_url) || null,
    avatarInitial: displayName.charAt(0).toUpperCase() || "U",
    createdAt: row.created_at || null,
    lastLoginAt: row.last_login_at || null,
  };
}

function mapCourseRow(row) {
  return {
    id: row.id,
    title: cleanText(row.title) || "Untitled course",
    category: cleanText(row.category) || "General",
    description: cleanText(row.description),
    level: cleanText(row.level) || FALLBACK_LABEL,
    durationMinutes: toNumber(row.duration_minutes),
    thumbnailUrl: cleanText(row.thumbnail_url) || null,
    isPublished: Boolean(row.is_published),
    createdAt: row.created_at || null,
  };
}

function mapSymptomRow(row) {
  return {
    id: row.id,
    title: cleanText(row.title) || "Untitled symptom",
    isActive: Boolean(row.is_active),
    createdAt: row.created_at || null,
  };
}

function mapEnrollmentRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    courseId: row.course_id,
    enrolledAt: row.enrolled_at || null,
    completedAt: row.completed_at || null,
  };
}

function mapReviewRow(row) {
  return {
    id: row.id,
    courseId: row.course_id,
    userId: row.user_id,
    rating: toNumber(row.rating),
    reviewText: cleanText(row.review_text),
    createdAt: row.created_at || null,
  };
}

function mapRecentUser(user, now) {
  if (!parseDateSafe(user.lastLoginAt)) return null;

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    avatarInitial: user.avatarInitial,
    lastLoginAt: user.lastLoginAt,
    lastSeenLabel: formatRelativeTimeSafe(user.lastLoginAt, now),
  };
}

function mapRecentCourse(course) {
  if (!course.isPublished || !parseDateSafe(course.createdAt)) return null;

  return {
    id: course.id,
    title: course.title,
    category: course.category,
    level: course.level,
    durationMinutes: course.durationMinutes,
    thumbnailUrl: course.thumbnailUrl,
    createdAt: course.createdAt,
    createdLabel: formatDateSafe(course.createdAt),
    metaLabel: `${course.category} | ${course.level} | ${course.durationMinutes} min`,
  };
}

function mapActivityItem(item, now) {
  if (!parseDateSafe(item.at)) return null;

  return {
    ...item,
    subtitle: item.subtitle || FALLBACK_LABEL,
    thumbnail: item.thumbnail || null,
    atLabel: formatRelativeTimeSafe(item.at, now),
  };
}

function mapSignupActivity(user, now) {
  return mapActivityItem(
    {
      id: `signup-${user.id}`,
      type: "signup",
      title: `${user.displayName} signed up`,
      subtitle: user.email || "New user account",
      at: user.createdAt,
      thumbnail: user.avatarUrl,
    },
    now
  );
}

function mapLoginActivity(user, now) {
  return mapActivityItem(
    {
      id: `login-${user.id}`,
      type: "login",
      title: `${user.displayName} logged in`,
      subtitle: user.email || "Recent user login",
      at: user.lastLoginAt,
      thumbnail: user.avatarUrl,
    },
    now
  );
}

function mapCoursePublishedActivity(course, now) {
  return mapActivityItem(
    {
      id: `course-${course.id}`,
      type: "course",
      title: `Published: ${course.title}`,
      subtitle: `${course.category} course`,
      at: course.createdAt,
      thumbnail: course.thumbnailUrl,
    },
    now
  );
}

function mapReviewActivity(review, courseMap, now) {
  const course = courseMap.get(review.courseId);
  const ratingLabel = review.rating > 0 ? `${review.rating}-star review` : "new review";

  return mapActivityItem(
    {
      id: `review-${review.id}`,
      type: "review",
      title: `${course?.title || "Course"} received ${ratingLabel}`,
      subtitle: review.reviewText || "New review submitted",
      at: review.createdAt,
      thumbnail: course?.thumbnailUrl || null,
    },
    now
  );
}

/* Data health chips summarize record availability across key entities. */
function buildHealthItems({
  totalUsers,
  activeUsers,
  totalCourses,
  publishedCourses,
  totalSymptoms,
  activeSymptoms,
  totalReviews,
  avgRatingOverall,
}) {
  return [
    {
      key: "users",
      label: "Users",
      status: totalUsers > 0 ? "Healthy" : "No data",
      meta: `${activeUsers} active | ${totalUsers} total`,
    },
    {
      key: "courses",
      label: "Courses",
      status: totalCourses > 0 ? "Healthy" : "No data",
      meta: `${publishedCourses} published | ${totalCourses} total`,
    },
    {
      key: "symptoms",
      label: "Symptoms",
      status: totalSymptoms > 0 ? "Healthy" : "No data",
      meta: `${activeSymptoms} active | ${totalSymptoms} total`,
    },
    {
      key: "reviews",
      label: "Reviews",
      status: totalReviews > 0 ? "Healthy" : "No data",
      meta: `${totalReviews} total | ${avgRatingOverall.toFixed(1)} avg`,
    },
  ];
}

/*
 * Dashboard aggregator that fetches source tables in parallel, normalizes
 * rows, and derives KPI, chart, and timeline payloads for the page layer.
 */
export async function getDashboardOverview({ range = "12m" } = {}) {
  const now = new Date();
  const rangeConfig = resolveRangeConfig(range, now);

  const [userRows, courseRows, symptomRows, enrollmentRows, reviewRows] =
    await Promise.all([
      fetchRows("users", TABLE_COLUMNS.users, "Failed to load users."),
      fetchRows("courses", TABLE_COLUMNS.courses, "Failed to load courses."),
      fetchRows("chassis_symptoms", TABLE_COLUMNS.symptoms, "Failed to load symptoms."),
      fetchRows(
        "course_enrollments",
        TABLE_COLUMNS.enrollments,
        "Failed to load enrollments."
      ),
      fetchRows("course_reviews", TABLE_COLUMNS.reviews, "Failed to load reviews."),
    ]);

  const users = userRows.map(mapUserRow);
  const courses = courseRows.map(mapCourseRow);
  const symptoms = symptomRows.map(mapSymptomRow);
  const enrollments = enrollmentRows.map(mapEnrollmentRow);
  const reviews = reviewRows.map(mapReviewRow);

  const publishedCourses = courses.filter((course) => course.isPublished);
  const activeUsers = users.filter((user) => user.status === "active").length;
  const activeSymptoms = symptoms.filter((symptom) => symptom.isActive).length;

  const currentSignups = filterRowsWithinRange(
    users,
    (user) => user.createdAt,
    rangeConfig.currentStart,
    rangeConfig.currentEndExclusive
  );
  const currentLogins = filterRowsWithinRange(
    users,
    (user) => user.lastLoginAt,
    rangeConfig.currentStart,
    rangeConfig.currentEndExclusive
  );
  const currentEnrollments = filterRowsWithinRange(
    enrollments,
    (enrollment) => enrollment.enrolledAt,
    rangeConfig.currentStart,
    rangeConfig.currentEndExclusive
  );
  const currentCompletions = filterRowsWithinRange(
    enrollments,
    (enrollment) => enrollment.completedAt,
    rangeConfig.currentStart,
    rangeConfig.currentEndExclusive
  );
  const currentReviews = filterRowsWithinRange(
    reviews,
    (review) => review.createdAt,
    rangeConfig.currentStart,
    rangeConfig.currentEndExclusive
  );

  const previousSignups = rangeConfig.previousStart
    ? filterRowsWithinRange(
        users,
        (user) => user.createdAt,
        rangeConfig.previousStart,
        rangeConfig.previousEndExclusive
      )
    : [];

  const previousLogins = rangeConfig.previousStart
    ? filterRowsWithinRange(
        users,
        (user) => user.lastLoginAt,
        rangeConfig.previousStart,
        rangeConfig.previousEndExclusive
      )
    : [];

  const previousEnrollments = rangeConfig.previousStart
    ? filterRowsWithinRange(
        enrollments,
        (enrollment) => enrollment.enrolledAt,
        rangeConfig.previousStart,
        rangeConfig.previousEndExclusive
      )
    : [];

  const bucketWindow = resolveBucketWindow(
    rangeConfig,
    [
      ...users.map((user) => user.createdAt),
      ...users.map((user) => user.lastLoginAt),
      ...enrollments.map((enrollment) => enrollment.enrolledAt),
      ...enrollments.map((enrollment) => enrollment.completedAt),
      ...reviews.map((review) => review.createdAt),
      ...publishedCourses.map((course) => course.createdAt),
    ],
    now
  );

  const buckets = buildBuckets(
    bucketWindow.start,
    bucketWindow.endExclusive,
    bucketWindow.unit
  );

  const signupSeries = buildChartSeries(users, (user) => user.createdAt, buckets);
  const loginSeries = buildChartSeries(users, (user) => user.lastLoginAt, buckets);
  const enrollmentSeries = buildChartSeries(
    enrollments,
    (enrollment) => enrollment.enrolledAt,
    buckets
  );
  const completionSeries = buildChartSeries(
    enrollments,
    (enrollment) => enrollment.completedAt,
    buckets
  );
  const reviewSeries = buildChartSeries(reviews, (review) => review.createdAt, buckets);

  const charts = {
    userGrowth: buckets.map((bucket, index) => ({
      key: bucket.key,
      label: bucket.label,
      signups: signupSeries[index] || 0,
      logins: loginSeries[index] || 0,
    })),
    coursePerformance: buckets.map((bucket, index) => ({
      key: bucket.key,
      label: bucket.label,
      enrollments: enrollmentSeries[index] || 0,
      completions: completionSeries[index] || 0,
      reviews: reviewSeries[index] || 0,
    })),
  };

  // Reuse a lookup map so activity entries can reference course metadata efficiently.
  const courseMap = new Map(courses.map((course) => [course.id, course]));

  const recentUsers = sortByDateDescending(
    currentLogins,
    (user) => user.lastLoginAt
  )
    .slice(0, 6)
    .map((user) => mapRecentUser(user, now))
    .filter(Boolean);

  const recentCourses = sortByDateDescending(
    filterRowsWithinRange(
      publishedCourses,
      (course) => course.createdAt,
      rangeConfig.currentStart,
      rangeConfig.currentEndExclusive
    ),
    (course) => course.createdAt
  )
    .slice(0, 6)
    .map(mapRecentCourse)
    .filter(Boolean);

  const signupActivity = currentSignups.map((user) => mapSignupActivity(user, now));
  const loginActivity = currentLogins.map((user) => mapLoginActivity(user, now));
  const courseActivity = filterRowsWithinRange(
    publishedCourses,
    (course) => course.createdAt,
    rangeConfig.currentStart,
    rangeConfig.currentEndExclusive
  ).map((course) => mapCoursePublishedActivity(course, now));
  const reviewActivity = currentReviews.map((review) =>
    mapReviewActivity(review, courseMap, now)
  );

  // Merge heterogeneous activity events into a single time-ordered feed for the UI.
  const recentActivity = sortByDateDescending(
    [...signupActivity, ...loginActivity, ...courseActivity, ...reviewActivity].filter(
      Boolean
    ),
    (item) => item.at
  ).slice(0, 8);

  const avgRatingCurrent = calculateAverageRating(currentReviews);
  const avgRatingOverall = calculateAverageRating(reviews);

  return {
    summary: {
      totalUsers: users.length,
      activeUsers,
      newSignups: currentSignups.length,
      logins: currentLogins.length,
      enrollments: currentEnrollments.length,
      completions: currentCompletions.length,
      avgRating: avgRatingCurrent,
      publishedCourses: publishedCourses.length,
      totalCourses: courses.length,
      activeSymptoms,
      totalSymptoms: symptoms.length,
      totalReviews: reviews.length,
    },
    changes: {
      newSignups: rangeConfig.previousStart
        ? calculateChange(currentSignups.length, previousSignups.length)
        : null,
      logins: rangeConfig.previousStart
        ? calculateChange(currentLogins.length, previousLogins.length)
        : null,
      enrollments: rangeConfig.previousStart
        ? calculateChange(currentEnrollments.length, previousEnrollments.length)
        : null,
    },
    charts,
    recentUsers,
    recentCourses,
    recentActivity,
    health: buildHealthItems({
      totalUsers: users.length,
      activeUsers,
      totalCourses: courses.length,
      publishedCourses: publishedCourses.length,
      totalSymptoms: symptoms.length,
      activeSymptoms,
      totalReviews: reviews.length,
      avgRatingOverall,
    }),
    rangeLabel: rangeConfig.label,
    lastUpdatedAt: now.toISOString(),
    lastUpdatedLabel: formatRelativeTimeSafe(now, now),
  };
}
