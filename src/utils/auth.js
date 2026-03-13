/*
 * Utility module for auth helpers reused across services and UI features.
 * Applies consistent data normalization and formatting rules throughout the app.
 */

export const AUTH_PROFILE_STORAGE_KEY = "motorsport-admin-auth";
export const AUTH_REMEMBER_EMAIL_KEY = "motorsport-admin-remember-email";
export const SUPABASE_AUTH_STORAGE_KEY = "motorsport-admin-supabase-auth";
export const ADMIN_PROFILE_STORAGE_KEY = "admin_profile";
export const ADMIN_PROFILE_UPDATED_EVENT = "motorsport-admin-profile-updated";
export const ADMIN_ROLES = ["system_admin", "admin"];
const LEGACY_AUTH_STORAGE_KEYS = ["auth_token", "user"];

export function isAdminRole(role = "") {
  return ADMIN_ROLES.includes(String(role).trim().toLowerCase());
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normaliseStoredAdmin(admin) {
  if (!admin || typeof admin !== "object") return null;

  return {
    id: admin.id || "",
    email: admin.email || "",
    fullName: admin.fullName || admin.name || "",
    avatarUrl: admin.avatarUrl || admin.avatar || "",
    role: admin.role || "",
    status: admin.status || "",
  };
}

function dispatchAdminProfileUpdate(admin) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(ADMIN_PROFILE_UPDATED_EVENT, {
      detail: admin || null,
    })
  );
}

export function getStoredAdmin() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(AUTH_PROFILE_STORAGE_KEY);
  return raw ? normaliseStoredAdmin(safeJsonParse(raw)) : null;
}

export function setStoredAdmin(admin) {
  if (typeof window === "undefined") return;

  const current = getStoredAdmin() || {};
  const nextAdmin = normaliseStoredAdmin({
    ...current,
    ...admin,
  });

  window.localStorage.setItem(
    AUTH_PROFILE_STORAGE_KEY,
    JSON.stringify(nextAdmin)
  );
  dispatchAdminProfileUpdate(nextAdmin);
}

export function clearStoredAdmin() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_PROFILE_STORAGE_KEY);
  dispatchAdminProfileUpdate(null);
}

function removeKeyFromBrowserStorage(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage access failures during logout cleanup.
  }

  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Ignore storage access failures during logout cleanup.
  }
}

export function clearAdminSessionStorage() {
  if (typeof window === "undefined") return;

  [
    AUTH_PROFILE_STORAGE_KEY,
    SUPABASE_AUTH_STORAGE_KEY,
    ...LEGACY_AUTH_STORAGE_KEYS,
  ].forEach(removeKeyFromBrowserStorage);
}

export function clearPersistedAdminData() {
  if (typeof window === "undefined") return;

  clearAdminSessionStorage();
  [AUTH_REMEMBER_EMAIL_KEY, ADMIN_PROFILE_STORAGE_KEY].forEach(
    removeKeyFromBrowserStorage
  );
}

export function getRememberedEmail() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(AUTH_REMEMBER_EMAIL_KEY) || "";
}

export function setRememberedEmail(email) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_REMEMBER_EMAIL_KEY, email);
}

export function clearRememberedEmail() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_REMEMBER_EMAIL_KEY);
}

export function getResetPasswordRedirectUrl() {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/reset-password`;
}

export function normaliseAuthErrorMessage(error, fallback = "Something went wrong.") {
  const rawMessage =
    error?.message ||
    error?.error_description ||
    error?.msg ||
    fallback;

  const known = {
    "Invalid login credentials": "Invalid email or password.",
    "Email not confirmed": "Please confirm your email before signing in.",
    "Auth session missing!": "Your reset session is missing or expired. Please request a new reset link.",
    "New password should be different from the old password.":
      "Please choose a different password than your current one.",
    "Password should be at least 6 characters.":
      "Password must be at least 6 characters.",
    "For security purposes, you can only request this after":
      "Please wait a little before requesting another reset email.",
  };

  const directMatch = known[rawMessage];
  if (directMatch) return directMatch;

  if (rawMessage.includes("For security purposes")) {
    return "Please wait a little before requesting another reset email.";
  }

  return rawMessage;
}
