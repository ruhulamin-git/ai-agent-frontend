"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { PageContainer } from "@/shared/components";

const CommunityAgentDetail = dynamic(
  () =>
    import("@/modules/marketplace/agents/community-agents/components/CommunityAgentDetail").then(
      (mod) => mod.CommunityAgentDetail
    ),
  {
    loading: () => <div className="animate-pulse bg-slate-100 dark:bg-slate-800 h-96 rounded-xl" />,
  }
);

const Page = () => {
  const { t } = useTranslation();
  const params = useParams();
  const slug = params?.slug as string;

  return (
    <PageContainer title={t("navigation.agents")} description={t("pages.agents.page_description")}>
      <CommunityAgentDetail slug={slug} />
    </PageContainer>
  );
};

export default Page;
