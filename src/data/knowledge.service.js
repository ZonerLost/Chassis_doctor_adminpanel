import { CATEGORIES, ARTICLES, REVISIONS } from "./knowledge.fixtures";

const sleep = (ms = 120) => new Promise((r) => setTimeout(r, ms));

const db = {
  categories: [...CATEGORIES],
  articles: [...ARTICLES],
  revisions: [...REVISIONS],
};

/* -------------------------------- Categories ------------------------------- */
export async function listCategories() {
  await sleep();
  return { data: [...db.categories], total: db.categories.length };
}
export async function upsertCategory(cat) {
  await sleep();
  const idx = db.categories.findIndex((c) => c.id === cat.id);
  if (idx >= 0) db.categories[idx] = { ...db.categories[idx], ...cat };
  else db.categories.push({ ...cat, id: `cat_${Date.now()}` });
  return cat;
}

/* --------------------------------- Articles -------------------------------- */
export async function listArticles({
  page = 1,
  pageSize = 10,
  query = "",
  categoryId = "all",
  status = "all",
  tag = "",
} = {}) {
  await sleep();
  let rows = [...db.articles];
  if (query) {
    const q = query.toLowerCase();
    rows = rows.filter((a) =>
      [a.title, a.content].some((v) => String(v).toLowerCase().includes(q))
    );
  }
  if (categoryId !== "all")
    rows = rows.filter((a) => a.categoryId === categoryId);
  if (status !== "all") rows = rows.filter((a) => a.status === status);
  if (tag)
    rows = rows.filter((a) =>
      (a.tags || []).some((t) => t.toLowerCase().includes(tag.toLowerCase()))
    );
  rows.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  const total = rows.length;
  const start = (page - 1) * pageSize;
  const data = rows.slice(start, start + pageSize);
  return { data, total };
}

export async function upsertArticle(article, { message = "Edited" } = {}) {
  await sleep();
  let row = article;
  const idx = db.articles.findIndex((a) => a.id === article.id);
  if (idx >= 0) {
    const nextVersion = (db.articles[idx].version || 0) + 1;
    db.articles[idx] = row = {
      ...db.articles[idx],
      ...article,
      version: nextVersion,
      updatedAt: Date.now(),
    };
    db.revisions.push({
      id: `rv_${Date.now()}`,
      articleId: row.id,
      version: nextVersion,
      message,
      at: Date.now(),
    });
  } else {
    row = {
      ...article,
      id: `a_${Date.now()}`,
      version: 1,
      updatedAt: Date.now(),
    };
    db.articles.push(row);
    db.revisions.push({
      id: `rv_${Date.now()}`,
      articleId: row.id,
      version: 1,
      message: "Created",
      at: Date.now(),
    });
  }
  return row;
}

/* -------------------------------- Revisions -------------------------------- */
export async function listRevisions({ articleId = null } = {}) {
  await sleep();
  let rows = [...db.revisions];
  if (articleId) rows = rows.filter((r) => r.articleId === articleId);
  rows.sort((a, b) => (b.at || 0) - (a.at || 0));
  return rows;
}

/* --------------------------------- Helpers --------------------------------- */
export function getCategoryName(id) {
  return db.categories.find((c) => c.id === id)?.name || "—";
}
