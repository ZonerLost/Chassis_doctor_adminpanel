/*
 * Supabase edge function that creates admin-managed user accounts via secure server context.
 * Validates request payloads before invoking privileged auth and metadata operations.
 */

import { createClient } from "npm:@supabase/supabase-js@2";
import {
  jsonWithCors,
  optionsWithCors,
  resolveAllowedOrigin,
} from "../_shared/cors.ts";

const DEFAULT_NEW_USER_ROLE = "parent";
const ADMIN_ROLES = new Set(["system_admin", "admin"]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRONG_PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
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

function trimToNull(value: unknown) {
  const normalized = String(value ?? "").trim();
  return normalized || null;
}

function normalizeDateOnly(value: unknown) {
  const normalized = String(value ?? "").trim();
  return normalized ? normalized.slice(0, 10) : null;
}

function normalizeErrorMessage(error: unknown, fallback: string) {
  const rawMessage =
    error && typeof error === "object"
      ? String(
          (error as { message?: string; error_description?: string }).message ||
            (error as { message?: string; error_description?: string })
              .error_description ||
            fallback
        )
      : fallback;

  const known: Record<string, string> = {
    "User already registered": "This email address is already in use.",
    "A user with this email address has already been registered":
      "This email address is already in use.",
    "Auth session missing!": "Your session is missing or expired. Please sign in again.",
  };

  return known[rawMessage] || rawMessage;
}

function validatePayload(payload: Record<string, unknown>) {
  const errors: Record<string, string> = {};
  const fullName = String(payload.fullName || "").trim();
  const email = String(payload.email || "").trim();
  const password = String(payload.password || "");
  const confirmPassword = String(payload.confirmPassword || "");

  if (!fullName) {
    errors.fullName = "Full name is required.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (!STRONG_PASSWORD_PATTERN.test(password)) {
    errors.password =
      "Password must be at least 8 characters and include uppercase, lowercase, and a number.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirm password is required.";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return optionsWithCors(request);
  }

  const requestOrigin = request.headers.get("Origin");
  const allowedOrigin = resolveAllowedOrigin(request);

  if (requestOrigin && !allowedOrigin) {
    return jsonWithCors(
      request,
      { error: "Origin is not allowed to access this function." },
      403
    );
  }

  if (request.method !== "POST") {
    return jsonWithCors(request, { error: "Method not allowed." }, 405);
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
  const SUPABASE_SERVICE_ROLE_KEY =
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return jsonWithCors(
      request,
      {
        error:
          "Server configuration is incomplete for admin-create-user.",
      },
      500
    );
  }

  const authorization = request.headers.get("Authorization");
  const accessToken = authorization?.replace("Bearer ", "").trim();

  if (!accessToken) {
    return jsonWithCors(request, { error: "Unauthorized." }, 401);
  }

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const {
    data: authData,
    error: authError,
  } = await adminClient.auth.getUser(accessToken);

  if (authError || !authData?.user?.id) {
    return jsonWithCors(
      request,
      { error: normalizeErrorMessage(authError, "Unauthorized.") },
      401
    );
  }

  const { data: requesterProfile, error: requesterError } = await adminClient
    .from("users")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (requesterError) {
    return jsonWithCors(
      request,
      {
        error: normalizeErrorMessage(
          requesterError,
          "Could not verify admin permissions."
        ),
      },
      500
    );
  }

  const requesterRole = String(requesterProfile?.role || "")
    .trim()
    .toLowerCase();

  if (!ADMIN_ROLES.has(requesterRole)) {
    return jsonWithCors(
      request,
      { error: "You do not have permission to create users." },
      403
    );
  }

  let payload: Record<string, unknown> = {};

  try {
    payload = (await request.json()) || {};
  } catch {
    return jsonWithCors(request, { error: "Invalid request payload." }, 400);
  }

  const validationErrors = validatePayload(payload);
  if (Object.keys(validationErrors).length > 0) {
    return jsonWithCors(
      request,
      {
        error: Object.values(validationErrors)[0],
        validationErrors,
      },
      400
    );
  }

  const role = trimToNull(payload.role) || DEFAULT_NEW_USER_ROLE;
  const fullName = String(payload.fullName || "").trim();
  const email = String(payload.email || "").trim();
  const password = String(payload.password || "");

  const { data: createdAuth, error: createAuthError } =
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      },
    });

  if (createAuthError || !createdAuth?.user?.id) {
    return jsonWithCors(
      request,
      {
        error: normalizeErrorMessage(
          createAuthError,
          "Could not create the user account."
        ),
      },
      400
    );
  }

  const createdUserId = createdAuth.user.id;
  const profilePayload = {
    id: createdUserId,
    full_name: fullName,
    email,
    phone: trimToNull(payload.phone),
    status: trimToNull(payload.status) || "active",
    location: trimToNull(payload.location),
    date_of_birth: normalizeDateOnly(payload.dob),
    avatar_url: trimToNull(payload.avatarUrl),
    role,
  };

  const { data: createdProfile, error: profileError } = await adminClient
    .from("users")
    .upsert(profilePayload, { onConflict: "id" })
    .select(USER_SELECT)
    .single();

  if (profileError || !createdProfile?.id) {
    await adminClient.auth.admin.deleteUser(createdUserId).catch(() => {});

    return jsonWithCors(
      request,
      {
        error: normalizeErrorMessage(
          profileError,
          "Could not save the user profile."
        ),
      },
      400
    );
  }

  return jsonWithCors(request, { user: createdProfile }, 201);
});
