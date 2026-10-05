import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/button";

import { AgentAvatar } from "../../shared/components/AgentAvatar";

import type { Agent } from "../../shared/types";

interface PlatformAgentCardProps {
  agent: Agent;
  isPublic?: boolean;
}

export const PlatformAgentCard = ({ agent, isPublic = false }: PlatformAgentCardProps) => {
  const { t } = useTranslation();

  const href = isPublic ? `/agents/platform/${agent.id}` : `/dashboard/agents/platform/${agent.id}`;

  return (
    <Link
      href={href}
      className="group relative flex flex-col h-full rounded-xl py-6 px-4 transition-all duration-300 border border-white/10 hover:border-primary/30 overflow-hidden bg-[#F6F6F6] dark:bg-primary/5"
    >
      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 -z-10" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-6 md:mb-8">
          <div className="flex gap-3 md:gap-5 flex-1 min-w-0">
            <AgentAvatar agent={agent} size="sm" className="shrink-0" />
            <div className="flex-1 min-w-0">
              <h3
                className="text-lg font-bold truncate group-hover:text-primary transition-colors duration-300 flex items-center gap-1.5"
                title={agent.name}
              >
                {agent.name}
                <CheckCircle2
                  className="w-4 h-4 text-blue-500"
                  fill="currentColor"
                  stroke="white"
                />
              </h3>
              <p className="text-primary font-medium text-xs md:text-sm tracking-wide">
                {agent.role}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p className="font-medium text-xs flex items-center gap-1 text-slate-500">
                  <CheckCircle2 className="w-3 h-3 text-slate-500" />
                  Official DevXHub Agent
                </p>
              </div>
            </div>
            <p className="max-w-3xl text-xl font-bold text-primary dark:text-primary leading-relaxed">
              Platform
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6 flex-1">
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
            {agent.description}
          </p>
        </div>

        <div className="mt-auto">
          <Button
            size="sm"
            className="w-full h-12 rounded-xl bg-primary/50 border border-primary/30 text-slate text-sm font-bold group-hover:bg-primary group-hover:text-white dark:group-hover:text-black transition-all duration-300 flex items-center justify-center gap-2"
          >
            {t("pages.agents.create_agent", "Configure Agent")}
            <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
          </Button>
        </div>
      </div>
    </Link>
  );
};
