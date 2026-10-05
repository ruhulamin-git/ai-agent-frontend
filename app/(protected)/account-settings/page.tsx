"use client";

import { useTranslation } from "react-i18next";

import { UserAccount } from "@/modules/account-settings";
import { PageContainer } from "@/shared/components";
import { NewDashboard } from "@/modules/newdashboard/NewDashboard";

const AccountSettingsPage = () => {
  const { t } = useTranslation();

  return (
    <PageContainer
      title={t("navigation.account_settings")}
      description={t("pages.account_settings.manage_your_account_settings")}
    >
    <NewDashboard>
     <UserAccount />
    </NewDashboard>
    </PageContainer>
    
  );
};

export default AccountSettingsPage;
