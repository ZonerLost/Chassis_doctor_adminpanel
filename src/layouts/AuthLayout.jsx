import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

const AuthLayout = ({ title, subtitle, icon: Icon, children }) => {
  const { colors } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [mounted, setMounted] = useState(false);
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

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background: `
          radial-gradient(900px 480px at ${mousePos.x}% ${mousePos.y}%, ${colors.accent}20, transparent 40%),
          radial-gradient(700px 360px at 90% 90%, ${colors.accent}12, transparent 40%),
          ${colors.bg}
        `,
        transition: "background 0.3s ease",
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl border p-6 sm:p-8"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.ring,
          boxShadow: mounted
            ? "0 18px 60px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)"
            : "0 6px 24px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.12)",
          transition:
            "opacity 280ms ease, transform 280ms ease, box-shadow 180ms ease",
          opacity: mounted ? 1 : 0,
          transform: mounted
            ? "translateY(0) scale(1)"
            : "translateY(10px) scale(0.995)",
        }}
      >
        <div className="flex items-center gap-2">
          {Icon ? <Icon size={22} style={{ color: colors.accent }} /> : null}
          <h1 className="text-2xl font-semibold" style={{ color: colors.text }}>
            {title}
          </h1>
        </div>

        {subtitle ? (
          <p className="mt-1 text-sm" style={{ color: colors.text2 }}>
            {subtitle}
          </p>
        ) : null}

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;