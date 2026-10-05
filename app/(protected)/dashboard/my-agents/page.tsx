"use client";

import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

import { UserAgentCardSkeleton } from "@/modules/marketplace/agents";
import { PageContainer } from "@/shared/components";

const UserAgentsList = dynamic(
  () => import("@/modules/marketplace/agents").then((mod) => mod.UserAgentsList),
  {
    loading: () => (
      <div className="space-y-10">
        {/* Matching the UserAgentsList header structure */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="space-y-3">
            <div className="w-32 h-6 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
            <div className="w-64 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="w-96 max-w-full h-6 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="w-full sm:w-72 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="w-full sm:w-48 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
          {[...Array(8)].map((_, index) => (
            <UserAgentCardSkeleton key={`page-skeleton-${index}`} />
          ))}
        </div>
      </div>
    ),
  }
);

const MyAgentsPage = () => {
  const { t } = useTranslation();

  return (
    <PageContainer
      title={t("pages.my_agents.title")}
      description={t("pages.my_agents.description")}
    >
      <UserAgentsList />
    </PageContainer>
  );
};

export default MyAgentsPage;
