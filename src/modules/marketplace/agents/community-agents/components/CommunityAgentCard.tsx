import { Star } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/button";

import { AgentAvatar } from "../../shared/components/AgentAvatar";

import type { Agent } from "../../shared/types";

interface CommunityAgentCardProps {
  agent: Agent;
  isPublic?: boolean;
  href?: string;
}

export const CommunityAgentCard = ({ agent, isPublic = false, href }: CommunityAgentCardProps) => {
  const { t } = useTranslation();

  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const defaultHref = isPublic
    ? `/agents/community/${agent.id}`
    : `/dashboard/agents/community/${agent.id}`;

  const linkHref = href || defaultHref;

  return (
    <div className="group relative flex flex-col h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-card dark:bg-primary/5 p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 dark:hover:bg-primary/10 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Top Section: Avatar & Role */}
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            <AgentAvatar
              agent={agent}
              size="sm"
              className="w-14 h-14 rounded-2xl ring-0 group-hover:shadow-primary/10 transition-all duration-300"
            />
          </div>

          <div className="flex flex-col items-end gap-1">
            {Number(agent.averageRating) > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {Number(agent.averageRating).toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-2 flex-1">
          <div>
            <h3
              className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300 uppercase truncate"
              title={agent.name}
            >
              {agent.name}
            </h3>
            <p className="text-[10px] font-semibold text-primary/70 dark:text-primary/60 uppercase tracking-wider mt-0.5">
              {toTitleCase(agent.role || "Agent")}
            </p>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
            {agent.description}
          </p>
        </div>

        {/* Bottom Section: Price & View Details */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
              Subscription
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white flex items-baseline gap-1">
              {agent.price}
              {agent.price !== "Free" && agent.billingPeriod === "monthly" && (
                <span className="text-[10px] text-slate-500 font-medium">/mo</span>
              )}
            </span>
          </div>

          <Link href={linkHref}>
            <Button
              size="sm"
              className="h-10 px-5 rounded-lg text-xs font-bold bg-primary dark:bg-primary text-white dark:text-black hover:bg-primary transition-all duration-300 shadow-md shadow-primary/10"
            >
              {t("pages.agents.view_details", "Detail")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
