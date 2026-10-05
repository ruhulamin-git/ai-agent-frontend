"use client";

import {
  IconChevronsLeft,
  IconChevronsRight,
  IconCoin,
  IconHistory,
  IconLayoutDashboard,
  IconRobot,
  IconShare2,
  IconSparkles,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { AgentKitLogo } from "@/shared/ui";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

import { SidebarPlanBadge } from "./SidebarPlanBadge";
import { SidebarProfile } from "./SidebarProfile";
import { SidebarRoleSwitcher } from "./SidebarRoleSwitcher";

import type { UserProfile } from "@/shared/types";

interface AppSidebarProps {
  user?: UserProfile | null;
  isLoading?: boolean;
}

// Menu items with translation keys
// Menu items split by module
const marketplaceItems = [
  {
    titleKey: "navigation.dashboard",
    url: "/dashboard",
    icon: IconLayoutDashboard,
  },
  {
    titleKey: "navigation.agents",
    url: "/dashboard/agents",
    icon: IconRobot,
  },
  {
    titleKey: "navigation.connections",
    url: "/dashboard/connections",
    icon: IconShare2,
  },
  {
    titleKey: "navigation.my_agents",
    url: "/dashboard/my-agents",
    icon: IconRobot,
  },
  {
    titleKey: "navigation.purchase_history",
    url: "/dashboard/subscription/history",
    icon: IconHistory,
  },
];

const studioItems = [
  {
    titleKey: "navigation.creator_dashboard",
    url: "/dashboard/creator-dashboard",
    icon: IconLayoutDashboard,
  },
  {
    titleKey: "navigation.ai_studio",
    url: "/dashboard/ai-studio",
    icon: IconSparkles,
  },
  {
    titleKey: "navigation.payouts",
    url: "/dashboard/creator-dashboard/payouts",
    icon: IconCoin,
  },
];

const LogoButton = () => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenuButton
      size="lg"
      asChild
      className="h-20 w-full px-6 hover:bg-transparent active:bg-transparent group-data-[collapsible=icon]:h-20! group-data-[collapsible=icon]:w-full! group-data-[collapsible=icon]:px-0! group-data-[collapsible=icon]:justify-center!"
    >
      <Link href="/dashboard" className="flex items-center justify-center">
        <AgentKitLogo size={isCollapsed ? "sm" : "md"} showText={!isCollapsed} />
      </Link>
    </SidebarMenuButton>
  );
};

const SidebarExtender = () => {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={toggleSidebar}
          className={`
            flex h-8 w-8 items-center justify-center
            transition-all duration-300 hover:scale-110
            text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white
            cursor-pointer
            ${isCollapsed ? "mx-auto mt-2" : "ml-auto"}
          `}
        >
          {isCollapsed ? <IconChevronsRight size={20} /> : <IconChevronsLeft size={20} />}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" align="center">
        {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      </TooltipContent>
    </Tooltip>
  );
};

export const AppSidebar = ({ user, isLoading }: AppSidebarProps) => {
  const { t, ready: _ready } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const [activeModule, setActiveModule] = useState<"marketplace" | "studio">(
    pathname?.startsWith("/dashboard/ai-studio") ||
      pathname?.startsWith("/dashboard/creator-dashboard")
      ? "studio"
      : "marketplace"
  );

  // Sync module with URL if user navigates directly
  useEffect(() => {
    if (
      pathname?.startsWith("/dashboard/ai-studio") ||
      pathname?.startsWith("/dashboard/creator-dashboard")
    ) {
      setActiveModule("studio");
    } else if (pathname?.startsWith("/dashboard")) {
      setActiveModule("marketplace");
    }
  }, [pathname]);

  const activeItems = activeModule === "studio" ? studioItems : marketplaceItems;

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-200/60 dark:border-slate-800/60 bg-sidebar shadow-xl"
    >
      <SidebarHeader className="border-b border-slate-200/60 dark:border-slate-800/60 p-0 shrink-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoButton />
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarRoleSwitcher
          activeModule={activeModule}
          onModuleChange={(val) => {
            setActiveModule(val);
            if (val === "marketplace") {
              router.push("/dashboard");
            } else {
              router.push("/dashboard/creator-dashboard");
            }
          }}
        />
      </SidebarHeader>

      <SidebarContent className="bg-sidebar overflow-y-auto overflow-x-hidden flex-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        <SidebarGroup className="px-3">
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-2 mb-2 mt-1">
            <span suppressHydrationWarning>{t("entities.navigation")}</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {activeItems.map((item) => {
                // Special handling for nested routes
                let isActive = false;

                if (item.url === "/dashboard/creator-dashboard/payouts") {
                  // Payout page should only be active on exact match or payout sub-routes
                  isActive =
                    pathname === item.url ||
                    pathname?.startsWith("/dashboard/creator-dashboard/payouts");
                } else if (item.url === "/dashboard/creator-dashboard") {
                  // Creator dashboard should only be active on exact match, not on payout routes
                  isActive =
                    pathname === item.url &&
                    !pathname?.startsWith("/dashboard/creator-dashboard/payouts");
                } else {
                  // Default logic for other items
                  isActive =
                    pathname === item.url ||
                    (pathname?.startsWith(item.url) && item.url !== "/dashboard");
                }

                return (
                  <SidebarMenuItem key={item.titleKey}>
                    <SidebarMenuButton
                      asChild
                      tooltip={t(item.titleKey)}
                      isActive={isActive}
                      className={`
                        group relative flex items-center h-10 px-4 transition-all duration-300 text-base
                        ${
                          isActive
                            ? "bg-primary/10 text-primary font-bold shadow-sm shadow-primary/5 rounded-xl group-data-[collapsible=icon]:rounded-full"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white rounded-xl group-data-[collapsible=icon]:rounded-full"
                        }
                      `}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className={`size-5 ${isActive ? "text-primary" : ""}`} />
                        <span suppressHydrationWarning className="truncate">
                          {t(item.titleKey)}
                        </span>
                        {isActive && (
                          <span className="absolute left-0 w-1 h-5 bg-primary rounded-r-full group-data-[collapsible=icon]:hidden" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200/60 dark:border-slate-800/60 p-2 shrink-0 group">
        <SidebarPlanBadge />
        <div
          className={`flex w-full ${
            isCollapsed ? "flex-col gap-2" : "flex-row items-center justify-between"
          }`}
        >
          <SidebarProfile user={user} isLoading={isLoading} />
          <SidebarExtender />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
