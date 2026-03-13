/*
 * Service layer for analytics data access, shaping, and error translation.
 * Centralizes API interaction details so UI components remain focused on presentation logic.
 */

import { supabase } from "../lib/supabaseClient";

const TABLES = {
  users: "users",
  courses: "courses",
  courseEnrollments: "course_enrollments",
  courseReviews: "course_reviews",
  courseRatingSummary: "course_rating_summary",
  chassisSymptoms: "chassis_symptoms",
  chassisSets: "chassis_adjustment_sets",
  chassisSessions: "chassis_sessions",
  recommendations: "adjustment_recommendations",
  setRecommendations: "chassis_adjustment_set_recommendations",
  trackPresets: "track_config_presets",
};

const COURSE_THUMBNAIL_KEYS = [
  "thumbnail_url",
  "thumbnail",
  "image_url",
  "image",
  "cover_url",
  "cover_image",
  "poster_url",
  "banner_url",
];

function throwIfError(error, fallback) {
  if (error) {
    throw new Error(error.message || fallback);
  }
}

async function selectOrThrow(table, select = "*", decorate) {
  let query = supabase.from(table).select(select);
  if (typeof decorate === "function") {
    query = decorate(query);
  }

  const { data, error } = await query;
  throwIfError(error, `Failed to load ${table}`);
  return data || [];
}

async function selectSafe(table, select = "*", decorate) {
  try {
    let query = supabase.from(table).select(select);
    if (typeof decorate === "function") {
      query = decorate(query);
    }

    const { data, error } = await query;
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

function toInputDate(value) {
  const date = value ? new Date(value) : new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDateStart(value) {
  return new Date(`${value}T00:00:00`);
}

function getDateEnd(value) {
  return new Date(`${value}T23:59:59.999`);
}

function isWithinRange(value, from, to) {
  if (!value) return false;
  const time = new Date(value).getTime();
  return time >= getDateStart(from).getTime() && time <= getDateEnd(to).getTime();
}

function toDayKey(value) {
  if (!value) return "";
  return toInputDate(value);
}

function buildDateKeys(from, to) {
  const keys = [];
  const cursor = new Date(getDateStart(from));
  const end = getDateEnd(to);

  while (cursor.getTime() <= end.getTime()) {
    keys.push(toInputDate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return keys;
}

function incrementMap(map, key, amount = 1) {
  if (!key) return;
  map.set(key, (map.get(key) || 0) + amount);
}

function pickThumbnail(row = {}) {
  for (const key of COURSE_THUMBNAIL_KEYS) {
    if (row[key]) return row[key];
  }
  return "";
}

function toInitials(value = "") {
  return String(value)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function toPercent(value) {
  return Number.isFinite(value) ? Math.round(value) : 0;
}

function escapeCsv(value) {
  const text =
    value == null
      ? ""
      : typeof value === "object"
        ? JSON.stringify(value)
        : String(value);

  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function downloadFile({ content, fileName, mimeType }) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function getDefaultDateRange(days = 14) {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - (days - 1));

  return {
    from: toInputDate(from),
    to: toInputDate(to),
  };
}

export async function getEngagementAnalytics({ from, to }) {
  const safeFrom = from || getDefaultDateRange().from;
  const safeTo = to || getDefaultDateRange().to;

  const [users, enrollments, reviews] = await Promise.all([
    selectOrThrow(TABLES.users, "id, created_at, role, status"),
    selectOrThrow(
      TABLES.courseEnrollments,
      "user_id, enrolled_at, completed_at",
      (query) => query.gte("enrolled_at", `${safeFrom}T00:00:00`).lte("enrolled_at", `${safeTo}T23:59:59.999`)
    ),
    selectOrThrow(
      TABLES.courseReviews,
      "user_id, created_at, rating",
      (query) => query.gte("created_at", `${safeFrom}T00:00:00`).lte("created_at", `${safeTo}T23:59:59.999`)
    ),
  ]);

  const newUsers = users.filter((user) => isWithinRange(user.created_at, safeFrom, safeTo));
  const activeAccounts = users.filter(
    (user) => String(user.status || "").toLowerCase() === "active"
  );

  const engagedIds = new Set();
  const dayKeys = buildDateKeys(safeFrom, safeTo);
  const dayMap = new Map(dayKeys.map((key) => [key, new Set()]));

  for (const user of newUsers) {
    engagedIds.add(user.id);
    const key = toDayKey(user.created_at);
    if (dayMap.has(key)) dayMap.get(key).add(user.id);
  }

  for (const enrollment of enrollments) {
    if (enrollment.user_id) engagedIds.add(enrollment.user_id);
    const key = toDayKey(enrollment.enrolled_at);
    if (dayMap.has(key) && enrollment.user_id) {
      dayMap.get(key).add(enrollment.user_id);
    }
  }

  for (const review of reviews) {
    if (review.user_id) engagedIds.add(review.user_id);
    const key = toDayKey(review.created_at);
    if (dayMap.has(key) && review.user_id) {
      dayMap.get(key).add(review.user_id);
    }
  }

  const rows = dayKeys.map((date) => ({
    date,
    au: dayMap.get(date)?.size || 0,
  }));

  const kpis = [
    {
      key: "total-users",
      label: "Total Users",
      value: users.length,
      help: "All registered users",
    },
    {
      key: "active-accounts",
      label: "Active Accounts",
      value: activeAccounts.length,
      help: "Users with active status",
    },
    {
      key: "active-users-range",
      label: "Active Users",
      value: engagedIds.size,
      help: `Users active from ${safeFrom} to ${safeTo}`,
    },
    {
      key: "new-users-range",
      label: "New Users",
      value: newUsers.length,
      help: "New registrations in selected range",
    },
  ];

  return {
    kpis,
    rows,
    exportRows: rows.map((row) => ({
      date: row.date,
      active_users: row.au,
    })),
  };
}

export async function getCourseAnalytics() {
  const [courses, enrollments, ratingSummaryRows, reviewRows] = await Promise.all([
    selectOrThrow(TABLES.courses, "*"),
    selectOrThrow(TABLES.courseEnrollments, "course_id, user_id, enrolled_at, completed_at"),
    selectSafe(TABLES.courseRatingSummary, "course_id, total_reviews, avg_rating"),
    selectSafe(TABLES.courseReviews, "course_id, rating, review_text, created_at"),
  ]);

  const enrollmentMap = new Map();
  const completionMap = new Map();

  for (const enrollment of enrollments) {
    incrementMap(enrollmentMap, enrollment.course_id, 1);
    if (enrollment.completed_at) {
      incrementMap(completionMap, enrollment.course_id, 1);
    }
  }

  const ratingSummaryMap = new Map(
    ratingSummaryRows.map((row) => [row.course_id, row])
  );

  const reviewAggMap = new Map();
  for (const review of reviewRows) {
    const current = reviewAggMap.get(review.course_id) || {
      totalReviews: 0,
      totalRating: 0,
    };

    current.totalReviews += 1;
    current.totalRating += Number(review.rating || 0);
    reviewAggMap.set(review.course_id, current);
  }

  const rows = courses
    .map((course) => {
      const enrollCount = enrollmentMap.get(course.id) || 0;
      const completionCount = completionMap.get(course.id) || 0;
      const ratingSummary = ratingSummaryMap.get(course.id);
      const fallbackReview = reviewAggMap.get(course.id);

      const totalReviews = Number(
        ratingSummary?.total_reviews ??
          fallbackReview?.totalReviews ??
          0
      );

      const avgRating = Number(
        ratingSummary?.avg_rating ??
          (fallbackReview?.totalReviews
            ? fallbackReview.totalRating / fallbackReview.totalReviews
            : 0)
      );

      return {
        courseId: course.id,
        title: course.title || "Untitled Course",
        category: course.category || "Uncategorized",
        level: course.level || "N/A",
        description: course.description || "",
        durationMinutes: Number(course.duration_minutes || 0),
        thumbnailUrl: pickThumbnail(course),
        thumbnailFallback: toInitials(course.title || "Course"),
        enrollments: enrollCount,
        completions: completionCount,
        completionRate: enrollCount
          ? toPercent((completionCount / enrollCount) * 100)
          : 0,
        avgRating: Number(avgRating.toFixed(1)),
        totalReviews,
      };
    })
    .sort((a, b) => {
      if (b.enrollments !== a.enrollments) return b.enrollments - a.enrollments;
      return a.title.localeCompare(b.title);
    });

  const totalEnrollments = rows.reduce((sum, row) => sum + row.enrollments, 0);
  const totalCompletions = rows.reduce((sum, row) => sum + row.completions, 0);
  const totalReviews = rows.reduce((sum, row) => sum + row.totalReviews, 0);
  const weightedRatingTotal = rows.reduce(
    (sum, row) => sum + row.avgRating * row.totalReviews,
    0
  );

  const summary = [
    {
      key: "total-courses",
      label: "Total Courses",
      value: rows.length,
      help: "Available courses",
    },
    {
      key: "total-enrollments",
      label: "Enrollments",
      value: totalEnrollments,
      help: "All enrollments",
    },
    {
      key: "total-completions",
      label: "Completions",
      value: totalCompletions,
      help: "Completed enrollments",
    },
    {
      key: "completion-rate",
      label: "Completion Rate",
      value: `${totalEnrollments ? toPercent((totalCompletions / totalEnrollments) * 100) : 0}%`,
      help: "Weighted completion rate",
    },
    {
      key: "avg-rating",
      label: "Average Rating",
      value: totalReviews ? (weightedRatingTotal / totalReviews).toFixed(1) : "0.0",
      help: `${totalReviews} total reviews`,
    },
  ];

  return {
    rows,
    summary,
    exportRows: rows.map((row) => ({
      course_id: row.courseId,
      title: row.title,
      category: row.category,
      level: row.level,
      enrollments: row.enrollments,
      completions: row.completions,
      completion_rate: row.completionRate,
      avg_rating: row.avgRating,
      total_reviews: row.totalReviews,
    })),
  };
}

async function getChassisSessionUsage(symptomLookup, recommendationLookup) {
  const sessions = await selectSafe(TABLES.chassisSessions, "*");
  if (!sessions.length) return null;

  const symptomCountMap = new Map();
  const fixCountMap = new Map();

  for (const session of sessions) {
    const symptomId =
      session.symptom_id ||
      session.chassis_symptom_id ||
      session.selected_symptom_id;

    const symptomName =
      session.symptom_title ||
      session.symptom_name ||
      session.selected_symptom_title ||
      symptomLookup.get(symptomId)?.title;

    incrementMap(symptomCountMap, symptomName, 1);

    const recommendationId =
      session.recommendation_id ||
      session.adjustment_recommendation_id ||
      session.fix_id;

    const fixName =
      session.recommendation_title ||
      session.fix_title ||
      session.adjustment_title ||
      recommendationLookup.get(recommendationId)?.title;

    incrementMap(fixCountMap, fixName, 1);
  }

  return {
    symptomCountMap,
    fixCountMap,
  };
}

export async function getChassisAnalytics() {
  const [symptoms, sets, recommendations, setRecommendations, presets] =
    await Promise.all([
      selectOrThrow(TABLES.chassisSymptoms, "*"),
      selectSafe(TABLES.chassisSets, "id, symptom_id"),
      selectSafe(TABLES.recommendations, "*"),
      selectSafe(TABLES.setRecommendations, "set_id, recommendation_id"),
      selectSafe(TABLES.trackPresets, "id"),
    ]);

  const symptomLookup = new Map(
    symptoms.map((row) => [
      row.id,
      {
        title: row.title || row.name || "",
        description: row.description || "",
        isActive: row.is_active ?? true,
      },
    ])
  );

  const recommendationLookup = new Map(
    recommendations.map((row) => [
      row.id,
      {
        title: row.title || row.name || "",
        category: row.category || "Other",
      },
    ])
  );

  const sessionUsage = await getChassisSessionUsage(
    symptomLookup,
    recommendationLookup
  );

  const setCountBySymptomId = new Map();
  for (const row of sets) {
    incrementMap(setCountBySymptomId, row.symptom_id, 1);
  }

  const recommendationCountById = new Map();
  for (const row of setRecommendations) {
    incrementMap(recommendationCountById, row.recommendation_id, 1);
  }

  let symptomRows = symptoms.map((row) => {
    const title = row.title || row.name || "Untitled Symptom";
    const fallbackCount = setCountBySymptomId.get(row.id) || 0;
    const liveCount = sessionUsage?.symptomCountMap.get(title) || 0;

    return {
      key: title,
      description: row.description || "",
      isActive: row.is_active ?? true,
      count: liveCount || fallbackCount,
    };
  });

  let fixRows = recommendations.map((row) => {
    const title = row.title || row.name || "Untitled Fix";
    const fallbackCount = recommendationCountById.get(row.id) || 0;
    const liveCount = sessionUsage?.fixCountMap.get(title) || 0;

    return {
      key: title,
      category: row.category || "Other",
      count: liveCount || fallbackCount,
    };
  });

  const hasSymptomCounts = symptomRows.some((item) => item.count > 0);
  const hasFixCounts = fixRows.some((item) => item.count > 0);

  if (hasSymptomCounts) {
    symptomRows = symptomRows.filter((item) => item.count > 0);
  }

  if (hasFixCounts) {
    fixRows = fixRows.filter((item) => item.count > 0);
  }

  symptomRows.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.key.localeCompare(b.key);
  });

  fixRows.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.key.localeCompare(b.key);
  });

  const summary = [
    {
      key: "symptom-count",
      label: "Symptoms",
      value: symptoms.length,
      help: "Total symptoms in database",
    },
    {
      key: "active-symptom-count",
      label: "Active Symptoms",
      value: symptoms.filter((item) => item.is_active ?? true).length,
      help: "Currently active symptoms",
    },
    {
      key: "fix-count",
      label: "Recommendations",
      value: recommendations.length,
      help: "Available fixes/recommendations",
    },
    {
      key: "preset-count",
      label: "Track Presets",
      value: presets.length,
      help: "Preset configurations",
    },
  ];

  return {
    symptoms: symptomRows,
    fixes: fixRows,
    summary,
    exportRows: {
      symptoms: symptomRows.map((row) => ({
        symptom: row.key,
        description: row.description,
        status: row.isActive ? "Active" : "Inactive",
        count: row.count,
      })),
      fixes: fixRows.map((row) => ({
        fix: row.key,
        category: row.category,
        count: row.count,
      })),
    },
  };
}

function buildCsvContent(sections) {
  let output = "";

  Object.entries(sections).forEach(([sectionName, rows], index) => {
    if (index > 0) output += "\n";

    output += `${sectionName}\n`;

    if (!Array.isArray(rows) || rows.length === 0) {
      output += "No data\n";
      return;
    }

    const headers = Array.from(
      rows.reduce((set, row) => {
        Object.keys(row || {}).forEach((key) => set.add(key));
        return set;
      }, new Set())
    );

    output += `${headers.join(",")}\n`;

    rows.forEach((row) => {
      output += `${headers.map((header) => escapeCsv(row[header])).join(",")}\n`;
    });
  });

  return output;
}

export function downloadAnalyticsReport({ scope, format, payload }) {
  const now = new Date();
  const stamp = `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, "0")}-${`${now.getDate()}`.padStart(2, "0")}-${`${now.getHours()}`.padStart(2, "0")}${`${now.getMinutes()}`.padStart(2, "0")}`;

  const sections = {};

  if (scope === "all" || scope === "engagement") {
    sections["Engagement KPIs"] = payload.engagementKpis || [];
    sections["Daily Active Users"] = payload.engagementRows || [];
  }

  if (scope === "all" || scope === "courses") {
    sections["Course Analytics"] = payload.courseRows || [];
  }

  if (scope === "all" || scope === "chassis") {
    sections["Chassis Symptoms"] = payload.chassisSymptoms || [];
    sections["Chassis Fixes"] = payload.chassisFixes || [];
  }

  const fileBase = `analytics-${scope}-${stamp}`;

  if (String(format).toLowerCase() === "json") {
    downloadFile({
      content: JSON.stringify(sections, null, 2),
      fileName: `${fileBase}.json`,
      mimeType: "application/json;charset=utf-8",
    });
    return {
      fileName: `${fileBase}.json`,
      format: "JSON",
    };
  }

  downloadFile({
    content: buildCsvContent(sections),
    fileName: `${fileBase}.csv`,
    mimeType: "text/csv;charset=utf-8",
  });

  return {
    fileName: `${fileBase}.csv`,
    format: "CSV",
  };
}