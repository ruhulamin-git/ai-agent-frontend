"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

import { subscriptionService, resubscribeToAgent } from "../../service/service";

import type { MyAgentSubscription } from "../../service/types";

interface AdvancedTabProps {
  subscription: MyAgentSubscription;
}

export const AdvancedTab = ({ subscription }: AdvancedTabProps) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [isResubscribing, setIsResubscribing] = useState(false);
  const [localCancelStatus, setLocalCancelStatus] = useState<boolean | null>(null);

  useEffect(() => {
    // Reset cancellation state when subscription changes heavily
    setLocalCancelStatus(null);
  }, [subscription?.id]);

  const isCurrentlyCancelled = localCancelStatus !== null
    ? localCancelStatus
    : (subscription?.cancel_at_period_end || subscription?.status === "cancelled");

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    setIsUnsubscribing(true);
    try {
      await subscriptionService.cancelSubscription(subscription.agent.id);
      toast.success("Subscription cancelled successfully!");
      setShowCancelDialog(false);
      setLocalCancelStatus(true);
    } catch (error: any) {
      console.error("Error cancelling subscription:", error);
      toast.error(error.message || "Failed to cancel subscription. Please try again.");
    } finally {
      setIsUnsubscribing(false);
    }
  };

  const handleResubscribe = async () => {
    if (!subscription) return;

    setIsResubscribing(true);
    try {
      const response: any = await resubscribeToAgent(subscription);

      if (response?.checkout_url) {
        window.location.replace(response.checkout_url);
      } else {
        toast.success("Successfully resubscribed!");
        setLocalCancelStatus(false);
      }
    } catch (error: any) {
      console.error("Error resubscribing:", error);
      toast.error(error.message || "Failed to resubscribe. Please try again.");
    } finally {
      setIsResubscribing(false);
    }
  };

  return (
    <div className="space-y-6">
      {!isCurrentlyCancelled ? (
        <Card className="bg-red-50 dark:bg-red-900/20 backdrop-blur-sm border border-red-300 dark:border-red-700/50">
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
              <span>⚠️</span> Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-gray-900 dark:text-white font-semibold mb-2">Cancel Subscription</h4>
              <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                Once you cancel, you&apos;ll lose access to this agent at the end of your billing
                period. This action cannot be undone.
              </p>
              <button
                onClick={() => setShowCancelDialog(true)}
                className="px-4 py-2 text-sm font-medium rounded bg-red-100 dark:bg-red-600/20 hover:bg-red-200 dark:hover:bg-red-600/30 border border-red-300 dark:border-red-600/30 text-red-700 dark:text-red-400 transition-colors"
              >
                Cancel Subscription
              </button>

              {showCancelDialog && (
                <div className="mt-4 p-4 bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-700/50 rounded-lg">
                  <h4 className="text-red-700 dark:text-red-400 font-semibold mb-2">Confirm Cancellation</h4>
                  <p className="text-red-800 dark:text-red-200 text-sm mb-4">
                    Are you absolutely sure? This will cancel your subscription and you&apos;ll lose
                    access to this agent.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelSubscription}
                      disabled={isUnsubscribing}
                      className="px-4 py-2 text-sm font-medium rounded bg-red-100 dark:bg-red-600/20 hover:bg-red-200 dark:hover:bg-red-600/30 border border-red-300 dark:border-red-600/30 text-red-700 dark:text-red-300 transition-colors disabled:opacity-50"
                    >
                      {isUnsubscribing ? "Cancelling..." : "Yes, Unsubscribe !"}
                    </button>
                    <button
                      onClick={() => setShowCancelDialog(false)}
                      className="px-4 py-2 text-sm font-medium rounded border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                    >
                      Keep Subscription
                    </button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-blue-50 dark:bg-blue-900/20 backdrop-blur-sm border border-blue-300 dark:border-blue-700/50">
          <CardHeader>
            <CardTitle className="text-blue-700 dark:text-blue-400 flex items-center gap-2">
              <span>ℹ️</span> Subscription Cancelled
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                Your subscription has been cancelled and will not renew. You will lose access to this agent at the end of the current billing period.
              </p>
              <button
                onClick={handleResubscribe}
                disabled={isResubscribing}
                className="px-4 py-2 text-sm font-medium rounded bg-blue-100 dark:bg-blue-600/20 hover:bg-blue-200 dark:hover:bg-blue-600/30 border border-blue-300 dark:border-blue-600/30 text-blue-700 dark:text-blue-400 transition-colors disabled:opacity-50"
              >
                {isResubscribing ? "Resubscribing..." : "Resubscribe"}
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
