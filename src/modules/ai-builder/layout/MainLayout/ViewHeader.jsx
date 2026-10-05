// icons
import { IconArrowLeft, IconEdit, IconSearch } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import useSearchShortcut from "@/modules/ai-builder/hooks/useSearchShortcut";
import { Breadcrumb } from "@/shared/ui/breadcrumb";
import { StyledFab } from "@/modules/ai-builder/ui-component/button/StyledFab";
import { getOS } from "@/modules/ai-builder/utils/genericHelper";

const ViewHeader = ({
  children,
  filters = null,
  onSearchChange,
  search,
  searchPlaceholder = "Search",
  title,
  description,
  isBackButton,
  onBack,
  isEditButton,
  onEdit,
}) => {
  const searchInputRef = useRef();
  useSearchShortcut(searchInputRef);
  const customization = useSelector((state) => state.customization);
  const isDark = customization.isDarkMode;

  const [searchValue, setSearchValue] = useState("");
  const [keyboardShortcut, setKeyboardShortcut] = useState("");
  const [mounted, setMounted] = useState(false);

  // Get initial theme - default to dark during first render/SSR to match Redux default
  const [initialIsDark, setInitialIsDark] = useState(true);

  useEffect(() => {
    setMounted(true);
    // After mounting, we can safely check localStorage for the actual theme
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("newdashboard-theme");
      if (stored) {
        setInitialIsDark(stored === "dark");
      } else {
        const storedAlt = localStorage.getItem("isDarkMode");
        if (storedAlt) {
          setInitialIsDark(storedAlt === "true");
        } else {
          setInitialIsDark(document.documentElement.classList.contains("dark"));
        }
      }
    }
  }, []);

  useEffect(() => {
    const os = getOS();
    const isMac = os === "macos";
    const isDesktop = isMac || os === "windows" || os === "linux";
    if (isDesktop) {
      setKeyboardShortcut(isMac ? "[ ⌘ + F ]" : "[ Ctrl + F ]");
    }
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    if (onSearchChange) {
      onSearchChange(event);
    }
  };

  const breadcrumbItems = [{ label: title, isActive: true }];

  return (
    <div className="w-full">
      {/* Breadcrumb + Description + Actions */}
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {isBackButton && (
            <StyledFab
              sx={{ mr: 2, mb: 1 }}
              size="small"
              color="secondary"
              aria-label="back"
              title="Back"
              onClick={onBack}
            >
              <IconArrowLeft />
            </StyledFab>
          )}
          <Breadcrumb items={breadcrumbItems} className="mb-4" />
          {isEditButton && (
            <button
              onClick={onEdit}
              className="inline-block p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ml-2 -mt-4 mb-4"
              title="Edit"
            >
              <IconEdit size={16} />
            </button>
          )}
          {description && (
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
          )}
        </div>

        {/* Actions - right side */}
        {(search || filters || children) && (
          <div className="flex flex-wrap items-center gap-2 h-10 w-full sm:w-auto">
            {search && (
              <div
                suppressHydrationWarning
                className={`w-full sm:w-[280px] h-full flex items-center border rounded-lg px-3 ${mounted
                  ? isDark
                    ? "border-gray-700 bg-gray-800/50"
                    : "border-gray-200 bg-gray-50"
                  : initialIsDark
                    ? "border-gray-700 bg-gray-800/50"
                    : "border-gray-200 bg-gray-50"
                  }`}
              >
                <IconSearch
                  size={16}
                  className={`mr-2 ${mounted ? (isDark ? "text-gray-400" : "text-gray-500") : (initialIsDark ? "text-gray-400" : "text-gray-500")}`}
                />
                <input
                  ref={searchInputRef}
                  value={searchValue}
                  className="flex-1 text-sm border-none outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder={`${searchPlaceholder}${keyboardShortcut ? ` ${keyboardShortcut}` : ""}`}
                  onChange={handleSearchChange}
                  type="search"
                />
              </div>
            )}
            {filters}
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

ViewHeader.propTypes = {
  children: PropTypes.node,
  filters: PropTypes.node,
  onSearchChange: PropTypes.func,
  search: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  isBackButton: PropTypes.bool,
  onBack: PropTypes.func,
  isEditButton: PropTypes.bool,
  onEdit: PropTypes.func,
};

export default ViewHeader;
