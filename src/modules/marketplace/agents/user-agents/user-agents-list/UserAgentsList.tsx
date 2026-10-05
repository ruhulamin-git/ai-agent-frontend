"use client";

import { useTranslation } from "react-i18next";

import { PageContainer } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

import { CommunityTab } from "./components/CommunityTab";
import { MyAgentsTab } from "./components/MyAgentsTab";

export const UserAgentsList = () => {
  const { t } = useTranslation();

  const tabOptions = [
    { value: "platform", label: t("pages.my_agents.platform"), icon: "verified" },
    { value: "community", label: t("pages.my_agents.community"), icon: "groups" },
  ];

  return (
    <PageContainer
      title={t("pages.my_agents.page_title")}
      description={t("pages.my_agents.page_description")}
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold uppercase tracking-widest text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            {t("pages.my_agents.agent_management")}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
            {t("pages.my_agents.page_title")}
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
            {t("pages.my_agents.page_description")}
          </p>
        </div>

        {/* Create Agent Button */}
        <Button
          onClick={() => (window.location.href = "/dashboard/agents")}
          className="h-12 px-6 bg-primary hover:bg-primary/90 font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto uppercase tracking-wide text-xs text-white dark:text-black"
        >
          <span className="material-symbols-outlined mr-2 text-lg">add</span>
          {t("pages.my_agents.create_new_agent")}
        </Button>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="platform" className="w-full">
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4 no-scrollbar">
          <TabsList className="backdrop-blur-sm p-1 rounded-xl h-auto self-start border border-slate-200/50 dark:border-slate-800/50">
            {tabOptions.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all dark:data-[state=active]:text-white hover:dark:text-white flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="platform" className="mt-0 focus-visible:outline-none">
          <MyAgentsTab />
        </TabsContent>

        <TabsContent value="community" className="mt-0 focus-visible:outline-none">
          <CommunityTab />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};
