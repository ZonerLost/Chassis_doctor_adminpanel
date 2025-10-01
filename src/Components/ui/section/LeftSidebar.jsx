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
    description: "Articles, Categories & Revisions",
    color: "#D4AF37",
  },
  {
    icon: MdAnalytics,
    label: "Analytics",
    path: "/analytics",
    description: "Reporting & KPIs",
    color: "#D4AF37",
  },
];

export default function LeftSidebar() {
  const { colors } = useTheme();
  const loc = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

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
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          backgroundColor: colors.card,
          borderRight: `1px solid ${colors.ring}`,
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand Section */}
          <div className="p-6 border-b" style={{ borderColor: colors.ring }}>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: colors.accent }}
              >
                <span className="text-black font-bold text-lg">M</span>
              </div>
              <div>
                <h2
                  className="font-bold text-lg"
                  style={{ color: colors.text }}
                >
                  MotorSport
                </h2>
                <p className="text-xs" style={{ color: colors.text2 }}>
                  Admin Dashboard
                </p>
              </div>
            </div>
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
