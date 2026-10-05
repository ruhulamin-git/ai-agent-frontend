"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { SidebarProvider, useSidebar } from "./context/SidebarContext";
import { ThemeProvider } from "./context/ThemeContext";

interface NewDashboardProps {
  children: React.ReactNode;
}

const DashboardContent = ({ children }: NewDashboardProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const getPageTitle = () => {
    if (pathname === "/developer-dashboard" || pathname === "/developer-dashboard/") {
      return "Developer Dashboard";
    }
    if (pathname.includes("/developer-dashboard/agents")) {
      return "Developer - Agent Library";
    }
    if (pathname.includes("/developer-dashboard/create-agent")) {
      return "Developer - Create Agent";
    }
    if (pathname.includes("/developer-dashboard/integrations")) {
      return "Developer - Integrations";
    }
    if (pathname.includes("/developer-dashboard/billing")) {
      return "Developer - Billing Management";
    }
    if (pathname.includes("/my-agent")) {
      return "My AI Agents";
    }
    if (pathname.includes("/user-dashboard/payment-history")) {
      return "Payment History";
    }
    return "AI Agents Analytics";
  };

  const isDeveloperRoute = pathname.includes("/developer-dashboard");

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      {/* Sidebar - Single common sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        mode={isDeveloperRoute ? "developer" : "user"}
      />

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={handleSidebarClose}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              handleSidebarClose();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Main content area */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? "lg:ml-16" : "lg:ml-64"
          }`}
      >
        {/* Navbar */}
        <Navbar
          title={getPageTitle()}
          onMenuClick={handleMenuClick}
          isSidebarCollapsed={isCollapsed}
        />

        {/* Content */}
        <main className="flex-1 pt-15">{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export const NewDashboard = ({ children }: NewDashboardProps) => {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <DashboardContent>{children}</DashboardContent>
      </SidebarProvider>
    </ThemeProvider>
  );
};
