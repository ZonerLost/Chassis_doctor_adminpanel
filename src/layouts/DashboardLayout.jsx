import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "../components/ui/section/LeftSidebar";
import Header from "../components/ui/section/Header";
import { useTheme } from "../contexts/ThemeContext";

const DashboardLayout = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const { colors } = useTheme();

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: colors.bg }}
    >
      {/* Left Sidebar */}
      <LeftSidebar isOpen={leftSidebarOpen} setIsOpen={setLeftSidebarOpen} />

      {/* Main Content Area - with proper left margin for sidebar */}
      <div className="lg:ml-72 transition-all duration-300">
        {/* Header */}
        <Header onMenuClick={() => setLeftSidebarOpen(!leftSidebarOpen)} />

        {/* Main Content */}
        <main className="p-4 md:p-6">
          <div className="mx-auto w-full max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
