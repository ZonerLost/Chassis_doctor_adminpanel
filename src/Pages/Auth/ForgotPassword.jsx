import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdLockReset } from "react-icons/md";
import toast from "react-hot-toast";
import AuthLayout from "../../layouts/AuthLayout";
import { useTheme } from "../../contexts/ThemeContext";
import { sendPasswordReset } from "../../services/auth.service";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    form: "",
  });

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
    const next = { email: "", form: "" };

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Enter a valid email address.";
    }

    setErrors(next);
    return !next.email;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!validate()) {
      toast.error("Please enter a valid email.");
      return;
    }

    setLoading(true);
    setErrors((prev) => ({ ...prev, form: "" }));

    try {
      await sendPasswordReset(email);
      toast.success("Password reset email sent.");
      navigate("/login", { replace: true });
    } catch (error) {
      const message = error?.message || "Could not send reset email.";
      setErrors((prev) => ({ ...prev, form: message }));
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your admin email to receive a reset link"
      icon={MdLockReset}
    >
      <form onSubmit={handleSubmit} noValidate>
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
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full h-11 rounded-xl pl-10 pr-3 text-sm outline-none"
              style={{
                ...inputBaseStyle,
                border: `2px solid ${errors.email ? "#EF4444" : colors.ring}`,
              }}
            />
          </div>

          {errors.email ? (
            <div className="mt-2 text-xs" style={{ color: "#EF4444" }}>
              {errors.email}
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
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          disabled={loading}
          className="mt-3 w-full h-11 rounded-xl text-sm font-medium border"
          style={{
            borderColor: colors.ring,
            color: colors.text,
            backgroundColor: "transparent",
          }}
        >
          Back to sign in
        </button>

        {errors.form ? (
          <div className="mt-3 text-center text-sm" style={{ color: "#EF4444" }}>
            {errors.form}
          </div>
        ) : null}
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;