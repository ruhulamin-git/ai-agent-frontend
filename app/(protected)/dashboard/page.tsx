"use client";

import { useTranslation } from "react-i18next";

import { DashboardOverview } from "@/modules/marketplace/dashboard";
import { PageContainer } from "@/shared/components";

const DashboardPage = () => {
  const { t } = useTranslation();

  return (
    <PageContainer title={t("navigation.dashboard")} description={t("dashboard.welcome")}>
      <DashboardOverview />
    </PageContainer>
  );
};

export default DashboardPage;
