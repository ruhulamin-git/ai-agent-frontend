"use client";

import { useTranslation } from "react-i18next";

import { ErrorState } from "@/shared/components";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

import { DashboardAgentsSkeleton } from "../../agent-list/components";
import { usePlatformAgentsData } from "../hooks/usePlatformAgentsData";

import { PlatformAgentCard } from "./PlatformAgentCard";

import type { AgentType } from "../../shared/types";

export const PlatformAgentsPage = () => {
  const { t } = useTranslation();
  const { agents, isLoading, isError, refetch, search, setSearch, agentType, setAgentType } =
    usePlatformAgentsData();

  if (isLoading) {
    return <DashboardAgentsSkeleton />;
  }

  if (isError) {
    return (
      <div className="py-20">
        <ErrorState
          title={t("pages.agents.unable_to_load")}
          message={t("pages.agents.unable_to_load_message")}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Simple Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-400 dark:border-slate-600 pb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t("pages.agents.platform_title", "Platform Agents")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {t(
              "pages.agents.platform_description",
              "Official DevXHub verified agents and integrations."
            )}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-6">
        {/* Nested Filters */}
        <div className="flex flex-wrap gap-4">
          {/* Agent Type Filter */}
          <div className="w-48">
            <Select value={agentType} onValueChange={(val) => setAgentType(val as AgentType)}>
              <SelectTrigger className="bg-slate-50 dark:bg-primary/5 border-slate-300 dark:border-slate-700">
                <SelectValue placeholder={t("pages.agents.agent_type_all")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">{t("pages.agents.agent_type_all")}</SelectItem>
                <SelectItem value="messaging">{t("pages.agents.agent_type_messaging")}</SelectItem>
                <SelectItem value="embedded">{t("pages.agents.agent_type_embedded")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative group">
            <Input
              type="text"
              placeholder={t("pages.agents.search_placeholder")}
              className="h-10 pl-10 pr-4 bg-slate-50 dark:bg-primary/5 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-300 focus:bg-white dark:focus:bg-primary/10 focus:ring-slate-200 dark:focus:ring-primary/30 caret-slate-900 dark:caret-primary transition-all duration-300 rounded-lg w-full sm:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute left-3 top-0 bottom-0 flex items-center text-slate-400 dark:text-slate-500">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {agents.map((agent) => (
            <PlatformAgentCard key={agent.id} agent={agent} />
          ))}
        </div>

        {/* Empty State */}
        {agents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 dark:bg-slate-800 mb-6 rotate-3">
              <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">
                search_off
              </span>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              {t("pages.agents.no_agents_found")}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-75 mb-8">
              {search
                ? t("pages.agents.no_agents_search", { search })
                : t("pages.agents.no_agents_category_internal", "No platform agents found.")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
