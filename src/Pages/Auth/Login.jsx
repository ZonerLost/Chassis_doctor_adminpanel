// ...existing code...
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MdMail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";

const COLORS = {
  onyx: "#0B0B0F",
  bg: "#12131A",
  card: "#161821",
  text: "#E6E8F0",
  text2: "#A3A7B7",
  ring: "rgba(110,86,207,0.25)",
  gold: "#D4AF37",
  purple: "#6E56CF",
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", pwd: "" });

  const validate = () => {
    const next = { email: "", pwd: "" };
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) next.email = "Enter a valid email address.";
    if (pwd.length < 6) next.pwd = "Password must be at least 6 characters.";
    setErrors(next);
    return !next.email && !next.pwd;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const token = "demo-token-" + Date.now();
      if (remember) localStorage.setItem("auth_token", token);
      else sessionStorage.setItem("auth_token", token);
      setLoading(false);
      navigate("/", { replace: true });
    }, 700);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(900px 480px at 10% 10%, rgba(110,86,207,0.08), transparent 40%), radial-gradient(700px 360px at 90% 90%, rgba(212,175,55,0.06), transparent 40%), #0B0B0F",
      }}
    >
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: Branding */}
        <div className="hidden lg:flex flex-col justify-center gap-6 pl-6">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="Logo" className="h-14 w-14" />
            <div>
              <div
                className="text-xl font-semibold"
                style={{ color: COLORS.text }}
              >
                Motorsport University
              </div>
              <div className="text-sm" style={{ color: COLORS.text2 }}>
                Admin Dashboard
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-3xl font-bold" style={{ color: COLORS.text }}>
              Welcome back
            </h2>
            <p className="mt-2 max-w-sm" style={{ color: COLORS.text2 }}>
              Log in to manage users, content, diagnostics and analytics. Secure
              admin access with a refined dark theme.
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            <div
              className="rounded-xl p-4"
              style={{
                backgroundColor: COLORS.card,
                border: `1px solid ${COLORS.ring}`,
                color: COLORS.text,
              }}
            >
              <div className="text-xs" style={{ color: COLORS.text2 }}>
                Tip
              </div>
              <div className="mt-1 text-sm">
                Use the demo credentials{" "}
                <span className="font-medium">demo@demo.com</span> /{" "}
                <span className="font-medium">password</span>
              </div>
            </div>

            <div
              className="rounded-xl p-4"
              style={{
                backgroundColor: COLORS.card,
                border: `1px solid ${COLORS.ring}`,
                color: COLORS.text,
              }}
            >
              <div className="text-xs" style={{ color: COLORS.text2 }}>
                Security
              </div>
              <div className="mt-1 text-sm">
                Two-factor authentication recommended for admin accounts.
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div>
          <div
            className="mx-auto w-full max-w-md rounded-2xl p-6 shadow-lg"
            style={{
              backgroundColor: COLORS.card,
              border: `1px solid ${COLORS.ring}`,
              color: COLORS.text,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src="/assets/logo.png" alt="Logo" className="h-10 w-10" />
                <div>
                  <div
                    className="text-lg font-semibold"
                    style={{ color: COLORS.text }}
                  >
                    Admin Login
                  </div>
                  <div className="text-xs" style={{ color: COLORS.text2 }}>
                    Manage the Motorsport University platform
                  </div>
                </div>
              </div>
              <div className="text-sm" style={{ color: COLORS.text2 }}>
                {new Date().toLocaleDateString()}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs" style={{ color: COLORS.text2 }}>
                  Email
                </label>
                <div className="relative mt-1">
                  <MdMail
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: COLORS.text2 }}
                  />
                  <input
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full h-11 rounded-xl pl-10 pr-3 text-sm outline-none"
                    style={{
                      backgroundColor: "#12131A",
                      color: COLORS.text,
                      border: `1px solid ${
                        errors.email ? "#EF4444" : COLORS.ring
                      }`,
                    }}
                  />
                </div>
                {errors.email ? (
                  <div className="mt-1 text-xs" style={{ color: "#EF4444" }}>
                    {errors.email}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="text-xs" style={{ color: COLORS.text2 }}>
                  Password
                </label>
                <div className="relative mt-1">
                  <MdLock
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: COLORS.text2 }}
                  />
                  <input
                    type={showPwd ? "text" : "password"}
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 rounded-xl pl-10 pr-10 text-sm outline-none"
                    style={{
                      backgroundColor: "#12131A",
                      color: COLORS.text,
                      border: `1px solid ${
                        errors.pwd ? "#EF4444" : COLORS.ring
                      }`,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md"
                    aria-label={showPwd ? "Hide password" : "Show password"}
                    style={{ color: COLORS.text2 }}
                  >
                    {showPwd ? (
                      <MdVisibilityOff size={18} />
                    ) : (
                      <MdVisibility size={18} />
                    )}
                  </button>
                </div>
                {errors.pwd ? (
                  <div className="mt-1 text-xs" style={{ color: "#EF4444" }}>
                    {errors.pwd}
                  </div>
                ) : null}
              </div>

              <div className="flex items-center justify-between">
                <label
                  className="inline-flex items-center gap-2 text-sm"
                  style={{ color: COLORS.text2 }}
                >
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="accent-[#6E56CF]"
                  />
                  Remember me
                </label>
                <Link
                  to="#"
                  className="text-sm underline"
                  style={{ color: COLORS.text }}
                >
                  Forgot?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`,
                  color: "#0B0B0F",
                }}
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <div className="my-4 flex items-center gap-3">
              <div
                className="h-px flex-1"
                style={{ backgroundColor: COLORS.ring }}
              />
              <div className="text-xs" style={{ color: COLORS.text2 }}>
                or continue with
              </div>
              <div
                className="h-px flex-1"
                style={{ backgroundColor: COLORS.ring }}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => alert("Google sign-in (placeholder)")}
                className="h-11 rounded-xl flex items-center justify-center gap-2 border"
                style={{
                  backgroundColor: "#12131A",
                  borderColor: COLORS.ring,
                  color: COLORS.text,
                }}
              >
                <FcGoogle />
                <span className="text-sm">Google</span>
              </button>
              <button
                onClick={() => alert("Facebook sign-in (placeholder)")}
                className="h-11 rounded-xl flex items-center justify-center gap-2 border"
                style={{
                  backgroundColor: "#12131A",
                  borderColor: COLORS.ring,
                  color: COLORS.text,
                }}
              >
                <FaFacebook style={{ color: "#3b5998" }} />
                <span className="text-sm">Facebook</span>
              </button>
              <button
                onClick={() => alert("Apple sign-in (placeholder)")}
                className="h-11 rounded-xl flex items-center justify-center gap-2 border"
                style={{
                  backgroundColor: "#12131A",
                  borderColor: COLORS.ring,
                  color: COLORS.text,
                }}
              >
                <FaApple />
                <span className="text-sm">Apple</span>
              </button>
            </div>

            <div
              className="mt-4 text-center text-sm"
              style={{ color: COLORS.text2 }}
            >
              Don't have access?{" "}
              <button
                type="button"
                onClick={() => alert("Request access flow coming soon")}
                className="underline"
                style={{ color: COLORS.text }}
              >
                Request access
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
// ...existing code...
