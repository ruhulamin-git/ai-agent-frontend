"use client";

import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";

import { CircularLoader, PageContainer } from "@/shared/components";

const UserAgentSettings = lazy(() =>
  import(
    "@/modules/marketplace/agents/user-agents/web-agent/chat/components/UserAgentSettings"
  ).then((mod) => ({ default: mod.UserAgentSettings }))
);

const UserAgentSettingsPage = () => {
  const { t } = useTranslation();

  return (
    <PageContainer
      title={t("pages.my_agents.agent_settings.title")}
      description={t("pages.my_agents.agent_settings.description")}
    >
      <Suspense fallback={<CircularLoader />}>
        <UserAgentSettings />
      </Suspense>
    </PageContainer>
  );
};

export default UserAgentSettingsPage;
