export const DAILY_ENGAGEMENT = [
  // date (YYYY-MM-DD), active users, retention7d %, module usage splits
  { d: "2025-09-01", au: 120, r7: 38, courses: 60, chassis: 40 },
  { d: "2025-09-02", au: 142, r7: 39, courses: 72, chassis: 50 },
  { d: "2025-09-03", au: 135, r7: 40, courses: 69, chassis: 47 },
  { d: "2025-09-04", au: 150, r7: 41, courses: 77, chassis: 51 },
  { d: "2025-09-05", au: 158, r7: 42, courses: 82, chassis: 53 },
  { d: "2025-09-06", au: 162, r7: 43, courses: 85, chassis: 55 },
  { d: "2025-09-07", au: 149, r7: 44, courses: 78, chassis: 49 },
  { d: "2025-09-08", au: 171, r7: 45, courses: 92, chassis: 56 },
  { d: "2025-09-09", au: 177, r7: 45, courses: 95, chassis: 59 },
  { d: "2025-09-10", au: 180, r7: 46, courses: 97, chassis: 60 },
];

export const COURSE_STATS = [
  {
    id: "crs_oval_mastery",
    title: "Oval Racing Mastery",
    enrollments: 210,
    completions: 124,
    revenueCents: 14900 * 90,
  },
  {
    id: "crs_susp_geometry",
    title: "Suspension Geometry Essentials",
    enrollments: 320,
    completions: 276,
    revenueCents: 0,
  },
];

export const CHASSIS_STATS = {
  symptoms: [
    { key: "Entry Understeer", count: 84 },
    { key: "Mid‑Corner Push", count: 57 },
    { key: "Exit Traction Loss", count: 63 },
  ],
  fixes: [
    { key: "Soften Front ARB", count: 52 },
    { key: "Add Rear Wing", count: 38 },
    { key: "Stiffen Rear Rebound", count: 29 },
  ],
};

export const SCHEDULES = [
  // Minimal schedule mocks
  {
    id: "sch_1",
    type: "engagement",
    cadence: "weekly",
    email: "ops@example.com",
    createdAt: Date.now() - 86400000 * 4,
  },
];
