"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useTranslation } from "react-i18next";

import { PageContainer } from "@/shared/components";
import { Button } from "@/shared/ui/button";

const DashboardAgentDetail = dynamic(
  () => import("@/modules/marketplace/dashboard").then((mod) => mod.DashboardAgentDetail),
  {
    loading: () => <div className="animate-pulse bg-slate-100 dark:bg-slate-800 h-96 rounded-xl" />,
  }
);

interface PageProps {
  params: Promise<{ slug: string }>;
}

const Page = ({ params }: PageProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { slug } = use(params);

  return (
    <PageContainer title="Agent Details" description="Manage and configure your AI agent.">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/agents")}
          className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white pl-0 gap-2"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          {t("pages.agents.back_to_marketplace")}
        </Button>
      </div>

      <DashboardAgentDetail slug={slug} />
    </PageContainer>
  );
};

export default Page;
