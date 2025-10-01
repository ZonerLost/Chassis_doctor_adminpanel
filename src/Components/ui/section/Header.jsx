import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MdMenu,
  MdNotifications,
  MdAccountCircle,
  MdSettings,
  MdLogout,
  MdClear,
} from "react-icons/md";
import { IoMoon, IoSunny } from "react-icons/io5";
import { useTheme } from "../../../contexts/ThemeContext";

const Header = ({ onMenuClick }) => {
  const { isDark, colors, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New user registration",
      message: "John Doe has joined the platform",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "System maintenance",
      message: "Scheduled maintenance at 2 AM",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "Course completed",
      message: "Advanced Racing completed by Jane Smith",
      time: "2 hours ago",
      unread: false,
    },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".notification-dropdown") &&
        !event.target.closest(".notification-button")
      ) {
        setShowNotifications(false);
      }
      if (
        !event.target.closest(".profile-dropdown") &&
        !event.target.closest(".profile-button")
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
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

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, unread: false }))
    );
  };

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
  };

  return (
    <header
      className="h-20 w-full flex items-center gap-4 px-4 md:px-6 shadow-lg border-b backdrop-blur-sm relative overflow-visible transition-colors duration-300 sticky top-0"
      style={{
        backgroundColor: `${colors.card}CC`,
        borderColor: colors.ring,
        boxShadow: isDark
          ? "0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)"
          : "0 8px 32px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)",
        zIndex: 100,
      }}
    >
      {/* Animated background gradient */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${colors.accent}40, ${colors.accent}10, transparent)`,
          animation: "pulse 4s ease-in-out infinite alternate",
        }}
      />

      {/* Mobile menu button */}
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

      {/* Brand / Logo - Only show on mobile */}
      <div className="flex items-center gap-3 font-bold text-xl relative lg:hidden">
        <div className="relative">
          <img
            src="/logo.png"
            alt="MotorSport University Logo"
            className="h-12 w-12 object-contain rounded-lg shadow-md transition-transform hover:scale-110"
            style={{
              filter: isDark
                ? "drop-shadow(0 4px 8px rgba(0,0,0,0.2))"
                : "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
            }}
            onError={(e) => {
              if (e.target.src.includes("/logo.png")) {
                e.target.src = "/assets/logo.png";
              } else {
                e.target.style.display = "none";
                e.target.nextElementSibling.style.display = "block";
              }
            }}
          />
          <div
            className="h-12 w-12 rounded-lg shadow-md flex items-center justify-center text-xl font-bold"
            style={{
              backgroundColor: colors.accent,
              color: colors.bg,
              display: "none",
            }}
          >
            M
          </div>
        </div>
        <span
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent text-lg"
          style={{ fontWeight: "800" }}
        >
          MotorSport
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Time and Date */}
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

      {/* Theme Toggle */}
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

      {/* Notifications */}
      <div className="relative">
        <button
          className="notification-button p-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 relative group"
          style={{
            backgroundColor: `${colors.hover}40`,
            color: colors.text2,
          }}
          aria-label="Notifications"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <MdNotifications
            size={20}
            className="transition-all group-hover:text-white"
          />
          {unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs font-bold flex items-center justify-center text-white animate-pulse"
              style={{ backgroundColor: "#ef4444" }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div
            className="notification-dropdown fixed right-4 mt-2 w-80 rounded-2xl border shadow-2xl max-h-96 overflow-hidden transition-all duration-200"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.ring,
              zIndex: 9999,
              top: "80px",
            }}
          >
            <div className="p-4 border-b" style={{ borderColor: colors.ring }}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold" style={{ color: colors.text }}>
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm hover:underline"
                    style={{ color: colors.accent }}
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center" style={{ color: colors.text2 }}>
                  No notifications
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-4 border-b hover:bg-opacity-50 relative group cursor-pointer transition-colors duration-150"
                    style={{
                      borderColor: colors.ring,
                      backgroundColor: notif.unread
                        ? colors.accent + "10"
                        : "transparent",
                    }}
                    onClick={() => markNotificationAsRead(notif.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.hover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = notif.unread
                        ? colors.accent + "10"
                        : "transparent";
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4
                          className="font-medium text-sm"
                          style={{ color: colors.text }}
                        >
                          {notif.title}
                        </h4>
                        <p
                          className="text-xs mt-1"
                          style={{ color: colors.text2 }}
                        >
                          {notif.message}
                        </p>
                        <span
                          className="text-xs mt-2 inline-block"
                          style={{ color: colors.text2 }}
                        >
                          {notif.time}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearNotification(notif.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition-opacity"
                        style={{ color: colors.text2 }}
                      >
                        <MdClear size={16} />
                      </button>
                    </div>

                    {notif.unread && (
                      <div
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors.accent }}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className="relative">
        <button
          className="profile-button p-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 relative group"
          style={{
            backgroundColor: `${colors.hover}40`,
            color: colors.text2,
          }}
          aria-label="User profile"
          onClick={() => setShowProfile(!showProfile)}
        >
          <MdAccountCircle
            size={20}
            className="transition-all group-hover:text-white"
          />
        </button>

        {/* Profile Dropdown */}
        {showProfile && (
          <div
            className="profile-dropdown fixed right-4 mt-2 w-56 rounded-2xl border shadow-2xl transition-all duration-200"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.ring,
              zIndex: 9999,
              top: "80px",
            }}
          >
            <div className="p-4 border-b" style={{ borderColor: colors.ring }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.accent + "20" }}
                >
                  <MdAccountCircle size={24} style={{ color: colors.accent }} />
                </div>
                <div>
                  <p className="font-medium" style={{ color: colors.text }}>
                    Admin User
                  </p>
                  <p className="text-xs" style={{ color: colors.text2 }}>
                    admin@motorsport.com
                  </p>
                </div>
              </div>
            </div>

            <div className="py-2">
              <button
                className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors duration-150"
                style={{ color: colors.text }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = colors.hover)
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <MdAccountCircle size={18} />
                <span>Profile Settings</span>
              </button>

              <button
                className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors duration-150"
                style={{ color: colors.text }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = colors.hover)
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <MdSettings size={18} />
                <span>System Settings</span>
              </button>

              <hr style={{ borderColor: colors.ring, margin: "8px 0" }} />

              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left hover:bg-red-500/20 flex items-center gap-3 transition-colors duration-150"
                style={{ color: "#ef4444" }}
              >
                <MdLogout size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Breadcrumb */}
      <div
        className="hidden xl:flex items-center gap-2 text-sm px-4 py-2 rounded-full border transition-colors duration-300"
        style={{
          backgroundColor: isDark
            ? "rgba(0,0,0,0.2)"
            : "rgba(255,255,255,0.8)",
          borderColor: colors.ring,
        }}
      >
        <Link
          to="/"
          className="font-medium hover:underline transition-colors duration-200 px-2 py-1 rounded-full"
          style={{ color: colors.accent }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = colors.hover)
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = "transparent")
          }
        >
          Dashboard
        </Link>
        <span style={{ color: colors.text2 }}>/</span>
        <span
          className="capitalize font-medium px-2 py-1 rounded-full transition-colors duration-300"
          style={{
            color: colors.text,
            backgroundColor: colors.hover + "50",
          }}
        >
          {pageName}
        </span>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
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
