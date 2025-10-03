import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import * as userService from "../../data/users.service";

const COLORS = {
  onyx: "#0B0B0F",
  bg: "#0B0B0F",
  card: "#161821",
  text: "#E6E8F0",
  text2: "#A3A7B7",
  ring: "rgba(172,142,47,0.25)",
  gold: "rgb(172, 142, 47)",
  purple: "rgb(172, 142, 47)",
};

const LoginPage = () => {
  const navigate = useNavigate();
  useTheme();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const remember = true;
  // const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", pwd: "" });
  // Removed unused focusedField state
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setErrors({ email: "", pwd: "", form: "" });
    if (!email || !pwd) {
      setErrors({
        email: !email ? "Email is required." : "",
        pwd: !pwd ? "Password is required." : "",
      });
      return;
    }
    // setLoading(true);
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
      } else {
        const r = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: pwd }),
        });
        if (!r.ok) throw new Error("Invalid credentials");
        res = await r.json();
      }

      const token =
        (res && (res.token || res.accessToken)) ??
        (typeof res === "string" ? res : null);
      const user = res && (res.user || res.data || null);

      if (!token && !user) {
        if (res && (res.id || res.email)) {
          localStorage.setItem("user", JSON.stringify(res));
        } else {
          throw new Error("Login failed");
        }
      }

      if (token) {
        const storageKey = "auth_token";
        if (remember) {
          localStorage.setItem(storageKey, token);
        } else {
          sessionStorage.setItem(storageKey, token);
        }
      }

      if (user) localStorage.setItem("user", JSON.stringify(user));
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setErrors({
        email: "",
        pwd: "",
        form: err?.message ?? "Login failed",
      });
    } finally {
      // setLoading(false);
    }
  };

  const stats = [
    { icon: "⚡", label: "Fast Access", value: "< 2s" },
    { icon: "🛡️", label: "Secure", value: "256-bit" },
    { icon: "📈", label: "Uptime", value: "99.9%" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{
        background: `radial-gradient(900px 480px at ${mousePos.x}% ${mousePos.y}%, rgba(172,142,47,0.15), transparent 40%), radial-gradient(700px 360px at 90% 90%, rgba(172,142,47,0.08), transparent 40%), rgb(11, 11, 15)`,
        transition: "background 0.3s ease",
      }}
    >
      {/* ... */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="rounded-xl p-4 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 cursor-pointer"
            style={{
              backgroundColor: "rgba(22, 24, 33, 0.6)",
              border: `1px solid ${COLORS.ring}`,
              animationDelay: `${idx * 0.1}s`,
            }}
          >
            <span style={{ fontSize: 24 }}>{stat.icon}</span>
            <div className="mt-2 text-xs" style={{ color: COLORS.text2 }}>
              {stat.label}
            </div>
            <div className="text-xl font-bold" style={{ color: COLORS.text }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
      {/* ... */}
      <div className="relative mt-2 group">
        <span
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color: COLORS.text2 }}
        >
          📧
        </span>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          // Removed onFocus and onBlur handlers for focusedField
          placeholder="you@company.com"
          className="w-full h-12 rounded-xl pl-12 pr-4 text-sm outline-none"
          style={{
            backgroundColor: "#0B0B0F",
            color: COLORS.text,
            border: `2px solid ${errors.email ? "#EF4444" : COLORS.ring}`,
          }}
        />
      </div>

      <div className="relative">
        <input
          type={showPwd ? "text" : "password"}
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm"
          placeholder="Password"
        />
        <button
          type="button"
          onClick={() => setShowPwd((s) => !s)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
          aria-label={showPwd ? "Hide password" : "Show password"}
        >
          <span>{showPwd ? "🙈" : "👁️"}</span>
        </button>
      </div>
    </form>
  );
};

export default LoginPage;
