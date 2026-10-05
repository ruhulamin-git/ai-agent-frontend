"use client";

import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

import { PageContainer } from "@/shared/components";

const MyCommunityAgentDetails = dynamic(
  () =>
    import("@/modules/marketplace/agents/community-agents/my-community-agent-detail").then(
      (mod) => mod.MyCommunityAgentDetails
    ),
  {
    loading: () => <div className="animate-pulse bg-slate-100 dark:bg-slate-800 h-96 rounded-xl" />,
  }
);

const MyCommunityAgentDetailPage = () => {
  const { t } = useTranslation();

  return (
    <PageContainer title={t("navigation.agents")} description={t("pages.agents.page_description")}>
      <MyCommunityAgentDetails />
    </PageContainer>
  );
};

export default MyCommunityAgentDetailPage;
