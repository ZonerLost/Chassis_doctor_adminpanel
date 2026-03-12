import { supabase } from "../lib/supabaseClient";

const USER_AVATAR_BUCKET =
  import.meta.env.VITE_SUPABASE_USER_AVATAR_BUCKET || "user-avatars";

const USER_SELECT = [
  "id",
  "created_at",
  "email",
  "full_name",
  "role",
  "status",
  "phone",
  "location",
  "date_of_birth",
  "avatar_url",
  "last_login_at",
].join(", ");

function trimToNull(value) {
  const normalized = String(value ?? "").trim();
  return normalized || null;
}

function normalizeDateOnly(value) {
  const normalized = String(value ?? "").trim();
  return normalized ? normalized.slice(0, 10) : null;
}

function toDateOrNull(value) {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function sanitizeSearchTerm(value) {
  return String(value || "")
    .trim()
    .replace(/[,%()]/g, " ");
}

function mapUserRow(row = {}) {
  return {
    id: row.id,
    fullName: row.full_name || "",
    email: row.email || "",
    role: row.role || "",
    status: row.status || "active",
    phone: row.phone || "",
    location: row.location || "",
    dob: row.date_of_birth ? String(row.date_of_birth).slice(0, 10) : "",
    avatarUrl: row.avatar_url || "",
    lastLoginAt: toDateOrNull(row.last_login_at || row.created_at),
  };
}

function buildUserPayload(payload = {}, { isUpdate = false } = {}) {
  const nextPayload = {
    full_name: trimToNull(payload.fullName),
    email: trimToNull(payload.email),
    status: trimToNull(payload.status) || "active",
    phone: trimToNull(payload.phone),
    location: trimToNull(payload.location),
    date_of_birth: normalizeDateOnly(payload.dob),
  };

  if (!isUpdate) {
    nextPayload.role = trimToNull(payload.role) || "driver";
  } else if (typeof payload.role !== "undefined") {
    nextPayload.role = trimToNull(payload.role);
  }

  if (!payload.avatarFile && typeof payload.avatarUrl !== "undefined") {
    nextPayload.avatar_url = trimToNull(payload.avatarUrl);
  }

  Object.keys(nextPayload).forEach((key) => {
    if (typeof nextPayload[key] === "undefined") {
      delete nextPayload[key];
    }
  });

  return nextPayload;
}

async function uploadUserAvatar(userId, file) {
  if (!file) return null;

  const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
  const fileName = `${Date.now()}-${safeName}`;
  const filePath = `${userId}/${fileName}`;

  const { error } = await supabase.storage
    .from(USER_AVATAR_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(error.message || "Could not upload avatar.");
  }

  const { data } = supabase.storage
    .from(USER_AVATAR_BUCKET)
    .getPublicUrl(filePath);

  return data?.publicUrl || "";
}

async function updateUserAvatarUrl(userId, avatarUrl) {
  const { data, error } = await supabase
    .from("users")
    .update({ avatar_url: avatarUrl })
    .eq("id", userId)
    .select(USER_SELECT)
    .single();

  if (error) throw error;
  return data;
}

export async function listUsers({
  page = 1,
  pageSize = 15,
  query = "",
  status = "",
} = {}) {
  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.max(1, Number(pageSize) || 15);
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  let request = supabase
    .from("users")
    .select(USER_SELECT, { count: "exact" })
    .neq("role", "system_admin")
    .order("created_at", { ascending: false })
    .range(from, to);

  const normalizedStatus = trimToNull(status);
  if (normalizedStatus) {
    request = request.eq("status", normalizedStatus);
  }

  const normalizedQuery = sanitizeSearchTerm(query);
  if (normalizedQuery) {
    const pattern = `%${normalizedQuery}%`;
    request = request.or(
      `full_name.ilike.${pattern},email.ilike.${pattern},phone.ilike.${pattern},location.ilike.${pattern}`
    );
  }

  const { data, error, count } = await request;

  if (error) throw error;

  const mappedRows = (data || []).map(mapUserRow);
  return {
    data: mappedRows,
    total: typeof count === "number" ? count : mappedRows.length,
  };
}

export async function createUser(payload) {
  const dbPayload = buildUserPayload(payload);

  const { data, error } = await supabase
    .from("users")
    .insert(dbPayload)
    .select(USER_SELECT)
    .single();

  if (error) throw error;

  let nextRow = data;

  if (payload?.avatarFile) {
    const avatarUrl = await uploadUserAvatar(data.id, payload.avatarFile);
    nextRow = await updateUserAvatarUrl(data.id, avatarUrl);
  }

  return mapUserRow(nextRow);
}

export async function updateUser(id, payload) {
  const dbPatch = buildUserPayload(payload, { isUpdate: true });

  if (payload?.avatarFile) {
    dbPatch.avatar_url = await uploadUserAvatar(id, payload.avatarFile);
  }

  const { data, error } = await supabase
    .from("users")
    .update(dbPatch)
    .eq("id", id)
    .select(USER_SELECT)
    .single();

  if (error) throw error;
  return mapUserRow(data);
}

export async function deleteUser(id) {
  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) throw error;
  return true;
}
