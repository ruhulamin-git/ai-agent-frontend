"use client";

import { AlertTriangle, CheckCircle } from "lucide-react";

import { ConfirmDialog } from "@/shared/components";
import { Button } from "@/shared/ui/button";

import { useUnsubscribe } from "../hooks";

import type { MyCommunityAgentDetail } from "../types";

interface SubscriptionSectionProps {
  agentDetail: MyCommunityAgentDetail;
  agentId?: string | number; // Made optional since it's not used
}

export const SubscriptionSection = ({ agentDetail }: SubscriptionSectionProps) => {
  const { showConfirm, openConfirm, closeConfirm, handleUnsubscribe, isUnsubscribing } =
    useUnsubscribe({
      agentId: agentDetail.agent.id, // Use actual agent ID from agentDetail
      agentName: agentDetail.agent.name,
    });

  // Handle both real API structure and mock data structure
  const pricingPlan = agentDetail.pricingPlan;
  const subscription = agentDetail.subscription || {
    status: agentDetail.status,
    currentPeriodStart: agentDetail.currentPeriodStart,
    currentPeriodEnd: agentDetail.currentPeriodEnd,
  };

  // Check if user has active subscription
  const hasActiveSubscription =
    subscription?.status === "active" || subscription?.status === "trialing";
  const canCancel = agentDetail.canCancel !== false; // Default to true if not specified

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSubscribe = () => {
    // Navigate to agent detail page for subscription
    window.location.href = `/agents/${agentDetail.agent.id}`;
  };

  return (
    <div className="max-w-3xl space-y-8">
      {/* Subscription Overview */}
      <div className="bg-card rounded-2xl border border-border p-8 space-y-6">
        <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em]">
          Subscription Overview
        </h3>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Plan</p>
            <p className="text-lg font-bold text-foreground">
              {pricingPlan?.name || "Unknown Plan"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Price</p>
            <p className="text-lg font-bold text-foreground">
              ${pricingPlan?.price || "0"}/
              {pricingPlan?.pricingType === "monthly" || (pricingPlan as any)?.interval === "month"
                ? "mo"
                : "yr"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Status</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400 capitalize">
              {subscription?.status || "Unknown"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              Next Billing
            </p>
            <p className="text-lg font-bold text-foreground">
              {subscription?.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Action Section */}
      {hasActiveSubscription && canCancel ? (
        // Show Unsubscribe section for active subscriptions
        <div className="bg-red-500/5 rounded-2xl border border-red-500/20 p-8 space-y-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-500" size={20} />
            <h3 className="text-xs font-black text-red-500 uppercase tracking-[0.3em]">
              Danger Zone
            </h3>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Unsubscribing will cancel your subscription to <strong>{agentDetail.agent.name}</strong>
            . You will retain access until the end of your current billing period (
            {subscription?.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : "N/A"}).
          </p>

          <Button
            onClick={openConfirm}
            variant="outline"
            className="border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-600 font-bold rounded-xl uppercase tracking-wider text-xs"
          >
            <AlertTriangle className="mr-2" size={14} />
            Unsubscribe from Agent
          </Button>
        </div>
      ) : (
        // Show Subscribe section for inactive/cancelled subscriptions
        <div className="bg-primary/5 rounded-2xl border border-primary/20 p-8 space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-primary" size={20} />
            <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em]">
              Subscribe to Agent
            </h3>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {subscription?.status === "cancelled"
              ? `Your subscription to ${agentDetail.agent.name} has been cancelled. You can resubscribe anytime to regain access.`
              : `You don't have an active subscription to ${agentDetail.agent.name}. Subscribe now to start using this agent.`}
          </p>

          <Button
            onClick={handleSubscribe}
            className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl uppercase tracking-wider text-xs"
          >
            <CheckCircle className="mr-2" size={14} />
            Subscribe to Agent
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={(open) => {
          if (!open) {
            closeConfirm();
          }
        }}
        title="Confirm Unsubscribe"
        description={`Are you sure you want to unsubscribe from ${
          agentDetail.agent.name
        }? You will keep access until ${
          subscription?.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : "N/A"
        }.`}
        confirmLabel="Unsubscribe"
        confirmLoadingLabel="Processing..."
        onConfirm={handleUnsubscribe}
        isConfirming={isUnsubscribing}
        cancelLabel="Cancel"
        variant="destructive"
      />
    </div>
  );
};

// Export both names for backward compatibility
export const UnsubscribeSection = SubscriptionSection;
