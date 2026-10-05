"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

import type { MyAgentSubscription } from "../../service/types";

interface GeneralTabProps {
  subscription: MyAgentSubscription;
}

export const GeneralTab = ({ subscription }: GeneralTabProps) => {
  const agent = subscription.agent;
  const pricingPlan = (subscription as any).pricing_plan || (subscription as any).pricingPlan;
  const displayTitle =
    (agent as any)?.display_title || (agent as any)?.displayTitle || agent?.name || "Agent";
  const iconUrl = (agent as any)?.icon_url || (agent as any)?.iconUrl;
  const subscribedAt = (subscription as any).subscribed_at || (subscription as any).subscribedAt;
  const currentPeriodEnd =
    (subscription as any).current_period_end || (subscription as any).currentPeriodEnd;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 dark:text-green-400";
      case "pending":
        return "text-yellow-600 dark:text-yellow-400";
      case "cancelled":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Agent Info */}
      <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Agent Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg border border-primary/20 shadow-lg flex items-center justify-center bg-gray-200 dark:bg-gray-800/50">
              {iconUrl ? (
                <img
                  src={iconUrl}
                  alt={`${displayTitle} icon`}
                  className="w-12 h-12 rounded-md object-cover"
                />
              ) : (
                <span className="text-2xl">🤖</span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{displayTitle}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Agent ID: {agent.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Details */}
      <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Subscription Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
              <p className={`text-lg font-semibold capitalize ${getStatusColor(subscription.status)}`}>
                {subscription.status}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Plan</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{pricingPlan?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pricing</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {(pricingPlan?.pricing_type || pricingPlan?.pricingType) === "free"
                  ? "Free"
                  : `$${pricingPlan?.price}/${pricingPlan?.pricing_type || pricingPlan?.pricingType}`}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Billing Cycle</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {pricingPlan?.pricing_type || pricingPlan?.pricingType || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Subscribed On</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(subscribedAt)}</p>
            </div>
            {currentPeriodEnd && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Next Billing Date</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(currentPeriodEnd)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Plan Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>API Access</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>Widget Customization</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
