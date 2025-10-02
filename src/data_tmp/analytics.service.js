import {
  DAILY_ENGAGEMENT,
  COURSE_STATS,
  CHASSIS_STATS,
  SCHEDULES,
} from "./analytics.fixtures";

const sleep = (ms = 120) => new Promise((r) => setTimeout(r, ms));

const db = {
  daily: [...DAILY_ENGAGEMENT],
  courses: [...COURSE_STATS],
  chassis: { ...CHASSIS_STATS },
  schedules: [...SCHEDULES],
};

function parseDate(s) {
  return new Date(s + "T00:00:00").getTime();
}

/* ------------------------------ Engagement ------------------------------ */
export async function getEngagement({ from, to } = {}) {
  await sleep();
  let rows = [...db.daily];
  if (from) rows = rows.filter((x) => parseDate(x.d) >= parseDate(from));
  if (to) rows = rows.filter((x) => parseDate(x.d) <= parseDate(to));
  const totalAU = rows.reduce((a, b) => a + b.au, 0);
  const avgAU = rows.length ? Math.round(totalAU / rows.length) : 0;
  const avgR7 = rows.length
    ? Math.round(rows.reduce((a, b) => a + b.r7, 0) / rows.length)
    : 0;
  const modCourses = rows.reduce((a, b) => a + (b.courses || 0), 0);
  const modChassis = rows.reduce((a, b) => a + (b.chassis || 0), 0);
  return { rows, kpis: { avgAU, avgR7, modCourses, modChassis } };
}

/* ------------------------------- Courses -------------------------------- */
export async function getCourseStats({ courseId } = {}) {
  await sleep();
  let rows = [...db.courses];
  if (courseId) rows = rows.filter((c) => c.id === courseId);
  const mapped = rows.map((c) => ({
    courseId: c.id,
    title: c.title,
    enrollments: c.enrollments,
    completions: c.completions,
    completionRate: c.enrollments
      ? Math.round((c.completions / c.enrollments) * 100)
      : 0,
    revenueCents: c.revenueCents || 0,
  }));
  return { rows: mapped };
}

/* ------------------------------- Chassis -------------------------------- */
export async function getChassisStats() {
  await sleep();
  return { symptoms: db.chassis.symptoms, fixes: db.chassis.fixes };
}

/* -------------------------------- Exports -------------------------------- */
function toCSV(headers, rows) {
  const escape = (v) => '"' + String(v ?? "").replaceAll('"', '""') + '"';
  const head = headers.map(escape).join(",");
  const body = rows
    .map((r) => headers.map((h) => escape(r[h])).join(","))
    .join("\n");
  return head + "\n" + body;
}

export async function exportCSV({ type, filters = {} } = {}) {
  await sleep(50);
  if (type === "engagement") {
    const { rows } = await getEngagement(filters);
    const headers = [
      "date",
      "active_users",
      "retention_7d",
      "courses",
      "chassis",
    ];
    const data = rows.map((r) => ({
      date: r.d,
      active_users: r.au,
      retention_7d: r.r7,
      courses: r.courses,
      chassis: r.chassis,
    }));
    return toCSV(headers, data);
  }
  if (type === "courses") {
    const { rows } = await getCourseStats(filters);
    const headers = [
      "courseId",
      "title",
      "enrollments",
      "completions",
      "completionRate",
      "revenueCents",
    ];
    return toCSV(headers, rows);
  }
  if (type === "chassis") {
    const { symptoms, fixes } = await getChassisStats(filters);
    const headers = ["type", "key", "count"];
    const rows = [
      ...symptoms.map((s) => ({ type: "symptom", key: s.key, count: s.count })),
      ...fixes.map((f) => ({ type: "fix", key: f.key, count: f.count })),
    ];
    return toCSV(headers, rows);
  }
  return "";
}

export async function listSchedules() {
  await sleep();
  return [...db.schedules];
}
export async function scheduleReport({ type, cadence = "weekly", email }) {
  await sleep();
  const row = {
    id: `sch_${Date.now()}`,
    type,
    cadence,
    email,
    createdAt: Date.now(),
  };
  db.schedules.push(row);
  return row;
}

/* --------------------------------- Lookups -------------------------------- */
export async function listCoursesLookup() {
  await sleep();
  return [
    { id: "crs_oval_mastery", title: "Oval Racing Mastery" },
    { id: "crs_susp_geometry", title: "Suspension Geometry Essentials" },
  ];
}
