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

export const mockCourseCatalog = [
  {
    id: 1,
    title: "Introduction to Formula 1",
    level: "beginner",
    isPaid: false,
    priceCents: 0,
    summary: "Learn the basics of Formula 1 racing and history",
    instructorName: "Lewis Hamilton",
    instructorEmail: "lewis@motorsport.com",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-20T10:30:00Z",
  },
  {
    id: 2,
    title: "Advanced Chassis Setup",
    level: "advanced",
    isPaid: true,
    priceCents: 9999,
    summary: "Master the art of chassis tuning and optimization",
    instructorName: "Adrian Newey",
    instructorEmail: "adrian@motorsport.com",
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-25T14:15:00Z",
  },
  {
    id: 3,
    title: "Tire Management Strategies",
    level: "intermediate",
    isPaid: true,
    priceCents: 7500,
    summary: "Understanding tire compounds and race strategy",
    instructorName: "Pirelli Expert",
    instructorEmail: "expert@motorsport.com",
    createdAt: "2024-01-12T11:00:00Z",
    updatedAt: "2024-01-22T16:45:00Z",
  },
];

export const mockCourseMedia = [
  // Media-related mock data
];

export const mockCoursePricing = [
  // Pricing-related mock data
];

export const mockCourseProgress = [
  // Progress-related mock data
];
