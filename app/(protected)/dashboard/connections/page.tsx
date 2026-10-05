"use client";

import { useTranslation } from "react-i18next";

import { ConnectionsPage } from "@/modules/marketplace/connections";
import { PageContainer } from "@/shared/components";

const Page = () => {
  const { t } = useTranslation();

  return (
    <PageContainer
      title={t("pages.connections.title")}
      description={t("pages.connections.description")}
    >
      <ConnectionsPage />
    </PageContainer>
  );
};

export default Page;
