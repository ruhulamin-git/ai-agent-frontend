import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";

import type { UserAgent } from "../types";

interface UserAgentCardProps {
  userAgent: UserAgent;
}

export const UserAgentCard = ({ userAgent }: UserAgentCardProps) => {
  const { t } = useTranslation();
  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    switch (status.toLowerCase()) {
      case "active":
        return "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary";
      case "inactive":
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
      case "error":
        return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <div className="group relative flex flex-col h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-card dark:bg-primary/5 p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 dark:hover:bg-primary/10 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Top Section: Avatar & Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            {userAgent.agent?.iconUrl ? (
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 group-hover:shadow-primary/20 transition-shadow duration-300">
                <img
                  src={userAgent.agent.iconUrl}
                  alt={userAgent.agent.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 group-hover:shadow-primary/20 transition-shadow duration-300">
                <span className="material-symbols-outlined text-primary text-2xl">smart_toy</span>
              </div>
            )}
            {userAgent.isActive && (
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm z-10" />
            )}
          </div>

          <Badge
            className={`${getStatusColor(
              userAgent.status
            )} border-0 font-semibold px-2.5 py-1 rounded-lg text-[10px]`}
          >
            {toTitleCase(userAgent.status || "Unknown")}
          </Badge>
        </div>

        {/* Content Section */}
        <div className="space-y-2 flex-1">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300 uppercase">
              {userAgent.name}
            </h3>
            <p className="text-[10px] font-semibold text-primary/70 dark:text-primary/60 uppercase tracking-wider mt-0.5">
              {toTitleCase(userAgent.agent?.agentType || "Agent")}
            </p>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
            {userAgent.agent?.description}
          </p>
        </div>

        {/* Bottom Section: Single Button */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link href={`/dashboard/my-agents/${userAgent.id}`} className="block">
            <Button
              size="sm"
              className="w-full h-10 rounded-lg text-xs font-bold bg-primary dark:bg-primary text-white dark:text-black hover:bg-primary transition-colors duration-300"
            >
              <span className="material-symbols-outlined text-base mr-2">tune</span>
              {t("pages.my_agents.manage_agent")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
