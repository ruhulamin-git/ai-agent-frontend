"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { ErrorState } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

import { DashboardAgentsSkeleton } from "../../../agent-list/components";
import { useMyCommunityAgentDetailData } from "../hooks";

import { OverviewSection } from "./OverviewSection";
import { SettingsSection } from "./SettingsSection";
import { SubscriptionSection } from "./UnsubscribeSection";

export const MyCommunityAgentDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { agentDetail, isLoading, isError, refetch, agentId } = useMyCommunityAgentDetailData();

  if (isLoading) {
    return <DashboardAgentsSkeleton />;
  }

  if (isError) {
    return (
      <div className="py-20">
        <ErrorState
          title={t("pages.agents.config_unavailable")}
          message={t("pages.agents.config_unavailable_message")}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!agentDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
          <span className="material-symbols-outlined text-3xl text-slate-400">search_off</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {t("pages.agents.agent_not_found")}
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          {t("pages.agents.agent_not_found_message")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold uppercase tracking-widest text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            {t("pages.my_agents.community_agent")}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase leading-none">
            {agentDetail.agent.name}
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
            Manage your subscription and settings for {agentDetail.agent.name}.
          </p>
        </div>

        {/* Back Button */}
        <Button
          onClick={() => router.push("/dashboard/my-agents?tab=community")}
          variant="outline"
          className="h-12 px-6 font-bold rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 w-full sm:w-auto uppercase tracking-wide text-xs transition-all"
        >
          <span className="material-symbols-outlined mr-2 text-lg">arrow_back</span>
          {t("pages.my_agents.back_to_my_agents")}
        </Button>
      </div>

      <div className="overflow-hidden">
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4 no-scrollbar">
            <TabsList className="backdrop-blur-sm p-1 rounded-xl h-auto self-start border border-slate-200/50 dark:border-slate-800/50">
              <TabsTrigger
                value="overview"
                className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all dark:data-[state=active]:text-white hover:dark:text-white flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">dashboard</span>
                {t("agentTabs.overview", "Overview")}
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all dark:data-[state=active]:text-white hover:dark:text-white flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">settings</span>
                {t("agentTabs.settings", "Settings")}
              </TabsTrigger>
              <TabsTrigger
                value="subscription"
                className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all dark:data-[state=active]:text-white hover:dark:text-white flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">credit_card</span>
                {t("agentTabs.subscription", "Subscription")}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-0 focus-visible:outline-none">
            <OverviewSection agentDetail={agentDetail} />
          </TabsContent>

          <TabsContent value="settings" className="mt-0 focus-visible:outline-none">
            <SettingsSection agentId={agentId} />
          </TabsContent>

          <TabsContent value="subscription" className="mt-0 focus-visible:outline-none">
            <SubscriptionSection agentDetail={agentDetail} agentId={agentId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
