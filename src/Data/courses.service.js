import { COURSES, TOPICS, MEDIA_ASSETS, ENROLLMENTS } from "./courses.fixtures";

const sleep = (ms = 120) => new Promise((r) => setTimeout(r, ms));

const db = {
  courses: [...COURSES],
  topics: [...TOPICS],
  media: [...MEDIA_ASSETS],
  enrollments: [...ENROLLMENTS],
};

/* -------------------------------- Courses -------------------------------- */
export async function listCourses({
  page = 1,
  pageSize = 10,
  query = "",
  level = "all",
  access = "all",
} = {}) {
  await sleep();
  let rows = db.courses;
  if (query) {
    const q = query.toLowerCase();
    rows = rows.filter((c) =>
      [c.title, c.summary, c.slug].some((v) =>
        String(v).toLowerCase().includes(q)
      )
    );
  }
  if (level !== "all") rows = rows.filter((c) => c.level === level);
  if (access !== "all")
    rows = rows.filter((c) => (access === "paid" ? c.isPaid : !c.isPaid));
  const total = rows.length;
  const start = (page - 1) * pageSize;
  const data = rows.slice(start, start + pageSize);
  return { data, total };
}

export async function upsertCourse(course) {
  await sleep();
  const idx = db.courses.findIndex((c) => c.id === course.id);
  if (idx >= 0) db.courses[idx] = { ...db.courses[idx], ...course };
  else db.courses.push({ ...course, id: `crs_${Date.now()}` });
  return course;
}

/* -------------------------------- Topics --------------------------------- */
export async function listTopics({ courseId, query = "" } = {}) {
  await sleep();
  let rows = db.topics;
  if (courseId) rows = rows.filter((t) => t.courseId === courseId);
  if (query) {
    const q = query.toLowerCase();
    rows = rows.filter((t) => String(t.name).toLowerCase().includes(q));
  }
  rows = rows.sort((a, b) => a.order - b.order);
  return { data: rows, total: rows.length };
}

export async function upsertTopic(topic) {
  await sleep();
  const idx = db.topics.findIndex((t) => t.id === topic.id);
  if (idx >= 0) db.topics[idx] = { ...db.topics[idx], ...topic };
  else db.topics.push({ ...topic, id: `t_${Date.now()}` });
  return topic;
}

/* --------------------------------- Media --------------------------------- */
export async function listMedia({ courseId, type = "all", query = "" } = {}) {
  await sleep();
  let rows = db.media;
  if (courseId) rows = rows.filter((m) => m.courseId === courseId);
  if (type !== "all") rows = rows.filter((m) => m.type === type);
  if (query) {
    const q = query.toLowerCase();
    rows = rows.filter((m) => String(m.title).toLowerCase().includes(q));
  }
  return { data: rows, total: rows.length };
}

export async function upsertMedia(asset) {
  await sleep();
  const idx = db.media.findIndex((m) => m.id === asset.id);
  if (idx >= 0) db.media[idx] = { ...db.media[idx], ...asset };
  else db.media.push({ ...asset, id: `m_${Date.now()}` });
  return asset;
}

/* ------------------------------ Pricing/Access ----------------------------- */
export async function listPricing() {
  await sleep();
  return db.courses.map((c) => ({
    courseId: c.id,
    title: c.title,
    isPaid: c.isPaid,
    priceCents: c.priceCents,
  }));
}

export async function updatePricing(courseId, { isPaid, priceCents }) {
  await sleep();
  const idx = db.courses.findIndex((c) => c.id === courseId);
  if (idx >= 0) {
    db.courses[idx].isPaid = !!isPaid;
    db.courses[idx].priceCents = Number(priceCents || 0);
  }
  return db.courses[idx];
}

/* ----------------------------- Enrollments/Progress ----------------------------- */
export async function listProgress() {
  await sleep();
  const byCourse = new Map();
  for (const e of db.enrollments) {
    const s = byCourse.get(e.courseId) || {
      learners: 0,
      completed: 0,
      pctSum: 0,
    };
    s.learners += 1;
    s.completed += e.completed ? 1 : 0;
    s.pctSum += e.pct || 0;
    byCourse.set(e.courseId, s);
  }
  return db.courses.map((c) => {
    const s = byCourse.get(c.id) || { learners: 0, completed: 0, pctSum: 0 };
    const avg = s.learners ? Math.round(s.pctSum / s.learners) : 0;
    const completionRate = s.learners
      ? Math.round((s.completed / s.learners) * 100)
      : 0;
    return {
      courseId: c.id,
      title: c.title,
      learners: s.learners,
      avgProgress: avg,
      completionRate,
    };
  });
}
