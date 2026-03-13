/*
 * Shared CORS policy helpers used by Supabase edge functions in this workspace.
 * Provides a single source of truth for allowed origins, headers, and methods.
 */

const STATIC_ALLOWED_ORIGINS = ["http://localhost:5174", "http://localhost:5173"];
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

export const ALLOWED_HEADERS = [
  "authorization",
  "x-client-info",
  "apikey",
  "content-type",
];

export const ALLOWED_METHODS = ["POST", "OPTIONS"];

function normalizeOrigin(value: string | null | undefined) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function getOriginsFromEnv() {
  return ORIGIN_ENV_KEYS.flatMap((key) =>
    String(Deno.env.get(key) || "")
      .split(",")
      .map((origin) => normalizeOrigin(origin))
      .filter(Boolean)
  );
}

export const ALLOWED_ORIGINS = Array.from(
  new Set([...STATIC_ALLOWED_ORIGINS, ...getOriginsFromEnv()])
);

const DEFAULT_ALLOW_ORIGIN = ALLOWED_ORIGINS[0] || "http://localhost:5174";

export function isAllowedOrigin(origin: string | null | undefined) {
  const normalizedOrigin = normalizeOrigin(origin);
  if (!normalizedOrigin) return false;
  return ALLOWED_ORIGINS.includes(normalizedOrigin);
}

export function getCorsHeaders(origin: string | null | undefined) {
  const normalizedOrigin = normalizeOrigin(origin);
  const allowOrigin = isAllowedOrigin(normalizedOrigin)
    ? normalizedOrigin
    : DEFAULT_ALLOW_ORIGIN;

  return new Headers({
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": ALLOWED_HEADERS.join(", "),
    "Access-Control-Allow-Methods": ALLOWED_METHODS.join(", "),
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  });
}
