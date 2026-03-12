import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdMenu } from "react-icons/md";
import { IoMoon, IoSunny } from "react-icons/io5";
import { useTheme } from "../../../contexts/ThemeContext";

const Header = ({ onMenuClick }) => {
  const { isDark, colors, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const pageName =
    pathname === "/"
      ? "Dashboard"
      : pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ") || "Page";

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "numeric",
      minute: "2-digit",
    });

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  return (
    <header
      className="sticky top-0 left-0 right-0 h-20 w-full flex items-center gap-4 px-4 md:px-6 shadow-lg border-b backdrop-blur-sm overflow-visible transition-colors duration-300"
      style={{
        backgroundColor: `${colors.card}CC`,
        borderColor: colors.ring,
        boxShadow: isDark
          ? "0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)"
          : "0 8px 32px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)",
        zIndex: 100,
      }}
    >
      <button
        onClick={onMenuClick}
        className="p-3 rounded-xl lg:hidden transition-all duration-200 hover:scale-105 active:scale-95 group relative"
        style={{
          color: colors.text,
          backgroundColor: `${colors.hover}40`,
        }}
        aria-label="Open menu"
      >
        <MdMenu
          size={22}
          className="transition-transform group-hover:rotate-180"
        />
      </button>

      <div className="flex-1" />

      <div className="hidden md:flex flex-col items-end text-right">
        <div
          className="text-lg font-bold tabular-nums transition-colors duration-300"
          style={{ color: colors.text }}
        >
          {formatTime(currentTime)}
        </div>
        <div
          className="text-xs opacity-75 transition-colors duration-300"
          style={{ color: colors.text2 }}
        >
          {formatDate(currentTime)}
        </div>
      </div>

      <button
        onClick={toggleTheme}
        className="p-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 relative group"
        style={{
          backgroundColor: `${colors.hover}40`,
          color: colors.text2,
        }}
        aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      >
        {isDark ? (
          <IoSunny
            size={20}
            className="transition-all duration-200 group-hover:text-yellow-400 group-hover:rotate-180"
          />
        ) : (
          <IoMoon
            size={20}
            className="transition-all duration-200 group-hover:text-blue-400 group-hover:rotate-12"
          />
        )}
      </button>

      <div
        className="hidden xl:flex items-center gap-2 text-sm px-4 py-2 rounded-full border transition-colors duration-300"
        style={{
          backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.8)",
          borderColor: colors.ring,
        }}
      >
        <Link
          to="/"
          className="font-medium hover:underline transition-colors duration-200 px-2 py-1 rounded-full"
          style={{ color: colors.accent }}
          onMouseEnter={(event) =>
            (event.target.style.backgroundColor = colors.hover)
          }
          onMouseLeave={(event) =>
            (event.target.style.backgroundColor = "transparent")
          }
        >
          Dashboard
        </Link>
        <span style={{ color: colors.text2 }}>/</span>
        <span
          className="capitalize font-medium px-2 py-1 rounded-full transition-colors duration-300"
          style={{
            color: colors.text,
            backgroundColor: `${colors.hover}50`,
          }}
        >
          {pageName}
        </span>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.2;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
