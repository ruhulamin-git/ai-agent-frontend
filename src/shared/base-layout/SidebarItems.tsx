"use client";

import { IconCreditCard, IconLayoutDashboard, IconRobot, IconShare2 } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  href: string;
}

export const SidebarItems = () => {
  const pathname = usePathname();
  const { t } = useTranslation();

  // Static menu items (not from server as requested)
  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      title: t("navigation.dashboard"),
      icon: <IconLayoutDashboard size={20} />,
      href: "/dashboard",
    },
    {
      id: "ai-studio",
      title: t("navigation.ai_studio"),
      icon: <IconRobot size={20} />,
      href: "/dashboard/ai-studio",
    },
    {
      id: "agents",
      title: t("navigation.agents"),
      icon: <IconRobot size={20} />,
      href: "/dashboard/agents",
    },
    {
      id: "connections",
      title: "Connections",
      icon: <IconShare2 size={20} />,
      href: "/dashboard/connections",
    },
    {
      id: "subscription",
      title: "Subscription & Billing",
      icon: <IconCreditCard size={20} />,
      href: "/dashboard/subscription",
    },
  ];

  return (
    <div className="px-3">
      <nav className="space-y-1 pt-0">
        {menuItems.map((item) => {
          // Check if current path starts with the menu item href
          // This makes parent items active when on sub-routes
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <span className="shrink-0">{item.icon}</span>
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
