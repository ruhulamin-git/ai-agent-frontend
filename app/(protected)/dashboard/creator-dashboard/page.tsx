"use client";

import { useTranslation } from "react-i18next";

import { CreatorDashboardOverview } from "@/modules/studio/creator-dashboard";
import { PageContainer } from "@/shared/components";

const CreatorDashboardPage = () => {
  const { t } = useTranslation();

  return (
    <PageContainer
      title={t("navigation.creator_dashboard", "Creator Dashboard")}
      description={t(
        "dashboard.creator_welcome",
        "Manage your AI agents and track your performance"
      )}
    >
      <CreatorDashboardOverview />
    </PageContainer>
  );
};

export default CreatorDashboardPage;
