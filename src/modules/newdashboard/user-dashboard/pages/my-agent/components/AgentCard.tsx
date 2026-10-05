"use client";

import { completePaymentForSubscription, resubscribeToAgent } from "../service/service";

import type { MyAgentSubscription } from "../service/types";

interface AgentCardProps {
  subscription: MyAgentSubscription;
}

export const AgentCard = ({ subscription }: AgentCardProps) => {
  // Handle both snake_case and camelCase properties for compatibility
  const agent = subscription.agent;
  const pricingPlan = (subscription as any).pricing_plan || (subscription as any).pricingPlan;
  const agentType = (agent as any)?.agent_type || (agent as any)?.agentType || "Unknown";
  const displayTitle =
    (agent as any)?.display_title || (agent as any)?.displayTitle || agent?.name || "Unknown Agent";
  const iconUrl = (agent as any)?.icon_url || (agent as any)?.iconUrl;
  const displayStatus =
    (subscription as any).display_status ||
    (subscription as any).displayStatus ||
    subscription.status;
  const subscribedAt = (subscription as any).subscribed_at || (subscription as any).subscribedAt;
  const currentPeriodEnd =
    (subscription as any).current_period_end || (subscription as any).currentPeriodEnd;
  const cancelledAt = (subscription as any).cancelled_at || (subscription as any).cancelledAt;
  const trialEndsAt = (subscription as any).trial_ends_at || (subscription as any).trialEndsAt;
  const canResubscribe =
    (subscription as any).can_resubscribe ?? (subscription as any).canResubscribe ?? false;

  // Normalize pricing plan properties
  const pricingType =
    (pricingPlan as any)?.pricing_type || (pricingPlan as any)?.pricingType || "unknown";
  const price = (pricingPlan as any)?.price || (pricingPlan as any)?.price;
  const currency = (pricingPlan as any)?.currency || (pricingPlan as any)?.currency;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      case "expired":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "expired":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPricingBadge = (pricingType: string) => {
    switch (pricingType) {
      case "free":
        return {
          text: "Free",
          color: "bg-green-500/20 text-green-400 border-green-500/30",
        };
      case "monthly":
        return {
          text: "Monthly",
          color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        };
      case "yearly":
        return {
          text: "Yearly",
          color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        };
      default:
        return {
          text: pricingType,
          color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
        };
    }
  };

  const getAgentIcon = (agentType: string) => {
    switch (agentType) {
      case "messaging":
        return "💬";
      case "content":
        return "✍️";
      case "analytics":
        return "📊";
      case "automation":
        return "🤖";
      default:
        return "🤖";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price: string, currency: string) => {
    return `${currency === "USD" ? "$" : currency}${price}`;
  };

  // Calculate next billing date if not provided
  const getNextBillingDate = () => {
    if (currentPeriodEnd) {
      return currentPeriodEnd;
    }

    // If no currentPeriodEnd but subscription is active, calculate based on pricing type
    if (subscription.status === "active" && subscribedAt && pricingType !== "free") {
      const subscribeDate = new Date(subscribedAt);
      if (pricingType === "monthly") {
        subscribeDate.setMonth(subscribeDate.getMonth() + 1);
        return subscribeDate.toISOString();
      } else if (pricingType === "yearly") {
        subscribeDate.setFullYear(subscribeDate.getFullYear() + 1);
        return subscribeDate.toISOString();
      }
    }

    return null;
  };

  const pricingBadge = getPricingBadge(pricingType);

  return (
    <div className="w-full h-full">
      <div className="relative w-full h-full min-h-80 rounded-xl p-4 flex flex-col overflow-hidden border border-gray-300 dark:border-white/10 hover:border-primary/30 bg-gray-100 dark:bg-gray-900/50 backdrop-blur-sm transition-all duration-500">
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="w-16 h-16 rounded-lg border border-primary/20 shadow-lg flex items-center justify-center bg-gray-200 dark:bg-gray-800/50">
              {iconUrl ? (
                <img
                  src={iconUrl}
                  alt={`${displayTitle} icon`}
                  className="w-12 h-12 rounded-md object-cover"
                />
              ) : (
                <span className="text-2xl">{getAgentIcon(agentType)}</span>
              )}
            </div>

            {/* Status */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-300 dark:border-white/10 bg-gray-200 dark:bg-gray-800/50">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${getStatusColor(
                    subscription.status
                  )}/40 opacity-75`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${getStatusColor(
                    subscription.status
                  )}`}
                />
              </span>
              <span className="text-[10px] font-bold text-gray-700 dark:text-white/90 uppercase tracking-wider">
                {subscription.status}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                {displayTitle}
              </h3>
              <div className={`px-2 py-1 rounded text-xs font-medium border ${pricingBadge.color}`}>
                {pricingBadge.text}
              </div>
            </div>

            {/* Pricing Plan Info */}
            <div className="bg-gray-200 dark:bg-gray-800/30 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 text-xs">Plan:</span>
                <span className="text-gray-900 dark:text-white text-sm font-medium">
                  {pricingPlan?.name || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400 text-xs">Price:</span>
                <span className="text-gray-900 dark:text-white text-sm font-medium">
                  {pricingType === "free"
                    ? "Free"
                    : price && currency && pricingType
                    ? `${formatPrice(price, currency)}/${pricingType}`
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* Subscription Details */}
            <div className="space-y-2 mb-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subscribed:</span>
                <span className="text-gray-700 dark:text-gray-300">{formatDate(subscribedAt)}</span>
              </div>

              {/* Show Next Billing for active subscriptions */}
              {subscription.status === "active" &&
                pricingType !== "free" &&
                getNextBillingDate() && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Next Billing:</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {formatDate(getNextBillingDate()!)}
                    </span>
                  </div>
                )}

              {/* Show Next Billing for pending subscriptions too */}
              {subscription.status === "pending" && getNextBillingDate() && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Next Billing:</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {formatDate(getNextBillingDate()!)}
                  </span>
                </div>
              )}

              {cancelledAt && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Cancelled:</span>
                  <span className="text-red-600 dark:text-red-400">{formatDate(cancelledAt)}</span>
                </div>
              )}

              {trialEndsAt && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Trial Ends:</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {formatDate(trialEndsAt)}
                  </span>
                </div>
              )}
            </div>

            {/* Status Badge */}
            <div className="mb-4">
              <div
                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                  subscription.status
                )}`}
              >
                {displayStatus}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto flex gap-2">
              {subscription.status === "active" ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const chatflowId =
                        subscription.replicatedChatflowId || subscription.replicated_chatflow_id;
                      if (chatflowId) {
                        if (subscription.type === "MULTIAGENT") {
                          window.location.href = `/ai-builder/agentcanvas/${chatflowId}`;
                        } else {
                          window.location.href = `/ai-builder/canvas/${chatflowId}`;
                        }
                      } else {
                        window.location.href = `/user-dashboard/my-agent/${subscription.id}`;
                      }
                    }}
                    className="flex-1 px-3 py-1.5 text-sm font-medium rounded bg-primary/20 hover:bg-primary/30 border border-primary/30 hover:border-primary/50 text-gray-900 dark:text-white transition-colors"
                  >
                    Use Agent
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      console.log("Manage button clicked");
                      window.location.href = `/user-dashboard/my-agent/${subscription.id}`;
                    }}
                    className="px-3 py-1.5 text-sm font-medium rounded border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                  >
                    Manage
                  </button>
                </>
              ) : subscription.status === "pending" ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    completePaymentForSubscription(subscription)
                      .then((response: any) => {
                        // Check if response contains checkout_url for redirect
                        if (response?.checkout_url) {
                          // Redirect to Stripe checkout
                          window.location.replace(response.checkout_url);
                        }
                      })
                      .catch((error) => {
                        console.error("Failed to complete payment:", error);
                        // Handle error appropriately - do nothing
                      });
                  }}
                  className="flex-1 px-3 py-1.5 text-sm font-medium rounded bg-yellow-100 dark:bg-yellow-600/20 hover:bg-yellow-200 dark:hover:bg-yellow-600/30 border border-yellow-300 dark:border-yellow-600/30 hover:border-yellow-400 dark:hover:border-yellow-600/50 text-yellow-700 dark:text-yellow-400 transition-colors"
                >
                  Complete Payment
                </button>
              ) : canResubscribe ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    resubscribeToAgent(subscription)
                      .then((response: any) => {
                        // Check if response contains checkout_url for redirect
                        if (response?.checkout_url) {
                          // Redirect to Stripe checkout
                          window.location.replace(response.checkout_url);
                        }
                      })
                      .catch((error) => {
                        console.error("Failed to resubscribe:", error);
                        // Do nothing - let user see current state
                      });
                  }}
                  className="flex-1 px-3 py-1.5 text-sm font-medium rounded bg-green-100 dark:bg-green-600/20 hover:bg-green-200 dark:hover:bg-green-600/30 border border-green-300 dark:border-green-600/30 hover:border-green-400 dark:hover:border-green-600/50 text-green-700 dark:text-green-400 transition-colors"
                >
                  Resubscribe
                </button>
              ) : (
                <button
                  type="button"
                  className="flex-1 px-3 py-1.5 text-sm font-medium rounded border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                  disabled
                >
                  {displayStatus}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
