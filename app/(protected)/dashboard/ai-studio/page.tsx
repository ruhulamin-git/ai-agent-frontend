"use client";

import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

import { PageContainer } from "@/shared/components";

const AgentList = dynamic(
  () => import("@/modules/studio/manage-agents").then((mod) => mod.AgentList),
  {
    loading: () => (
      <div className="space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="space-y-3">
            <div className="w-32 h-6 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
            <div className="w-64 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="w-96 max-w-full h-6 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
          {[...Array(4)].map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    ),
  }
);

const Page = () => {
  const { t } = useTranslation();

  return (
    <PageContainer
      title={t("pages.ai_studio.title")}
      description={t("pages.ai_studio.description")}
    >
      <AgentList />
    </PageContainer>
  );
};

export default Page;
