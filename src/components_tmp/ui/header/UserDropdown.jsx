import React from "react";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { useTheme } from "../../../contexts/ThemeContext";

export default function UserDropdown() {
  const navigate = useNavigate();
  const { colors } = useTheme();

  const handleLogout = () => {
    try {
      localStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
    } catch {
      // Ignore errors during logout
    }
    navigate("/login", { replace: true });
  };

  return (
    <div
      style={{
        width: 260,
        borderRadius: 8,
        overflow: "hidden",
        background: colors.bg2,
        border: `1px solid ${colors.ring}`,
      }}
    >
      <div className="p-4 border-b" style={{ borderColor: colors.ring }}>
        <div style={{ color: colors.text, fontWeight: 700 }}>Admin User</div>
        <div style={{ color: colors.text2, fontSize: 12 }}>
          admin@motorsport.com
        </div>
      </div>

      <div className="border-t" style={{ borderColor: colors.ring }} />

      <button
        onClick={handleLogout}
        className="w-full text-left p-3 flex items-center gap-3"
        style={{
          color: "#EF4444",
          backgroundColor: "rgba(239,68,68,0.03)",
        }}
      >
        <MdLogout /> <span>Logout</span>
      </button>
    </div>
  );
}
