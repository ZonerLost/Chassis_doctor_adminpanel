/*
 * Service layer for users data access, shaping, and error translation.
 * Centralizes API interaction details so UI components remain focused on presentation logic.
 */

import { supabase } from "../lib/supabaseClient";

const USER_AVATAR_BUCKET =
  import.meta.env.VITE_SUPABASE_USER_AVATAR_BUCKET || "user-avatars";
const DEFAULT_NEW_USER_ROLE = "parent";
const EXCLUDED_USER_ROLE = "system_admin";
const CREATE_USER_FUNCTION_NAME = "admin-create-user";

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

/* Shared input normalizers keep payload formatting consistent for create/update flows. */
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

/*
 * Maps low-level Supabase or edge-function errors to user-facing copy
 * that is specific enough for admins to recover quickly.
 */
function normaliseUserErrorMessage(error, fallback = "Something went wrong.") {
  const message =
    error?.message ||
    error?.error_description ||
    error?.msg ||
    fallback;

  const known = {
    "User already registered": "This email address is already in use.",
    "A user with this email address has already been registered":
      "This email address is already in use.",
    "Auth session missing!":
      "Your session is missing or expired. Please sign in again.",
    "Failed to send a request to the Edge Function":
      "Could not reach the user creation service. If you are testing locally, confirm the deployed Edge Function allows your frontend origin.",
    "Edge Function returned a non-2xx status code":
      "Could not create the user account.",
    "Origin is not allowed to access this function.":
      "This frontend origin is not allowed to create users.",
    "Server configuration is incomplete for admin-create-user.":
      "The user creation service is not configured correctly.",
  };

  return known[message] || message;
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

/*
 * Builds a database-safe payload and intentionally omits undefined values
 * so partial updates never overwrite existing fields with invalid data.
 */
function buildUserPayload(payload = {}, { isUpdate = false } = {}) {
  const normalizedRole = trimToNull(payload.role);
  const nextPayload = {
    full_name: trimToNull(payload.fullName),
    email: trimToNull(payload.email),
    status: trimToNull(payload.status) || "active",
    phone: trimToNull(payload.phone),
    location: trimToNull(payload.location),
    date_of_birth: normalizeDateOnly(payload.dob),
  };

  if (!isUpdate) {
    nextPayload.role = normalizedRole || DEFAULT_NEW_USER_ROLE;
  } else if (normalizedRole) {
    nextPayload.role = normalizedRole;
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

/*
 * Edge function failures may include structured JSON or plain text bodies.
 * This parser checks both paths before falling back to generic handling.
 */
async function getFunctionErrorMessage(error, fallback) {
  if (error?.context) {
    try {
      const payload = await error.context.json();
      const message =
        payload?.message ||
        payload?.error ||
        payload?.details?.message ||
        payload?.data?.message;
      if (message) {
        return normaliseUserErrorMessage({ message }, fallback);
      }
    } catch {
      // ignore JSON parse errors for function responses
    }

    try {
      const message = await error.context.text();
      if (message) {
        return normaliseUserErrorMessage({ message }, fallback);
      }
    } catch {
      // ignore text parse errors for function responses
    }
  }

  return normaliseUserErrorMessage(error, fallback);
}

/* Uses a server-side function so privileged user creation stays off the client. */
async function createManagedUser(payload) {
  const requestPayload = {
    fullName: trimToNull(payload.fullName),
    email: trimToNull(payload.email),
    phone: trimToNull(payload.phone),
    status: trimToNull(payload.status) || "active",
    dob: normalizeDateOnly(payload.dob),
    location: trimToNull(payload.location),
    avatarUrl: !payload.avatarFile ? trimToNull(payload.avatarUrl) : null,
    password: String(payload.password || ""),
    confirmPassword: String(payload.confirmPassword || ""),
    role: trimToNull(payload.role) || DEFAULT_NEW_USER_ROLE,
  };

  const { data, error } = await supabase.functions.invoke(
    CREATE_USER_FUNCTION_NAME,
    {
      body: requestPayload,
    }
  );

  if (error) {
    throw new Error(
      await getFunctionErrorMessage(error, "Could not create the user account.")
    );
  }

  if (data?.success === false) {
    throw new Error(
      normaliseUserErrorMessage(
        { message: data?.message || "Could not create the user account." },
        "Could not create the user account."
      )
    );
  }

  const createdRow = data?.data?.user || data?.user || data?.data || data;
  if (!createdRow?.id) {
    throw new Error("Could not create the user account.");
  }

  return createdRow;
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

  // Compose filters incrementally so optional query/status inputs stay independent.
  let request = supabase
    .from("users")
    .select(USER_SELECT, { count: "exact" })
    .neq("role", EXCLUDED_USER_ROLE)
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
  const normalizedPayload = {
    ...payload,
    role: trimToNull(payload?.role) || DEFAULT_NEW_USER_ROLE,
  };

  let nextRow = await createManagedUser(normalizedPayload);

  if (normalizedPayload?.avatarFile) {
    const avatarUrl = await uploadUserAvatar(
      nextRow.id,
      normalizedPayload.avatarFile
    );
    nextRow = await updateUserAvatarUrl(nextRow.id, avatarUrl);
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
