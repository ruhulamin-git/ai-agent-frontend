"use client";

import { SubscriptionGuard } from "@/shared/components";
import { NewDashboard } from "@/modules/newdashboard/NewDashboard";

const DeveloperLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SubscriptionGuard redirectPath="/start-building" requireActiveSubscription={true} allowFreePlan={false}>
      <NewDashboard>{children}</NewDashboard>
    </SubscriptionGuard>
  );
};

export default DeveloperLayout;
