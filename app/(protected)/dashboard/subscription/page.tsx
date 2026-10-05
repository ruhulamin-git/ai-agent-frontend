"use client";

import dynamic from "next/dynamic";

import { CircularLoader, PageContainer } from "@/shared/components";

// Ensure we don't block the UI while loading
const SubscriptionDashboard = dynamic(
  () =>
    import("@/modules/pricing/subscription-dashboard/SubscriptionDashboard").then(
      (mod) => mod.SubscriptionDashboard
    ),
  { loading: () => <CircularLoader /> }
);

const SubscriptionSettingsPage = () => {
  return (
    <PageContainer
      title="Subscription Management"
      description="Manage your subscription and billing"
    >
      <SubscriptionDashboard />
    </PageContainer>
  );
};

export default SubscriptionSettingsPage;
