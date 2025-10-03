import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdLibraryBooks,
  MdMenuBook,
  MdAnalytics,
  MdSupervisedUserCircle,
  MdCampaign,
  MdSettings,
  MdLogout,
  MdKeyboardArrowRight,
  MdBuild,
  MdMenu,
  MdClose,
} from "react-icons/md";
import { useTheme } from "../../../contexts/ThemeContext";

const menuItems = [
  {
    icon: MdDashboard,
    label: "Dashboard",
    path: "/",
    description: "Overview & Analytics",
    color: "#D4AF37",
  },
  {
    icon: MdPeople,
    label: "Users & Memberships",
    path: "/users-memberships",
    description: "Manage Users",
    color: "#D4AF37",
  },
  {
    icon: MdBuild,
    label: "Chassis Doctor",
    path: "/chassis-doctor",
    description: "Diagnostic System",
    color: "#D4AF37",
  },
  {
    icon: MdLibraryBooks,
    label: "Courses",
    path: "/courses",
    description: "Media Library",
    color: "#D4AF37",
  },
  {
    icon: MdMenuBook,
    label: "Knowledge",
    path: "/knowledge",
    description: "Articles & Categories",
    color: "#D4AF37",
  },
  {
    icon: MdAnalytics,
    label: "Analytics",
    path: "/analytics",
    description: "Reporting & KPIs",
    color: "#D4AF37",
  },
  {
    icon: MdSettings,
    label: "Settings",
    path: "/settings",
    description: "Profile, System & Brand",
    color: "#D4AF37",
  },
];

export default function LeftSidebar({
  isOpen: propIsOpen,
  setIsOpen: setPropIsOpen,
}) {
  const { colors, isDark } = useTheme();
  const loc = useLocation();
  const navigate = useNavigate();
  // Support controlled mode (DashboardLayout passes isOpen/setIsOpen) or fall back to internal state
  const [localOpen, setLocalOpen] = React.useState(false);
  const isControlled =
    typeof propIsOpen === "boolean" && typeof setPropIsOpen === "function";
  const isOpen = isControlled ? propIsOpen : localOpen;
  const setIsOpen = isControlled ? setPropIsOpen : setLocalOpen;

  // added logout handler: clear auth and navigate to login
  const handleLogout = (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_token");
      // remove any other auth/session keys you use
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
    } catch {
      // ignore
    }
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Mobile menu toggle (hamburger) */}
      <button
        onClick={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setIsOpen(true);
        }}
        className="fixed top-4 left-4 lg:hidden p-2 rounded-md shadow-md"
        style={{
          backgroundColor: colors.card,
          border: `1px solid ${colors.ring}`,
          color: colors.text,
          zIndex: 9999,
          cursor: "pointer",
        }}
        aria-label="Open sidebar"
        aria-expanded={isOpen}
      >
        <MdMenu size={20} />
      </button>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-55 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          backgroundColor: colors.card,
          borderRight: `1px solid ${colors.ring}`,
        }}
      >
        <div className="flex flex-col h-full">
          {/* Brand / Logo Section */}
          <div className="p-4 border-b" style={{ borderColor: colors.ring }}>
            <div className="flex items-center gap-3 font-bold text-xl relative">
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
                      if (e.target.nextElementSibling) {
                        e.target.nextElementSibling.style.display = "block";
                      }
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
          </div>

          {/* Close button on mobile - moved to top right corner */}
          <div className="p-4 lg:hidden flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md"
              style={{ color: colors.text2 }}
              aria-label="Close sidebar"
            >
              <MdClose size={18} />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = loc.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                    isActive ? "shadow-lg" : ""
                  }`}
                  style={{
                    backgroundColor: isActive
                      ? colors.accent + "20"
                      : "transparent",
                    color: isActive ? colors.accent : colors.text,
                  }}
                  onClick={() => setIsOpen(false)}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = colors.hover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <Icon
                    size={20}
                    style={{
                      color: isActive ? colors.accent : colors.text2,
                    }}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.label}</div>
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: colors.text2 }}
                    >
                      {item.description}
                    </div>
                  </div>
                  <MdKeyboardArrowRight
                    size={16}
                    className={`transition-transform duration-200 ${
                      isActive ? "rotate-90" : "group-hover:translate-x-1"
                    }`}
                    style={{ color: colors.text2 }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t" style={{ borderColor: colors.ring }}>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors"
              style={{
                backgroundColor: "rgba(239,68,68,0.06)", // light red background
                border: `1px solid rgba(239,68,68,0.16)`,
                color: "#EF4444",
              }}
            >
              <MdLogout size={18} />
              <div className="text-sm font-medium">Logout</div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
