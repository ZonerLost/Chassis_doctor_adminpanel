export const CATEGORIES = [
  { id: "cat_susp", name: "Suspension" },
  { id: "cat_tyres", name: "Tyres" },
  { id: "cat_geom", name: "Geometry" },
  { id: "cat_align", name: "Alignment" },
];

export const ARTICLES = [
  {
    id: "a_1",
    title: "Setup Principles 101",
    categoryId: "cat_geom",
    tags: ["basics", "principles"],
    status: "published", // draft | scheduled | published
    publishAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    content:
      "<p>Core balance concepts: <strong>camber</strong>, toe, caster, and roll centers.</p>",
    version: 2,
  },
  {
    id: "a_2",
    title: "Tyre Pressures FAQ",
    categoryId: "cat_tyres",
    tags: ["faq", "pressures"],
    status: "draft",
    publishAt: null,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    content: "<p>Cold vs hot pressures, temp windows, and monitoring tips.</p>",
    version: 1,
  },
  {
    id: "a_3",
    title: "Anti‑Roll Bars Best Practices",
    categoryId: "cat_susp",
    tags: ["arb", "balance"],
    status: "published",
    publishAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
    content:
      "<p>Front vs rear ARB tuning and effects on mid‑corner balance.</p>",
    version: 3,
  },
];

export const REVISIONS = [
  {
    id: "rv_1",
    articleId: "a_1",
    version: 1,
    message: "Initial publish",
    at: Date.now() - 1000 * 60 * 60 * 24 * 12,
  },
  {
    id: "rv_2",
    articleId: "a_1",
    version: 2,
    message: "Updated camber section",
    at: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: "rv_3",
    articleId: "a_3",
    version: 2,
    message: "Added diagrams",
    at: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: "rv_4",
    articleId: "a_3",
    version: 3,
    message: "Corrected ARB rates",
    at: Date.now() - 1000 * 60 * 60 * 24 * 1,
  },
];
