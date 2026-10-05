"use client";

import { menuItems } from "@/modules/ai-builder/menu-items";

import NavGroup from "./NavGroup";

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = ({ isCollapsed }) => {
  const navItems = menuItems.items.map((item) => {
    switch (item.type) {
      case "group":
        return <NavGroup key={item.id} item={item} isCollapsed={isCollapsed} />;
      default:
        return null;
    }
  });

  return <div className={isCollapsed ? "p-1.5" : "p-4"}>{navItems}</div>;
};

export default MenuList;
