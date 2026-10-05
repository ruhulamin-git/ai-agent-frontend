"use client";

import { IconLayoutDashboard, IconSparkles } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { useSidebar } from "@/shared/ui/sidebar";

interface SidebarRoleSwitcherProps {
  activeModule: "marketplace" | "studio";
  onModuleChange: (module: "marketplace" | "studio") => void;
}

export const SidebarRoleSwitcher = ({ activeModule, onModuleChange }: SidebarRoleSwitcherProps) => {
  const router = useRouter();

  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const modules = [
    {
      id: "marketplace" as const,
      name: "Marketplace",
      short: "M",
      icon: IconLayoutDashboard,
      color: "from-blue-600 to-indigo-600",
      description: "Browse & Hire Agents",
      url: "/dashboard",
    },
    {
      id: "studio" as const,
      name: "AI Studio",
      short: "S",
      icon: IconSparkles,
      color: "from-orange-500 to-amber-600",
      description: "Create & Manage Agents",
      url: "/dashboard/creator-dashboard",
    },
  ];

  const currentModule = modules.find((m) => m.id === activeModule) || modules[0];
  const otherModule = modules.find((m) => m.id !== activeModule) || modules[1];
  const CurrentModuleIcon = currentModule.icon;
  const SWITCH_ROTATION_DEG = 180;

  const handleSwitch = () => {
    onModuleChange(otherModule.id);
    router.push(otherModule.url);
  };

  return (
    <div className={`px-4 pb-6 ${isCollapsed ? "flex justify-center" : ""}`}>
      <button
        onClick={handleSwitch}
        className={`
          flex items-center gap-3 p-1.5 group focus:outline-none relative cursor-pointer
          ${
            isCollapsed
              ? "justify-center"
              : "w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-800/80 active:scale-[0.98]"
          }
        `}
      >
        <div className="relative shrink-0 flex items-center justify-center h-10 w-10">
          {/* Inner Circle (The Icon) */}
          <div className="relative h-7 w-7 rounded-full overflow-hidden shadow-md border-2 border-white dark:border-slate-900 z-10 font-sans cursor-pointer">
            <div className={`absolute inset-0 bg-linear-to-br ${currentModule.color}`} />
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <CurrentModuleIcon size={14} stroke={2.2} />
            </div>
          </div>
        </div>

        {!isCollapsed && (
          <>
            <div className="flex flex-col items-start overflow-hidden text-left flex-1 min-w-0 justify-center">
              <span className="text-[12px] font-black uppercase tracking-wider text-slate-900 dark:text-white truncate w-full leading-tight">
                {currentModule.name}
              </span>
            </div>

            {/* Facebook-style Switcher Icon */}
            <div className="ml-1 mr-1 relative shrink-0 flex items-center justify-center w-7 h-7 opacity-75 group-hover:opacity-100 transition-opacity">
              <motion.div
                animate={{ rotate: activeModule === "marketplace" ? 0 : SWITCH_ROTATION_DEG }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                style={{ position: "absolute", inset: 0 }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-full h-full text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M 4 12 A 8 8 0 0 1 18 6" />
                    <polyline points="14 6 18 6 18 2" />
                    <path d="M 20 12 A 8 8 0 0 1 6 18" />
                    <polyline points="10 18 6 18 6 22" />
                  </g>
                </svg>
              </motion.div>
            </div>
          </>
        )}
      </button>
    </div>
  );
};
