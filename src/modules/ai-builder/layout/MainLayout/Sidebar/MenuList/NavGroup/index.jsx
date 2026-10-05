"use client";

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useAuth } from "@/modules/ai-builder/hooks/useAuth";
import { Available } from "@/modules/ai-builder/ui-component/rbac/available";

import NavCollapse from "../NavCollapse";
import NavItem from "../NavItem";

// ==============================|| SIDEBAR MENU LIST GROUP ||============================== //

const NavGroup = ({ item, isCollapsed }) => {
  const { hasPermission, hasDisplay } = useAuth();
  const customization = useSelector((state) => state.customization);
  const isDark = customization.isDarkMode;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const listItems = (menu, level = 1) => {
    if (!shouldDisplayMenu(menu)) return null;

    switch (menu.type) {
      case "collapse":
        return <NavCollapse key={menu.id} menu={menu} level={level} isCollapsed={isCollapsed} />;
      case "item":
        return <NavItem key={menu.id} item={menu} level={level} navType="MENU" isCollapsed={isCollapsed} />;
      default:
        return null;
    }
  };

  const shouldDisplayMenu = (menu) => {
    if (menu.permission && !hasPermission(menu.permission)) return false;
    if (menu.display) return hasDisplay(menu.display);
    return true;
  };

  const renderPrimaryItems = () => {
    const primaryGroup = item.children.find((child) => child.id === "primary");
    return primaryGroup.children;
  };

  const renderNonPrimaryGroups = () => {
    let nonprimaryGroups = item.children.filter((child) => child.id !== "primary");
    nonprimaryGroups = nonprimaryGroups.map((group) => {
      const children = group.children.filter((menu) => shouldDisplayMenu(menu));
      return { ...group, children };
    });
    return nonprimaryGroups.filter((group) => group.children.length > 0);
  };

  return (
    <>
      {/* Primary items */}
      <div className="space-y-1.5">
        {renderPrimaryItems().map((menu) => listItems(menu))}
      </div>

      {/* Non-primary groups */}
      {renderNonPrimaryGroups().map((group) => {
        const groupPermissions = group.children.map((menu) => menu.permission).join(",");
        return (
          <Available key={group.id} permission={groupPermissions}>
            <div>
              <div className={`my-2 h-px ${mounted ? (isDark ? "bg-gray-800" : "bg-gray-200") : "bg-gray-200"}`} />
              {!isCollapsed && (
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 mb-1.5 uppercase tracking-wider">
                  {group.title}
                </p>
              )}
              <div className="space-y-1.5">
                {group.children.map((menu) => listItems(menu))}
              </div>
            </div>
          </Available>
        );
      })}
    </>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object,
  isCollapsed: PropTypes.bool,
};

export default NavGroup;
