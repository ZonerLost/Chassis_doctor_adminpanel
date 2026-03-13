/*
 * Shared CORS policy helpers used by Supabase edge functions in this workspace.
 * Provides a single source of truth for allowed origins and request headers.
 */

const LOCAL_ALLOWED_ORIGINS = ["http://localhost:5174"];
const ALLOWED_HEADERS = [
  "authorization",
  "x-client-info",
  "apikey",
  "content-type",
];
const ALLOWED_METHODS = ["OPTIONS", "POST"];
const ORIGIN_ENV_KEYS = [
  "ALLOWED_ORIGINS",
  "SUPABASE_ALLOWED_ORIGINS",
  "ALLOWED_ORIGIN",
  "SITE_URL",
  "PUBLIC_SITE_URL",
  "PUBLIC_APP_URL",
  "FRONTEND_URL",
  "APP_URL",
  "VITE_SITE_URL",
  "VITE_APP_URL",
];

function normalizeOrigin(value: string) {
  return value.trim().replace(/\/+$/, "");
}

function getOriginsFromEnv() {
  return ORIGIN_ENV_KEYS.flatMap((key) =>
    String(Deno.env.get(key) || "")
      .split(",")
      .map((origin) => normalizeOrigin(origin))
      .filter(Boolean)
  );
}

export function getAllowedOrigins() {
  return Array.from(
    new Set([...LOCAL_ALLOWED_ORIGINS, ...getOriginsFromEnv()])
  );
}

export function resolveAllowedOrigin(request: Request) {
  const requestOrigin = normalizeOrigin(request.headers.get("Origin") || "");
  if (!requestOrigin) {
    return null;
  }

  return getAllowedOrigins().includes(requestOrigin) ? requestOrigin : null;
}

export function buildCorsHeaders(request: Request) {
  const allowedOrigin = resolveAllowedOrigin(request);
  const headers = new Headers({
    "Access-Control-Allow-Headers": ALLOWED_HEADERS.join(", "),
    "Access-Control-Allow-Methods": ALLOWED_METHODS.join(", "),
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  });

  if (allowedOrigin) {
    headers.set("Access-Control-Allow-Origin", allowedOrigin);
  }

  return headers;
}

export function optionsWithCors(request: Request) {
  return new Response(null, {
    status: 204,
    headers: buildCorsHeaders(request),
  });
}

export function jsonWithCors(
  request: Request,
  body: Record<string, unknown>,
  status = 200
) {
  const headers = buildCorsHeaders(request);
  headers.set("Content-Type", "application/json");

  return new Response(JSON.stringify(body), {
    status,
    headers,
  });
}
