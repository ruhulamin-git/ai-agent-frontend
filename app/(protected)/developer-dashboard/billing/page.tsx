import { SubscriptionDashboard } from "@/modules/pricing/New-subscription-dashboard/SubscriptionDashboard";

const DeveloperBillingPage = () => {
  return (
    <div className="p-4 lg:p-6 overflow-y-auto scrollbar-thin">
      <SubscriptionDashboard />
    </div>
  );
};

export default DeveloperBillingPage;
