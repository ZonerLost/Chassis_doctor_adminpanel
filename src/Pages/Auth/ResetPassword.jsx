import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdLock, MdLockReset, MdVisibility, MdVisibilityOff } from "react-icons/md";
import toast from "react-hot-toast";
import AuthLayout from "../../layouts/AuthLayout";
import { useTheme } from "../../contexts/ThemeContext";
import {
  getCurrentSession,
  onAuthStateChange,
  signOutAdmin,
  updatePassword,
} from "../../services/auth.service";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    form: "",
  });

  useEffect(() => {
    let active = true;

    const init = async () => {
      const session = await getCurrentSession();
      if (!active) return;
      setReady(Boolean(session?.user));
    };

    init();

    const {
      data: { subscription },
    } = onAuthStateChange((event, session) => {
      if (!active) return;

      if (event === "PASSWORD_RECOVERY" || session?.user) {
        setReady(true);
      }
    });

    return () => {
      active = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  const inputBaseStyle = useMemo(
    () => ({
      backgroundColor: colors.bg,
      color: colors.text,
      border: `2px solid ${colors.ring}`,
      boxShadow: "0 0 0 0 rgba(0,0,0,0)",
      transition: "box-shadow 120ms ease, border-color 120ms ease",
    }),
    [colors]
  );

  const validate = () => {
    const next = {
      password: "",
      confirmPassword: "",
      form: "",
    };

    if (password.length < 6) {
      next.password = "Password must be at least 6 characters.";
    }

    if (confirmPassword !== password) {
      next.confirmPassword = "Passwords do not match.";
    }

    setErrors(next);
    return !next.password && !next.confirmPassword;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!validate()) {
      toast.error("Please fix the highlighted errors.");
      return;
    }

    setLoading(true);
    setErrors((prev) => ({ ...prev, form: "" }));

    try {
      await updatePassword(password);
      await signOutAdmin();
      toast.success("Password updated successfully.");
      navigate("/login", { replace: true });
    } catch (error) {
      const message = error?.message || "Could not update password.";
      setErrors((prev) => ({ ...prev, form: message }));
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Set a new password for your admin account"
      icon={MdLockReset}
    >
      {!ready ? (
        <div className="space-y-4">
          <p className="text-sm" style={{ color: colors.text2 }}>
            Your reset session is missing or expired. Please request a new password reset email.
          </p>

          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="w-full h-11 rounded-xl text-sm font-semibold"
            style={{
              backgroundColor: colors.accent,
              color: "#0B0B0F",
            }}
          >
            Request new reset link
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="password" className="text-xs" style={{ color: colors.text2 }}>
              New password
            </label>

            <div className="relative mt-2">
              <MdLock
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                size={18}
                style={{ color: colors.text2 }}
              />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full h-11 rounded-xl pl-10 pr-10 text-sm outline-none"
                style={{
                  ...inputBaseStyle,
                  border: `2px solid ${errors.password ? "#EF4444" : colors.ring}`,
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md"
                style={{ color: colors.text2 }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
              </button>
            </div>

            {errors.password ? (
              <div className="mt-2 text-xs" style={{ color: "#EF4444" }}>
                {errors.password}
              </div>
            ) : null}
          </div>

          <div className="mt-4">
            <label htmlFor="confirmPassword" className="text-xs" style={{ color: colors.text2 }}>
              Confirm new password
            </label>

            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              className="w-full h-11 rounded-xl px-3 text-sm outline-none mt-2"
              style={{
                ...inputBaseStyle,
                border: `2px solid ${errors.confirmPassword ? "#EF4444" : colors.ring}`,
              }}
            />

            {errors.confirmPassword ? (
              <div className="mt-2 text-xs" style={{ color: "#EF4444" }}>
                {errors.confirmPassword}
              </div>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full h-11 rounded-xl text-sm font-semibold"
            style={{
              backgroundColor: colors.accent,
              color: "#0B0B0F",
              opacity: loading ? 0.85 : 1,
            }}
          >
            {loading ? "Updating..." : "Update password"}
          </button>

          {errors.form ? (
            <div className="mt-3 text-center text-sm" style={{ color: "#EF4444" }}>
              {errors.form}
            </div>
          ) : null}
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPasswordPage;