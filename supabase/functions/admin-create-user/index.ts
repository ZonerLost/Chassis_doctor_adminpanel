/*
 * Supabase edge function that creates admin-managed user accounts via secure server context.
 * Validates request payloads before invoking privileged auth and metadata operations.
 */

import { createClient } from "npm:@supabase/supabase-js@2";
import {
  getCorsHeaders,
  isAllowedOrigin,
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

/*
 * Deployment and verification checklist:
 * 1) Redeploy this function after updating CORS behavior.
 * 2) Verify preflight:
 *    curl -i -X OPTIONS \
 *      -H "Origin: http://localhost:5174" \
 *      -H "Access-Control-Request-Method: POST" \
 *      -H "Access-Control-Request-Headers: authorization,apikey,content-type,x-client-info" \
 *      https://pmhsmskjxywqtkyhdvgj.supabase.co/functions/v1/admin-create-user
 * 3) Confirm OPTIONS returns 200/204 and POST calls proceed in the browser.
 */

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

function jsonResponse(
  corsHeaders: Headers,
  body: Record<string, unknown>,
  status = 200
) {
  const headers = new Headers(corsHeaders);
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(body), { status, headers });
}

function errorResponse(
  corsHeaders: Headers,
  status: number,
  message: string,
  code: string,
  details?: Record<string, unknown>
) {
  return jsonResponse(
    corsHeaders,
    {
      success: false,
      message,
      code,
      ...(details ? { details } : {}),
    },
    status
  );
}

function successResponse(
  corsHeaders: Headers,
  data: Record<string, unknown>,
  status = 200
) {
  return jsonResponse(corsHeaders, { success: true, data }, status);
}

Deno.serve(async (request) => {
  const requestOrigin = request.headers.get("origin");
  const originAllowed = isAllowedOrigin(requestOrigin);
  const corsHeaders = getCorsHeaders(requestOrigin);

  console.info("[admin-create-user] request received", {
    method: request.method,
    origin: requestOrigin || null,
    originAllowed,
  });

  // Handle preflight before method, auth, or payload checks.
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    console.warn("[admin-create-user] rejected: method_not_allowed", {
      method: request.method,
    });
    return errorResponse(
      corsHeaders,
      405,
      "Method not allowed.",
      "method_not_allowed"
    );
  }

  if (requestOrigin && !originAllowed) {
    console.warn("[admin-create-user] rejected: origin_not_allowed", {
      origin: requestOrigin,
    });
    return errorResponse(
      corsHeaders,
      403,
      "Origin is not allowed to access this function.",
      "origin_not_allowed"
    );
  }

  let failureStep = "config";

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
    const SUPABASE_SERVICE_ROLE_KEY =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
      Deno.env.get("SUPABASE_SECRET_KEY") ||
      "";

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[admin-create-user] rejected: server_config_missing");
      return errorResponse(
        corsHeaders,
        500,
        "Server configuration is incomplete for admin-create-user.",
        "server_config_missing"
      );
    }

    failureStep = "auth_token";
    const authorization = request.headers.get("authorization");
    const accessToken = authorization?.replace("Bearer ", "").trim();

    if (!accessToken) {
      console.warn("[admin-create-user] rejected: unauthorized_missing_token");
      return errorResponse(corsHeaders, 401, "Unauthorized.", "unauthorized");
    }

    failureStep = "auth_verify";
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
      console.warn("[admin-create-user] rejected: auth_verify_failed");
      return errorResponse(
        corsHeaders,
        401,
        normalizeErrorMessage(authError, "Unauthorized."),
        "unauthorized"
      );
    }

    failureStep = "role_check";
    const { data: requesterProfile, error: requesterError } = await adminClient
      .from("users")
      .select("role")
      .eq("id", authData.user.id)
      .maybeSingle();

    if (requesterError) {
      console.error("[admin-create-user] failed: requester_role_lookup", {
        message: normalizeErrorMessage(
          requesterError,
          "Could not verify admin permissions."
        ),
      });
      return errorResponse(
        corsHeaders,
        500,
        normalizeErrorMessage(
          requesterError,
          "Could not verify admin permissions."
        ),
        "permission_check_failed"
      );
    }

    const requesterRole = String(requesterProfile?.role || "")
      .trim()
      .toLowerCase();

    if (!ADMIN_ROLES.has(requesterRole)) {
      console.warn("[admin-create-user] rejected: unauthorized_role", {
        role: requesterRole || null,
      });
      return errorResponse(
        corsHeaders,
        403,
        "You do not have permission to create users.",
        "forbidden"
      );
    }

    failureStep = "payload_parse";
    let payload: Record<string, unknown> = {};
    try {
      payload = (await request.json()) || {};
    } catch {
      console.warn("[admin-create-user] rejected: invalid_payload_json");
      return errorResponse(
        corsHeaders,
        400,
        "Invalid request payload.",
        "invalid_payload"
      );
    }

    failureStep = "payload_validate";
    const validationErrors = validatePayload(payload);
    if (Object.keys(validationErrors).length > 0) {
      return errorResponse(
        corsHeaders,
        400,
        Object.values(validationErrors)[0],
        "validation_error",
        { validationErrors }
      );
    }

    const role = trimToNull(payload.role) || DEFAULT_NEW_USER_ROLE;
    const fullName = String(payload.fullName || "").trim();
    const email = String(payload.email || "").trim();
    const password = String(payload.password || "");
    const emailDomain = email.includes("@") ? email.split("@")[1] : null;

    console.info("[admin-create-user] creating managed user", {
      role,
      status: trimToNull(payload.status) || "active",
      hasAvatarUrl: Boolean(trimToNull(payload.avatarUrl)),
      emailDomain,
    });

    failureStep = "auth_create";
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
      const createErrorMessage = normalizeErrorMessage(
        createAuthError,
        "Could not create the user account."
      );
      return errorResponse(
        corsHeaders,
        400,
        createErrorMessage,
        createErrorMessage === "This email address is already in use."
          ? "duplicate_email"
          : "create_user_failed"
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

    failureStep = "profile_upsert";
    const { data: createdProfile, error: profileError } = await adminClient
      .from("users")
      .upsert(profilePayload, { onConflict: "id" })
      .select(USER_SELECT)
      .single();

    if (profileError || !createdProfile?.id) {
      await adminClient.auth.admin.deleteUser(createdUserId).catch(() => {});

      return errorResponse(
        corsHeaders,
        400,
        normalizeErrorMessage(
          profileError,
          "Could not save the user profile."
        ),
        "profile_save_failed"
      );
    }

    console.info("[admin-create-user] user creation completed", {
      createdUserId,
      role,
    });

    return successResponse(corsHeaders, { user: createdProfile }, 201);
  } catch (error) {
    console.error("[admin-create-user] unexpected failure", {
      failureStep,
      message: normalizeErrorMessage(
        error,
        "Unexpected server failure while creating user."
      ),
    });
    return errorResponse(
      corsHeaders,
      500,
      "Unexpected server failure while creating user.",
      "unexpected_error"
    );
  }
});
