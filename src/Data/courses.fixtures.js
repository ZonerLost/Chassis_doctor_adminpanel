export const COURSES = [
  {
    id: "crs_oval_mastery",
    title: "Oval Racing Mastery",
    slug: "oval-racing-mastery",
    level: "intermediate", // beginner | intermediate | advanced
    isPaid: true,
    priceCents: 14900,
    summary: "Corner entry to exit: lines, throttle, balance.",
  },
  {
    id: "crs_susp_geometry",
    title: "Suspension Geometry Essentials",
    slug: "suspension-geometry-essentials",
    level: "beginner",
    isPaid: false,
    priceCents: 0,
    summary: "Camber, caster, toe and roll centers 101.",
  },
];

export const TOPICS = [
  { id: "t_1", courseId: "crs_oval_mastery", name: "Tyres", order: 1 },
  { id: "t_2", courseId: "crs_oval_mastery", name: "Shocks", order: 2 },
  { id: "t_3", courseId: "crs_susp_geometry", name: "Camber", order: 1 },
  { id: "t_4", courseId: "crs_susp_geometry", name: "Alignment", order: 2 },
  {
    id: "t_5",
    courseId: "crs_susp_geometry",
    name: "Anti‑roll Bars",
    order: 3,
  },
];

export const MEDIA_ASSETS = [
  {
    id: "m_1",
    courseId: "crs_oval_mastery",
    type: "pdf", // pdf | video | image
    title: "Oval Lines Diagram",
    url: "/media/oval-lines.pdf",
    sizeKB: 420,
  },
  {
    id: "m_2",
    courseId: "crs_susp_geometry",
    type: "video",
    title: "Camber Basics",
    url: "https://example.com/camber.mp4",
    durationSec: 240,
  },
];

export const ENROLLMENTS = [
  {
    id: "en_1",
    courseId: "crs_oval_mastery",
    userId: "u1",
    completed: false,
    pct: 40,
  },
  {
    id: "en_2",
    courseId: "crs_oval_mastery",
    userId: "u2",
    completed: true,
    pct: 100,
  },
  {
    id: "en_3",
    courseId: "crs_susp_geometry",
    userId: "u1",
    completed: true,
    pct: 100,
  },
  {
    id: "en_4",
    courseId: "crs_susp_geometry",
    userId: "u3",
    completed: false,
    pct: 60,
  },
];
