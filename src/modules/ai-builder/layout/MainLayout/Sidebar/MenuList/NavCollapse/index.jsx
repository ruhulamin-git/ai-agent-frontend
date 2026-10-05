"use client";

import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";

import NavItem from "../NavItem";

// ==============================|| SIDEBAR MENU LIST COLLAPSE ITEMS ||============================== //

const NavCollapse = ({ menu, level, isCollapsed }) => {
  const customization = useSelector((state) => state.customization);
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const Icon = menu.icon;
  const isActive = customization.isOpen.findIndex((id) => id === menu.id) > -1;

  const menus = menu.children?.map((item) => {
    switch (item.type) {
      case "collapse":
        return <NavCollapse key={item.id} menu={item} level={level + 1} isCollapsed={isCollapsed} />;
      case "item":
        return <NavItem key={item.id} item={item} level={level + 1} isCollapsed={isCollapsed} />;
      default:
        return null;
    }
  });

  return (
    <div>
      <button
        onClick={handleClick}
        className={`w-full flex items-center rounded-lg transition-colors ${
          isActive
            ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50"
        } ${isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2"}`}
        title={isCollapsed ? menu.title : undefined}
      >
        <span className={isCollapsed ? "text-lg" : "text-xl flex-shrink-0"}>
          {Icon && <Icon stroke={1.5} size="1.25rem" />}
        </span>
        {!isCollapsed && (
          <>
            <span className="text-sm truncate flex-1 text-left">{menu.title}</span>
            {open ? (
              <IconChevronUp size={16} className="flex-shrink-0" />
            ) : (
              <IconChevronDown size={16} className="flex-shrink-0" />
            )}
          </>
        )}
      </button>
      {!isCollapsed && open && (
        <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-3">
          {menus}
        </div>
      )}
    </div>
  );
};

NavCollapse.propTypes = {
  menu: PropTypes.object,
  level: PropTypes.number,
  isCollapsed: PropTypes.bool,
};

export default NavCollapse;
