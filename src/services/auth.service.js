import { supabase } from "../lib/supabaseClient";
import {
  clearPersistedAdminData,
  clearRememberedEmail,
  clearStoredAdmin,
  getResetPasswordRedirectUrl,
  isAdminRole,
  normaliseAuthErrorMessage,
  setRememberedEmail,
  setStoredAdmin,
} from "../utils/auth";

function mapAdminProfile(authUser, profileRow) {
  return {
    id: profileRow.id,
    email: authUser?.email || profileRow.email || "",
    fullName: profileRow.full_name || authUser?.user_metadata?.full_name || "",
    avatarUrl: profileRow.avatar_url || authUser?.user_metadata?.avatar_url || "",
    role: profileRow.role || "",
    status: profileRow.status || "active",
  };
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session || null;
}

export async function getProfileByUserId(userId) {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, full_name, avatar_url, role, status")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

export async function bootstrapAdminSession() {
  try {
    const session = await getCurrentSession();

    if (!session?.user?.id) {
      clearStoredAdmin();
      return null;
    }

    const profile = await getProfileByUserId(session.user.id);

    if (!isAdminRole(profile?.role)) {
      await supabase.auth.signOut();
      clearStoredAdmin();
      return null;
    }

    const admin = mapAdminProfile(session.user, profile);
    setStoredAdmin(admin);
    return admin;
  } catch {
    clearStoredAdmin();
    return null;
  }
}

export async function signInAdmin({ email, password, remember }) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) throw error;

    const user = data?.user;
    if (!user?.id) {
      throw new Error("Unable to start session.");
    }

    const profile = await getProfileByUserId(user.id);

    if (!isAdminRole(profile?.role)) {
      await supabase.auth.signOut();
      throw new Error("You do not have admin access to this panel.");
    }

    const admin = mapAdminProfile(user, profile);
    setStoredAdmin(admin);

    if (remember) {
      setRememberedEmail(email.trim());
    } else {
      clearRememberedEmail();
    }

    return admin;
  } catch (error) {
    throw new Error(normaliseAuthErrorMessage(error, "Sign in failed."));
  }
}

export async function signOutAdmin() {
  let signOutError = null;

  try {
    const { error } = await supabase.auth.signOut();
    signOutError = error || null;
  } finally {
    clearPersistedAdminData();
  }

  if (signOutError) {
    console.warn("Supabase sign-out returned an error during cleanup:", signOutError);
  }
}

export async function sendPasswordReset(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: getResetPasswordRedirectUrl(),
    });

    if (error) throw error;
    return true;
  } catch (error) {
    throw new Error(
      normaliseAuthErrorMessage(error, "Could not send password reset email.")
    );
  }
}

export async function updatePassword(password) {
  try {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return true;
  } catch (error) {
    throw new Error(
      normaliseAuthErrorMessage(error, "Could not update password.")
    );
  }
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}
