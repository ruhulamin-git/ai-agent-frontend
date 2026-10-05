"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme as useNextTheme } from "next-themes";
import PropTypes from "prop-types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { SET_DARKMODE } from "@/modules/ai-builder/store/actions";
import useNotifier from "@/modules/ai-builder/utils/useNotifier";

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ isSidebarOpen, onMobileMenuClick }) => {
  const customization = useSelector((state) => state.customization);
  const dispatch = useDispatch();
  const { setTheme: setNextTheme } = useNextTheme();
  const [mounted, setMounted] = React.useState(false);

  const isDark = customization.isDarkMode;

  useNotifier();

  // Track when component is mounted to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const changeDarkMode = () => {
    const newIsDark = !isDark;
    setNextTheme(newIsDark ? "dark" : "light");
    dispatch({ type: SET_DARKMODE, isDarkMode: newIsDark });
    localStorage.setItem("isDarkMode", String(newIsDark));
  };

  return (
    <div
      className={`fixed top-0 right-0 left-0 bg-white/80 dark:bg-gray-900 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-4 lg:px-5 z-40 transition-all duration-300 h-[60px] flex items-center ${
        isSidebarOpen ? "lg:left-[260px]" : "lg:left-16"
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMobileMenuClick}
            className="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-lg lg:text-xl font-md text-gray-900 dark:text-white">
            AI Builder
          </h1>
        </div>
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={changeDarkMode}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
            aria-label="Toggle theme"
          >
            {!mounted ? (
              // Render a placeholder during SSR/hydration to avoid mismatch
              <div className="h-5 w-5" />
            ) : isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  isSidebarOpen: PropTypes.bool,
  onMobileMenuClick: PropTypes.func,
};

export default Header;
