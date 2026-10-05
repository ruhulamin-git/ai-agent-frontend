"use client";

import { IconPlug, IconRobot } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

export const AIStudioTabs = () => {
  const pathname = usePathname();
  const { t } = useTranslation();

  const tabs = [
    {
      id: "my-agents",
      label: t("pages.ai_studio.my_agents_tab", { defaultValue: "My Agents" }),
      icon: <IconRobot size={18} />,
      href: "/dashboard/ai-studio",
      isActive: pathname === "/dashboard/ai-studio",
    },
    {
      id: "external-agents",
      label: t("pages.ai_studio.external_agents_tab", { defaultValue: "External Agents" }),
      icon: <IconPlug size={18} />,
      href: "/dashboard/ai-studio/external-agents",
      isActive: pathname === "/dashboard/ai-studio/external-agents",
    },
  ];

  return (
    <div className="border-b border-border mb-8">
      <nav className="flex gap-1" aria-label="AI Studio Tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative",
              tab.isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </Link>
        ))}
      </nav>
    </div>
  );
};
