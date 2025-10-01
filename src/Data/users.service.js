import { USERS_FIXTURES } from "./users.fixtures";

export async function listUsers({
  page = 1,
  pageSize = 10,
  query = "",
  role = "all",
  status = "all",
} = {}) {
  // simulate network
  await new Promise((r) => setTimeout(r, 150));
  let rows = USERS_FIXTURES;
  if (query) {
    const q = query.toLowerCase();
    rows = rows.filter((u) =>
      [u.fullName, u.email, u.role].some((f) =>
        String(f).toLowerCase().includes(q)
      )
    );
  }
  if (role !== "all") rows = rows.filter((u) => u.role === role);
  if (status !== "all") rows = rows.filter((u) => u.status === status);
  const total = rows.length;
  const start = (page - 1) * pageSize;
  const data = rows.slice(start, start + pageSize);
  return { data, total };
}

export async function updateUser(id, patch) {
  await new Promise((r) => setTimeout(r, 120));
  const idx = USERS_FIXTURES.findIndex((u) => u.id === id);
  if (idx >= 0) Object.assign(USERS_FIXTURES[idx], patch);
  return USERS_FIXTURES[idx];
}

export async function getUser(id) {
  await new Promise((r) => setTimeout(r, 100));
  return USERS_FIXTURES.find((u) => u.id === id);
}
