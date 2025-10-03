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

export const SAMPLE_COURSES = [
  {
    id: 1,
    title: "Racing Fundamentals",
    level: "Beginner",
    instructor: "John Smith",
    type: "Video Course",
    duration: "4 hours",
    students: 1250,
    rating: 4.8,
    price: 99.99,
    status: "Published",
    createdAt: "2024-01-15",
    description:
      "Learn the basics of professional racing including cornering, braking, and acceleration techniques.",
    categories: ["Racing", "Fundamentals"],
    thumbnail: "/course-thumbnails/racing-fundamentals.jpg",
  },
  {
    id: 2,
    title: "Advanced Chassis Setup",
    level: "Advanced",
    instructor: "Sarah Johnson",
    type: "Workshop",
    duration: "8 hours",
    students: 480,
    rating: 4.9,
    price: 299.99,
    status: "Published",
    createdAt: "2024-02-10",
    description:
      "Master advanced chassis tuning for optimal performance on different track conditions.",
    categories: ["Chassis", "Advanced"],
    thumbnail: "/course-thumbnails/chassis-setup.jpg",
  },
  {
    id: 3,
    title: "Tire Management Strategies",
    level: "Intermediate",
    instructor: "Mike Wilson",
    type: "Video Course",
    duration: "3.5 hours",
    students: 850,
    rating: 4.7,
    price: 149.99,
    status: "Published",
    createdAt: "2024-02-20",
    description:
      "Learn how to maximize tire performance and longevity during races.",
    categories: ["Tires", "Strategy"],
    thumbnail: "/course-thumbnails/tire-management.jpg",
  },
  {
    id: 4,
    title: "Aerodynamics for Speed",
    level: "Advanced",
    instructor: "Dr. Emma Davis",
    type: "Masterclass",
    duration: "6 hours",
    students: 320,
    rating: 4.9,
    price: 399.99,
    status: "Draft",
    createdAt: "2024-03-01",
    description:
      "Understanding aerodynamic principles and their application in motorsports.",
    categories: ["Aerodynamics", "Performance"],
    thumbnail: "/course-thumbnails/aerodynamics.jpg",
  },
  {
    id: 5,
    title: "Mental Preparation for Racing",
    level: "All Levels",
    instructor: "Lisa Brown",
    type: "Workshop",
    duration: "4 hours",
    students: 650,
    rating: 4.6,
    price: 199.99,
    status: "Published",
    createdAt: "2024-03-15",
    description:
      "Develop mental toughness and focus techniques for competitive racing.",
    categories: ["Psychology", "Performance"],
    thumbnail: "/course-thumbnails/mental-prep.jpg",
  },
];

export const COURSE_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "All Levels",
];
export const COURSE_TYPES = [
  "Video Course",
  "Workshop",
  "Masterclass",
  "Live Session",
];
export const COURSE_CATEGORIES = [
  "Racing",
  "Fundamentals",
  "Chassis",
  "Advanced",
  "Tires",
  "Strategy",
  "Aerodynamics",
  "Performance",
  "Psychology",
];
