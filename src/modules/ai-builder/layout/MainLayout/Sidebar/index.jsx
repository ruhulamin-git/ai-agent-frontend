"use client";

import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import { SET_MENU } from "@/modules/ai-builder/store/actions";
import { drawerWidth } from "@/modules/ai-builder/store/constant";
import { AgentKitLogo } from "@/shared/ui/agentkit-logo";

import MenuList from "./MenuList";

const COLLAPSED_WIDTH = 64;

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = ({ drawerOpen, isMobileOpen, onMobileClose }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const toggleCollapse = () => {
    dispatch({ type: SET_MENU, opened: !drawerOpen });
  };

  if (!isAuthenticated) return null;

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-50 transform lg:translate-x-0 overflow-hidden transition-all duration-300 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      style={{ width: drawerOpen ? `${drawerWidth}px` : `${COLLAPSED_WIDTH}px` }}
    >
      {/* Logo / Header */}
      <div className={`border-b border-gray-200 dark:border-gray-800 flex items-center h-[60px] ${drawerOpen ? "px-5" : "p-2"}`}>
        <div className="flex items-center justify-between w-full">
          {/* Expanded: show logo + collapse arrow */}
          {drawerOpen && (
            <>
              <AgentKitLogo size="md" />
              {/* Collapse button (<< arrow) - desktop only */}
              <button
                onClick={toggleCollapse}
                className="hidden lg:block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 transition-colors"
                aria-label="Collapse sidebar"
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
              {/* Close button for mobile */}
              <button
                onClick={onMobileClose}
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
            </>
          )}
          {/* Collapsed: show expand arrow */}
          {!drawerOpen && (
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
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <MenuList isCollapsed={!drawerOpen} />
      </div>

      {/* Bottom CTA - Back to Dashboard */}
      {drawerOpen ? (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center">
          <div className="bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700/50 rounded-lg p-4 text-center w-full">
            <p className="text-xs text-teal-700 dark:text-teal-300 mb-2">Return to main dashboard</p>
            <a href="/developer-dashboard/agents" className="block w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium py-3 px-4 rounded-lg transition-colors">
              Back to Agent Library
            </a>
          </div>
        </div>
      ) : (
        <div className="p-1.5 border-t border-gray-200 dark:border-gray-800 flex justify-center h-[60px] items-center">
          <a
            href="/developer-dashboard/agents"
            className="w-9 h-9 bg-teal-600 hover:bg-teal-700 text-white p-0 flex items-center justify-center rounded-lg text-base transition-colors"
            title="Back to Agent Library"
          >
            ←
          </a>
        </div>
      )}
    </div>
  );
};

Sidebar.propTypes = {
  drawerOpen: PropTypes.bool,
  isMobileOpen: PropTypes.bool,
  onMobileClose: PropTypes.func,
};

export default Sidebar;
