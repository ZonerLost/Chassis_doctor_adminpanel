
import { supabase } from "../lib/supabaseClient";

const mapUserRow = (row) => ({
  id: row.id,
  fullName: row.full_name,
  email: row.email,
  role: row.role,
  status: row.status || "active",
  purchasedCourses: row.purchased_courses ?? 0,
  chassisUses: row.chassis_uses ?? 0,
  lastLoginAt: row.last_login_at
    ? new Date(row.last_login_at)
    : row.created_at
      ? new Date(row.created_at)
      : new Date(),
  lastLoginIp: row.last_login_ip || "",
  device: row.device || "Web",
});

export async function listUsers({
  page = 1,
  pageSize = 10,
  query = "",
  role = "all",
  status = "all",
} = {}) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let q = supabase
    .from("users")
    .select(
      "id, created_at, email, full_name, role, status, purchased_courses, chassis_uses, last_login_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (query) {
    const qLower = `%${query.toLowerCase()}%`;
    q = q.or(`full_name.ilike.${qLower},email.ilike.${qLower}`);
  }
  if (role !== "all") q = q.eq("role", role);
  if (status !== "all") q = q.eq("status", status);

  const { data, error, count } = await q;
  if (error) throw error;
  const rows = data || [];
  const mapped = rows.map(mapUserRow);
  return { data: mapped, total: typeof count === "number" ? count : mapped.length };
}

export async function createUser(payload) {
  const dbPayload = {
    full_name: payload.fullName || payload.name || "New User",
    email: payload.email || "",
    role: payload.role || "driver",
    status: payload.status || "active",
    purchased_courses: payload.purchasedCourses ?? 0,
    chassis_uses: payload.chassisUses ?? 0,
    last_login_at: payload.lastLoginAt || null,
  };

  const { data, error } = await supabase
    .from("users")
    .insert(dbPayload)
    .select()
    .single();
  if (error) throw error;
  return mapUserRow(data);
}

export async function updateUser(id, patch) {
  const dbPatch = {
    full_name: patch.fullName,
    email: patch.email,
    role: patch.role,
    status: patch.status,
    purchased_courses: patch.purchasedCourses,
    chassis_uses: patch.chassisUses,
    last_login_at: patch.lastLoginAt || null,
  };

  Object.keys(dbPatch).forEach((key) => {
    if (typeof dbPatch[key] === "undefined") delete dbPatch[key];
  });

  const { data, error } = await supabase
    .from("users")
    .update(dbPatch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapUserRow(data);
}

export async function getUser(id) {
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, created_at, email, full_name, role, status, purchased_courses, chassis_uses, last_login_at"
    )
    .eq("id", id)
    .single();
  if (error) throw error;
  return mapUserRow(data);
}

export async function deleteUser(id) {
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) throw error;
  return true;
}
