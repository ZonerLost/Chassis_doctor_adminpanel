import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import * as userService from "../../data/users.service";
import {
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdCheckCircle,
} from "react-icons/md";

const LoginPage = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", pwd: "", form: "" });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [mounted, setMounted] = useState(false);

  // BG parallax (throttled)
  const rafRef = useRef(null);
  useEffect(() => {
    const onMove = (e) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        setMousePos({
          x: Math.round((e.clientX / window.innerWidth) * 100),
          y: Math.round((e.clientY / window.innerHeight) * 100),
        });
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Mount animation trigger
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const validate = () => {
    const next = { email: "", pwd: "", form: "" };
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) next.email = "Enter a valid email address.";
    if ((pwd || "").length < 6) next.pwd = "Password must be at least 6 characters.";
    setErrors(next);
    return !next.email && !next.pwd;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (loading) return;
    if (!validate()) return;

    setLoading(true);
    setErrors((s) => ({ ...s, form: "" }));

    try {
      let res;
      if (typeof userService.login === "function") {
        try {
          res = await userService.login({ email, password: pwd });
        } catch {
          res = await userService.login(email, pwd);
        }
      } else if (typeof userService.authenticate === "function") {
        res = await userService.authenticate({ email, password: pwd });
      } 

      

     

      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setErrors((s) => ({ ...s, form: err?.message || "Login failed. Please try again." }));
    } finally {
      setLoading(false);
    }
  };

  const inputBaseStyle = {
    backgroundColor: colors.bg,
    color: colors.text,
    border: `2px solid ${colors.ring}`,
    boxShadow: "0 0 0 0 rgba(0,0,0,0)",
    transition: "box-shadow 120ms ease, border-color 120ms ease",
  };

  const focusRing = (errored) =>
    errored
      ? { borderColor: "#EF4444", boxShadow: "0 0 0 4px rgba(239,68,68,0.15)" }
      : { borderColor: colors.accent, boxShadow: `0 0 0 4px ${colors.accent}26` };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background: `
          radial-gradient(900px 480px at ${mousePos.x}% ${mousePos.y}%, ${colors.accent}26, transparent 40%),
          radial-gradient(700px 360px at 90% 90%, ${colors.accent}14, transparent 40%),
          ${colors.bg}
        `,
        transition: "background 0.3s ease",
      }}
    >
      {/* Single centered card */}
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-describedby={errors.form ? "form-error" : undefined}
        className="w-full max-w-md rounded-2xl border p-6 sm:p-8"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.ring,
          boxShadow: mounted
            ? "0 18px 60px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)"
            : "0 6px 24px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.12)",
          transition: "opacity 280ms ease, transform 280ms ease, box-shadow 180ms ease",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0) scale(1)" : "translateY(10px) scale(0.995)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow =
            "0 22px 70px rgba(0,0,0,0.28), 0 4px 16px rgba(0,0,0,0.18)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow =
            "0 18px 60px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)";
        }}
      >
        <div className="flex items-center gap-2">
          <MdCheckCircle size={22} style={{ color: colors.accent }} />
          <h1 className="text-xl font-semibold" style={{ color: colors.text }}>
            Sign in
          </h1>
        </div>
        <p className="mt-1 text-sm" style={{ color: colors.text2 }}>
          Welcome to the Admin Portal
        </p>

        {/* Email */}
        <div className="mt-6">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full h-11 rounded-xl pl-10 pr-3 text-sm outline-none"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              disabled={loading}
              onFocus={(e) => (e.currentTarget.style.boxShadow = focusRing(!!errors.email).boxShadow)}
              onBlur={(e) => (e.currentTarget.style.boxShadow = "0 0 0 0 rgba(0,0,0,0)")}
              style={{
                ...inputBaseStyle,
                border: `2px solid ${errors.email ? "#EF4444" : colors.ring}`,
                cursor: loading ? "not-allowed" : "text",
              }}
            />
          </div>
          {errors.email && (
            <div id="email-error" className="mt-2 text-xs" style={{ color: "#EF4444" }}>
              {errors.email}
            </div>
          )}
        </div>

        {/* Password */}
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
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="********"
              className="w-full h-11 rounded-xl pl-10 pr-10 text-sm outline-none"
              aria-invalid={!!errors.pwd}
              aria-describedby={errors.pwd ? "pwd-error" : undefined}
              disabled={loading}
              onFocus={(e) => (e.currentTarget.style.boxShadow = focusRing(!!errors.pwd).boxShadow)}
              onBlur={(e) => (e.currentTarget.style.boxShadow = "0 0 0 0 rgba(0,0,0,0)")}
              style={{
                ...inputBaseStyle,
                border: `2px solid ${errors.pwd ? "#EF4444" : colors.ring}`,
                cursor: loading ? "not-allowed" : "text",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md"
              aria-label={showPwd ? "Hide password" : "Show password"}
              disabled={loading}
              style={{ color: colors.text2, background: "transparent", opacity: loading ? 0.6 : 1 }}
            >
              {showPwd ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
            </button>
          </div>
          {errors.pwd && (
            <div id="pwd-error" className="mt-2 text-xs" style={{ color: "#EF4444" }}>
              {errors.pwd}
            </div>
          )}
        </div>

        {/* Row */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <label
            className="inline-flex items-center gap-2 text-sm cursor-pointer select-none"
            style={{ color: colors.text2 }}
          >
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded"
              style={{ accentColor: colors.accent }}
              disabled={loading}
              aria-label="Remember me"
            />
            Remember me
          </label>
          <button
            type="button"
            className="text-sm hover:underline"
            onClick={() => navigate("/forgot-password")}
            disabled={loading}
            style={{ color: colors.accent, opacity: loading ? 0.7 : 1 }}
          >
            Forgot password?
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full h-11 rounded-xl text-sm font-semibold"
          style={{
            backgroundColor: colors.accent,
            color: "#0B0B0F",
            opacity: loading ? 0.85 : 1,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "transform 120ms ease, box-shadow 120ms ease",
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "translateY(1px)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {/* Form error */}
        {errors.form && (
          <div
            id="form-error"
            className="mt-3 text-center text-sm"
            role="alert"
            aria-live="assertive"
            style={{ color: "#EF4444" }}
          >
            {errors.form}
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
