"use client";

import { useTranslation } from "react-i18next";

import { AgentCard, DashboardAgentsSkeleton, useAgentsData } from "@/modules/marketplace/agents";
import { CommunityAgentCard } from "@/modules/marketplace/agents/community-agents/components/CommunityAgentCard";
import { MarketplaceExternalAgentCard } from "@/modules/marketplace/agents/external-agents/components/MarketplaceExternalAgentCard";
import { ErrorState } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

import type { AgentType, Category } from "@/modules/marketplace/agents";

const categories: Category[] = ["internal", "user_created", "external"];

export const DashboardAgentsPage = () => {
  const { t } = useTranslation();
  const {
    agents: filteredAgents,
    isLoading,
    isError,
    refetch,
    search,
    setSearch,
    category,
    setCategory,
    agentType,
    setAgentType,
    page,
    setPage,
    pagination,
    isCommunity,
  } = useAgentsData({ isPublic: false });

  const handleCategoryChange = (value: string) => {
    const newCategory = value as Category;
    setCategory(newCategory);
    setPage(1);

    // Update URL without triggering navigation
    window.history.replaceState(null, "", `?tab=${newCategory}`);
  };

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
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold uppercase tracking-widest text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            {t("pages.agents.marketplace_badge", "AI Workforce Marketplace")}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
            {t("pages.agents.marketplace_title")}
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
            {t("pages.agents.marketplace_description")}
          </p>
        </div>
      </div>

      {/* Tabs for Categories */}
      <Tabs value={category} onValueChange={handleCategoryChange} className="w-full">
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4 no-scrollbar">
          <TabsList className="backdrop-blur-sm p-1 rounded-xl h-auto self-start border border-slate-200/50 dark:border-slate-800/50">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all dark:data-[state=active]:text-white hover:dark:text-white flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {cat === "internal" ? "verified" : cat === "external" ? "link" : "groups"}
                </span>
                {t(`pages.agents.category_${cat.toLowerCase()}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {categories.map((cat) => (
          <TabsContent key={cat} value={cat} className="mt-4 space-y-6">
            {/* Nested Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Agent Type Filter — only for platform agents */}
              {cat === "internal" && (
                <div className="w-48">
                  <Select value={agentType} onValueChange={(val) => setAgentType(val as AgentType)}>
                    <SelectTrigger className="bg-slate-50 dark:bg-primary/5 border-slate-300 dark:border-slate-700">
                      <SelectValue placeholder={t("pages.agents.agent_type_all")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">{t("pages.agents.agent_type_all")}</SelectItem>
                      <SelectItem value="messaging">
                        {t("pages.agents.agent_type_messaging")}
                      </SelectItem>
                      <SelectItem value="embedded">
                        {t("pages.agents.agent_type_embedded")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="relative group">
                <Input
                  type="text"
                  placeholder={t("pages.agents.search_placeholder")}
                  className="h-10 pl-10 pr-4 bg-slate-50 dark:bg-primary/5 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-300 focus:bg-white dark:focus:bg-primary/10 focus:ring-slate-200 dark:focus:ring-primary/30 caret-slate-900 dark:caret-primary transition-all duration-300 rounded-lg w-full sm:w-64"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    if (isCommunity) setPage(1);
                  }}
                />
                <div className="absolute left-3 top-0 bottom-0 flex items-center text-slate-400 dark:text-slate-500">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
              </div>
            </div>

            {/* Grid Section */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {filteredAgents.map((agent) =>
                cat === "user_created" ? (
                  <CommunityAgentCard key={agent.id} agent={agent} />
                ) : cat === "external" ? (
                  <MarketplaceExternalAgentCard key={agent.id} agent={agent} />
                ) : (
                  <AgentCard key={agent.id} agent={agent} />
                )
              )}
            </div>

            {/* Pagination — only for community tab */}
            {cat === "user_created" && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="gap-1"
                >
                  <span className="material-symbols-outlined text-base">chevron_left</span>
                  {t("common.previous", "Previous")}
                </Button>
                <span className="text-sm text-slate-500 dark:text-slate-400 px-3">
                  {t("common.page_of", "Page {{page}} of {{total}}", {
                    page,
                    total: pagination.totalPages,
                  })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="gap-1"
                >
                  {t("common.next", "Next")}
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </Button>
              </div>
            )}

            {/* Empty State */}
            {filteredAgents.length === 0 && (
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
                    : t("pages.agents.no_agents_category", { category: cat })}
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
