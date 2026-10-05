"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

import { useCurrentSubscription } from "@/modules/pricing/subscription-dashboard/service";
import { AgentKitLogo } from "@/shared/ui/agentkit-logo";
import { Button } from "@/shared/ui/button";

import { useSidebar } from "../context/SidebarContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "user" | "developer";
}

export const Sidebar = ({ isOpen, onClose, mode }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, toggleCollapse } = useSidebar();
  const { data: subscription } = useCurrentSubscription({
    config: {
      retry: 2,
      staleTime: 0, // Always fetch fresh data
      gcTime: 0, // Don't cache
      refetchOnMount: "always", // Always refetch on mount
      refetchOnWindowFocus: true, // Refetch on window focus
    },
  });

  // Check if user has active subscription
  const hasActiveSubscription = subscription?.isActive && !subscription?.isExpired && subscription?.status?.status === "active";

  // Handle developer mode navigation based on subscription status
  const handleDeveloperModeClick = useCallback(() => {
    if (hasActiveSubscription) {
      router.push("/developer-dashboard");
    } else {
      router.push("/start-building");
    }
    onClose();
  }, [hasActiveSubscription, router, onClose]);

  const userSidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: "◧", href: "/user-dashboard" },
    { id: "my-agents", label: "My Agents", icon: "◈", href: "/user-dashboard/my-agent" },
    {
      id: "purchase-history",
      label: "Purchase History",
      icon: "◍",
      href: "/user-dashboard/payment-history",
    },
  ];

  const developerSidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: "◫", href: "/developer-dashboard" },
    { id: "agents", label: "Agent Library", icon: "✦", href: "/developer-dashboard/agents" },

    {
      id: "billing",
      label: "Billing Management",
      icon: "◉",
      href: "/developer-dashboard/billing",
    },
  ];

  const sidebarItems = mode === "user" ? userSidebarItems : developerSidebarItems;

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-50 transform lg:translate-x-0 overflow-y-auto scrollbar-thin transition-[width,transform] duration-300 ${isCollapsed ? "w-16" : "w-64"
        } ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Logo */}
      <div
        className={`border-b border-gray-200 dark:border-gray-800 flex items-center h-15 ${isCollapsed ? "p-2" : "p-5"}`}
      >
        <div className="flex items-center justify-between w-full">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <AgentKitLogo size="md" />
            </div>
          )}
          {isCollapsed && (
            <button
              onClick={toggleCollapse}
              className="w-full flex items-center justify-center mx-auto hover:text-gray-900 dark:hover:text-white text-gray-600 dark:text-gray-400 transition-colors p-1"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
          {/* Toggle button - visible on desktop only */}
          {!isCollapsed && (
            <button
              onClick={toggleCollapse}
              className="hidden lg:block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 transition-colors"
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className={`flex-1 overflow-y-auto ${isCollapsed ? "p-1.5" : "p-4"}`}>
        <div className="space-y-1.5">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className={`w-full flex items-center rounded-lg transition-colors ${isActive
                  ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50"
                  } ${isCollapsed ? "justify-center p-1" : "gap-3 px-3 py-1.5"}`}
                title={isCollapsed ? item.label : undefined}
              >
                <span className={isCollapsed ? "text-lg" : "text-xl"}>{item.icon}</span>
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      {mode === "user" && (
        <>
          {!isCollapsed && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 h-35 flex items-center">
              <div className="bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700/50 rounded-lg p-4 text-center w-full">
                <p className="text-xs text-teal-700 dark:text-teal-300 mb-2">
                  {hasActiveSubscription ? "Access your developer tools" : "Build & earn with AI tools"}
                </p>
                <Button
                  onClick={handleDeveloperModeClick}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs"
                >
                  Developer Mode
                </Button>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="p-1.5 border-t border-gray-200 dark:border-gray-800 flex justify-center h-15 items-center">
              <Button
                onClick={handleDeveloperModeClick}
                className="w-9 h-9 bg-teal-600 hover:bg-teal-700 text-white p-0 flex items-center justify-center rounded-lg text-base"
                title={hasActiveSubscription ? "Access Developer Dashboard" : "Start Building"}
              >
                🚀
              </Button>
            </div>
          )}
        </>
      )}

      {mode === "developer" && (
        <>
          {!isCollapsed && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 h-35 flex items-center">
              <div className="bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700/50 rounded-lg p-4 text-center w-full">
                <p className="text-xs text-teal-700 dark:text-teal-300 mb-2">Switch back to user dashboard</p>
                <Link href="/user-dashboard">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs">
                    User Mode
                  </Button>
                </Link>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="p-1.5 border-t border-gray-200 dark:border-gray-800 flex justify-center h-15 items-center">
              <Link href="/user-dashboard">
                <Button
                  className="w-9 h-9 bg-teal-600 hover:bg-teal-700 text-white p-0 flex items-center justify-center rounded-lg text-base"
                  title="User Mode"
                >
                  👤
                </Button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};
