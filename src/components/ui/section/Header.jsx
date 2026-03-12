import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdMenu } from "react-icons/md";
import { IoMoon, IoSunny } from "react-icons/io5";
import { useTheme } from "../../../contexts/ThemeContext";
import useAdminProfile from "../../../hooks/useAdminProfile";

function formatPageName(pathname) {
  const raw =
    pathname === "/"
      ? "Dashboard"
      : pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ") || "Page";

  return raw.replace(/\b\w/g, (char) => char.toUpperCase());
}

function getInitials(fullName, email) {
  const source = fullName || email || "Admin";

  return (
    source
      .split(/[\s@._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "A"
  );
}

const Header = ({ onMenuClick }) => {
  const { isDark, colors, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const { fullName, email, avatarUrl, loading } = useAdminProfile();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const pageName = useMemo(() => formatPageName(pathname), [pathname]);
  const displayName = fullName || email || "Admin";
  const initials = useMemo(
    () => getInitials(fullName, email),
    [email, fullName]
  );

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
      className="sticky top-0 z-[100] flex w-full min-w-0 items-center justify-between gap-3 border-b px-3 py-3 sm:px-4 md:px-6"
      style={{
        backgroundColor: `${colors.card}EB`,
        borderColor: colors.ring,
        boxShadow: isDark
          ? "0 10px 28px rgba(0, 0, 0, 0.14), 0 2px 8px rgba(0, 0, 0, 0.08)"
          : "0 10px 28px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
        <button
          onClick={onMenuClick}
          className="group rounded-xl p-3 transition-all duration-200 hover:scale-105 active:scale-95 lg:hidden"
          style={{
            color: colors.text,
            backgroundColor: `${colors.hover}40`,
          }}
          aria-label="Open menu"
        >
          <MdMenu
            size={22}
            className="transition-transform duration-200 group-hover:rotate-180"
          />
        </button>

        <div className="min-w-0 flex-1">
          <div
            className="truncate text-base font-semibold sm:text-lg lg:text-xl"
            style={{ color: colors.text }}
          >
            {pageName}
          </div>

          <div className="mt-1 hidden min-w-0 items-center gap-2 text-xs lg:flex">
            <Link
              to="/"
              className="truncate font-medium transition-colors hover:underline"
              style={{ color: colors.accent }}
            >
              Dashboard
            </Link>
            <span style={{ color: colors.text2 }}>/</span>
            <span className="truncate" style={{ color: colors.text2 }}>
              {pageName}
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div
          className="hidden rounded-2xl border px-3 py-2 text-right md:flex md:flex-col"
          style={{
            backgroundColor: isDark
              ? "rgba(0, 0, 0, 0.18)"
              : "rgba(255, 255, 255, 0.82)",
            borderColor: colors.ring,
          }}
        >
          <div
            className="text-sm font-semibold tabular-nums lg:text-base"
            style={{ color: colors.text }}
          >
            {formatTime(currentTime)}
          </div>
          <div className="text-xs" style={{ color: colors.text2 }}>
            {formatDate(currentTime)}
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="group rounded-xl p-3 transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            backgroundColor: `${colors.hover}40`,
            color: colors.text2,
          }}
          aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        >
          {isDark ? (
            <IoSunny
              size={20}
              className="transition-all duration-200 group-hover:rotate-180 group-hover:text-yellow-400"
            />
          ) : (
            <IoMoon
              size={20}
              className="transition-all duration-200 group-hover:rotate-12 group-hover:text-blue-400"
            />
          )}
        </button>

        <div
          className="flex min-w-0 items-center gap-2 rounded-2xl border px-1.5 py-1.5 sm:px-3 sm:py-2"
          style={{
            backgroundColor: isDark
              ? "rgba(0, 0, 0, 0.18)"
              : "rgba(255, 255, 255, 0.82)",
            borderColor: colors.ring,
          }}
        >
          {loading && !fullName && !email && !avatarUrl ? (
            <div
              className="h-10 w-10 animate-pulse rounded-full"
              style={{ backgroundColor: colors.hover }}
            />
          ) : avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName || "Admin avatar"}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold"
              style={{
                backgroundColor: colors.hover,
                color: colors.text,
                border: `1px solid ${colors.ring}`,
              }}
            >
              {initials}
            </div>
          )}

          <div className="hidden min-w-0 md:block">
            <div
              className="max-w-[140px] truncate text-sm font-semibold lg:max-w-[180px]"
              style={{ color: colors.text }}
            >
              {displayName}
            </div>
            <div
              className="hidden max-w-[180px] truncate text-xs xl:block"
              style={{ color: colors.text2 }}
            >
              {email || "Admin account"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
