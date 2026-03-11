import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MdCheckCircle,
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import toast from "react-hot-toast";
import AuthLayout from "../../layouts/AuthLayout";
import { useTheme } from "../../contexts/ThemeContext";
import { getRememberedEmail } from "../../utils/auth";
import { signInAdmin } from "../../services/auth.service";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    pwd: "",
    form: "",
  });

  useEffect(() => {
    const rememberedEmail = getRememberedEmail();
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRemember(true);
    }
  }, []);

  const redirectTo = location.state?.from?.pathname || "/";

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

  const focusRing = (errored) =>
    errored
      ? {
          borderColor: "#EF4444",
          boxShadow: "0 0 0 4px rgba(239,68,68,0.15)",
        }
      : {
          borderColor: colors.accent,
          boxShadow: `0 0 0 4px ${colors.accent}26`,
        };

  const validate = () => {
    const next = { email: "", pwd: "", form: "" };

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Enter a valid email address.";
    }

    if (pwd.length < 6) {
      next.pwd = "Password must be at least 6 characters.";
    }

    setErrors(next);
    return !next.email && !next.pwd;
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
      await signInAdmin({
        email,
        password: pwd,
        remember,
      });

      toast.success("Signed in successfully.");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = error?.message || "Sign in failed.";
      setErrors((prev) => ({ ...prev, form: message }));
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Welcome to the Admin Portal"
      icon={MdCheckCircle}
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-describedby={errors.form ? "form-error" : undefined}
      >
        <div>
          <label htmlFor="email" className="text-xs" style={{ color: colors.text2 }}>
            Email
          </label>
          <div className="relative mt-2">
            <MdEmail
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              size={18}
              style={{ color: colors.text2 }}
            />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full h-11 rounded-xl pl-10 pr-3 text-sm outline-none"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              style={{
                ...inputBaseStyle,
                border: `2px solid ${errors.email ? "#EF4444" : colors.ring}`,
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = focusRing(!!errors.email).boxShadow;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "0 0 0 0 rgba(0,0,0,0)";
              }}
            />
          </div>
          {errors.email ? (
            <div id="email-error" className="mt-2 text-xs" style={{ color: "#EF4444" }}>
              {errors.email}
            </div>
          ) : null}
        </div>

        <div className="mt-4">
          <label htmlFor="password" className="text-xs" style={{ color: colors.text2 }}>
            Password
          </label>
          <div className="relative mt-2">
            <MdLock
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              size={18}
              style={{ color: colors.text2 }}
            />
            <input
              id="password"
              name="password"
              type={showPwd ? "text" : "password"}
              autoComplete="current-password"
              placeholder="********"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              disabled={loading}
              className="w-full h-11 rounded-xl pl-10 pr-10 text-sm outline-none"
              aria-invalid={!!errors.pwd}
              aria-describedby={errors.pwd ? "pwd-error" : undefined}
              style={{
                ...inputBaseStyle,
                border: `2px solid ${errors.pwd ? "#EF4444" : colors.ring}`,
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = focusRing(!!errors.pwd).boxShadow;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "0 0 0 0 rgba(0,0,0,0)";
              }}
            />

            <button
              type="button"
              onClick={() => setShowPwd((prev) => !prev)}
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md"
              style={{
                color: colors.text2,
                background: "transparent",
              }}
              aria-label={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
            </button>
          </div>

          {errors.pwd ? (
            <div id="pwd-error" className="mt-2 text-xs" style={{ color: "#EF4444" }}>
              {errors.pwd}
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <label
            className="inline-flex items-center gap-2 text-sm cursor-pointer select-none"
            style={{ color: colors.text2 }}
          >
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              disabled={loading}
              className="w-4 h-4 rounded"
              style={{ accentColor: colors.accent }}
            />
            Remember me
          </label>

          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            disabled={loading}
            className="text-sm hover:underline"
            style={{ color: colors.accent }}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full h-11 rounded-xl text-sm font-semibold"
          style={{
            backgroundColor: colors.accent,
            color: "#0B0B0F",
            opacity: loading ? 0.85 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {errors.form ? (
          <div
            id="form-error"
            role="alert"
            aria-live="assertive"
            className="mt-3 text-center text-sm"
            style={{ color: "#EF4444" }}
          >
            {errors.form}
          </div>
        ) : null}
      </form>
    </AuthLayout>
  );
};

export default LoginPage;