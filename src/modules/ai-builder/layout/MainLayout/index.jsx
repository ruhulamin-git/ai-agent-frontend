"use client";

import { useState } from "react";
import { useSelector } from "react-redux";

import { drawerWidth } from "@/modules/ai-builder/store/constant";

import Header from "./Header";
import Sidebar from "./Sidebar";

const COLLAPSED_WIDTH = 64;

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const leftDrawerOpened = useSelector((state) => state.customization.opened);

  const handleMobileMenuClick = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      {/* Sidebar */}
      <Sidebar
        drawerOpen={leftDrawerOpened}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={handleMobileSidebarClose}
      />

      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={handleMobileSidebarClose}
          onKeyDown={(e) => e.key === "Escape" && handleMobileSidebarClose()}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Main content area */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          leftDrawerOpened ? "lg:ml-[260px]" : "lg:ml-16"
        }`}
      >
        {/* Navbar */}
        <Header
          isSidebarOpen={leftDrawerOpened}
          onMobileMenuClick={handleMobileMenuClick}
        />

        {/* Content */}
        <main className="flex-1 mt-[60px] py-5 px-2 ">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
