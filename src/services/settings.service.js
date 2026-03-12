import { supabase } from "../lib/supabaseClient";
import {
  getStoredAdmin,
  setStoredAdmin,
} from "../utils/auth";

const LEGACY_PROFILE_KEY = "admin_profile";
const AVATAR_BUCKET = "user-avatars";
const AVATAR_FOLDER = "avatars";
const PROFILE_FIELDS = "id,email,full_name,avatar_url";

function getResetRedirectUrl() {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/reset-password`;
}

function getFileExtension(file) {
  const byName = file?.name?.split(".")?.pop()?.toLowerCase();
  if (byName) return byName;

  const byType = file?.type?.split("/")?.pop()?.toLowerCase();
  return byType || "jpg";
}

function mapProfileRow(row, authUser) {
  return {
    id: row?.id || authUser?.id || "",
    fullName:
      row?.full_name ||
      authUser?.user_metadata?.full_name ||
      "",
    email: row?.email || authUser?.email || "",
    avatarUrl:
      row?.avatar_url ||
      authUser?.user_metadata?.avatar_url ||
      "",
  };
}

function updateStoredAdminProfile(profile) {
  if (typeof window === "undefined") return;

  try {
    const current = getStoredAdmin() || {};

    setStoredAdmin({
      ...current,
      id: profile.id,
      fullName: profile.fullName,
      email: profile.email,
      avatarUrl: profile.avatarUrl,
    });

    window.localStorage.setItem(
      LEGACY_PROFILE_KEY,
      JSON.stringify({
        name: profile.fullName,
        email: profile.email,
        avatar: profile.avatarUrl,
      })
    );
  } catch {
    // ignore storage errors
  }
}

async function getAuthUserOrThrow() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user?.id) {
    throw new Error("No authenticated admin session found.");
  }

  return user;
}

async function ensureAdminProfileRow(authUser) {
  const fallbackRow = {
    id: authUser.id,
    email: authUser.email || "",
    full_name: authUser.user_metadata?.full_name || "",
    avatar_url: authUser.user_metadata?.avatar_url || "",
  };

  const { data, error } = await supabase
    .from("users")
    .select(PROFILE_FIELDS)
    .eq("id", authUser.id)
    .maybeSingle();

  if (error) throw error;

  if (data) return data;

  const { data: created, error: createError } = await supabase
    .from("users")
    .upsert(
      {
        ...fallbackRow,
        role: "system_admin",
        status: "active",
      },
      { onConflict: "id" }
    )
    .select(PROFILE_FIELDS)
    .single();

  if (createError) throw createError;
  return created;
}

async function uploadAdminAvatar(file, userId) {
  if (!file || !userId) return "";

  const ext = getFileExtension(file);
  const filePath = `${AVATAR_FOLDER}/${userId}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type || undefined,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);
  return data?.publicUrl || "";
}

function normaliseErrorMessage(error, fallback) {
  const message =
    error?.message ||
    error?.error_description ||
    fallback;

  const known = {
    "Auth session missing!":
      "Your session is missing or expired. Please sign in again.",
    "New password should be different from the old password.":
      "Please choose a different password than your current one.",
    "Password should be at least 6 characters.":
      "Password must be at least 6 characters.",
    "User already registered":
      "This email address is already in use.",
  };

  if (known[message]) return known[message];
  if (message.includes("For security purposes")) {
    return "Please wait a little before requesting another reset email.";
  }

  return message;
}

export async function getCurrentAdminProfile() {
  try {
    const authUser = await getAuthUserOrThrow();
    const row = await ensureAdminProfileRow(authUser);
    const profile = mapProfileRow(row, authUser);
    updateStoredAdminProfile(profile);
    return profile;
  } catch (error) {
    throw new Error(
      normaliseErrorMessage(error, "Failed to load admin profile.")
    );
  }
}

export async function updateCurrentAdminProfile({
  fullName,
  email,
  avatarFile,
}) {
  try {
    const authUser = await getAuthUserOrThrow();
    const currentRow = await ensureAdminProfileRow(authUser);

    let nextAvatarUrl = currentRow?.avatar_url || "";

    if (avatarFile) {
      nextAvatarUrl = await uploadAdminAvatar(avatarFile, authUser.id);
    }

    const trimmedName = String(fullName || "").trim();
    const trimmedEmail = String(email || "").trim();

    const authPayload = {
      data: {
        full_name: trimmedName,
        avatar_url: nextAvatarUrl,
      },
    };

    const emailChanged =
      trimmedEmail &&
      trimmedEmail.toLowerCase() !== String(authUser.email || "").toLowerCase();

    if (emailChanged) {
      authPayload.email = trimmedEmail;
    }

    const { error: authUpdateError } = await supabase.auth.updateUser(authPayload);
    if (authUpdateError) throw authUpdateError;

    const { data: savedRow, error: profileUpdateError } = await supabase
      .from("users")
      .upsert(
        {
          id: authUser.id,
          full_name: trimmedName,
          email: trimmedEmail || authUser.email || "",
          avatar_url: nextAvatarUrl,
          role: "system_admin",
          status: "active",
        },
        { onConflict: "id" }
      )
      .select(PROFILE_FIELDS)
      .single();

    if (profileUpdateError) throw profileUpdateError;

    const profile = mapProfileRow(savedRow, {
      ...authUser,
      email: trimmedEmail || authUser.email || "",
      user_metadata: {
        ...authUser.user_metadata,
        full_name: trimmedName,
        avatar_url: nextAvatarUrl,
      },
    });

    updateStoredAdminProfile(profile);

    return {
      profile,
      emailChangeRequested: emailChanged,
    };
  } catch (error) {
    throw new Error(
      normaliseErrorMessage(error, "Failed to update admin profile.")
    );
  }
}

export async function changeCurrentAdminPassword(newPassword) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    throw new Error(
      normaliseErrorMessage(error, "Failed to update password.")
    );
  }
}

export async function sendAdminPasswordResetEmail() {
  try {
    const authUser = await getAuthUserOrThrow();

    if (!authUser.email) {
      throw new Error("No admin email found for password reset.");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(authUser.email, {
      redirectTo: getResetRedirectUrl(),
    });

    if (error) throw error;
    return true;
  } catch (error) {
    throw new Error(
      normaliseErrorMessage(error, "Failed to send reset email.")
    );
  }
}
