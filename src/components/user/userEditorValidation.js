/*
 * Validation rules and helper copy for the user editor create/update form.
 * Keeps form constraints centralized so drawers and modals share consistent behavior.
 */

export const USER_PASSWORD_HELPER_TEXT =
  "Minimum 8 characters, including uppercase, lowercase, and number";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+\-\s()]{7,20}$/;
const STRONG_PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export function validateUserEditorForm(
  form = {},
  { requirePassword = false } = {}
) {
  const errors = {};
  const fullName = String(form?.fullName || "").trim();
  const email = String(form?.email || "").trim();
  const phone = String(form?.phone || "").trim();
  const password = String(form?.password || "");
  const confirmPassword = String(form?.confirmPassword || "");

  if (!fullName) {
    errors.fullName = "Full name is required.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (phone && !PHONE_PATTERN.test(phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  if (requirePassword) {
    if (!password) {
      errors.password = "Password is required.";
    } else if (!STRONG_PASSWORD_PATTERN.test(password)) {
      errors.password = USER_PASSWORD_HELPER_TEXT;
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required.";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match.";
    }
  }

  return errors;
}
