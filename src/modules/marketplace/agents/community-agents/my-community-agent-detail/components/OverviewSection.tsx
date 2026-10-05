"use client";

import { CheckCircle, Star } from "lucide-react";

import { AgentAvatar } from "../../../shared/components/AgentAvatar";

import type { MyCommunityAgentDetail } from "../types";

interface OverviewSectionProps {
  agentDetail: MyCommunityAgentDetail;
}

export const OverviewSection = ({ agentDetail }: OverviewSectionProps) => {
  // Handle both real API structure and mock data structure
  const agent = agentDetail.agent;

  // For pricing plan - check both structures
  const pricingPlan = agentDetail.pricingPlan;

  // For subscription - real API has fields at root level, mock has nested subscription object
  const subscription = agentDetail.subscription || {
    status: agentDetail.status,
    currentPeriodStart: agentDetail.currentPeriodStart,
    currentPeriodEnd: agentDetail.currentPeriodEnd,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="flex flex-col md:flex-row items-start gap-8">
        <AgentAvatar
          agent={{
            icon: "",
            color: "#0f172a", // Slate-900 instead of indigo
            imageUrl: agent.iconUrl ?? undefined,
            name: agent.name,
          }}
          size="lg"
          className="w-24 h-24 rounded-3xl shadow-xl"
        />

        <div className="flex-1 space-y-3">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-foreground tracking-tight uppercase">
              {agent.name}
            </h2>
            <p className="text-sm font-bold text-primary uppercase tracking-widest">
              {agent.role || "Agent"}
            </p>
          </div>

          <p className="max-w-2xl text-slate-600 dark:text-slate-400 leading-relaxed">
            {agent.description}
          </p>

          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">
                {subscription?.status || "Unknown"}
              </span>
            </div>
            {agent.averageRating && Number(agent.averageRating) > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                <Star className="text-yellow-500 fill-current" size={12} />
                <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest">
                  {Number(agent.averageRating).toFixed(1)} Rating
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-2xl border border-border p-6 space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Current Plan
          </p>
          <p className="text-2xl font-black text-foreground">
            {pricingPlan?.name || "Unknown Plan"}
          </p>
          <p className="text-sm text-slate-500">
            ${pricingPlan?.price || "0"}/
            {pricingPlan?.pricingType === "monthly" || (pricingPlan as any)?.interval === "month"
              ? "mo"
              : "yr"}
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Billing Period
          </p>
          <p className="text-lg font-bold text-foreground">
            {subscription?.currentPeriodStart ? formatDate(subscription.currentPeriodStart) : "N/A"}
          </p>
          <p className="text-sm text-slate-500">
            to {subscription?.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : "N/A"}
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Usage Limits
          </p>
          <p className="text-lg font-bold text-foreground">
            {pricingPlan?.maxMessagesPerMonth === -1
              ? "Unlimited"
              : pricingPlan?.maxMessagesPerMonth
              ? `${pricingPlan.maxMessagesPerMonth.toLocaleString()}`
              : "N/A"}{" "}
            msgs/mo
          </p>
          <p className="text-sm text-slate-500">
            {pricingPlan?.maxIntegrations === -1
              ? "Unlimited"
              : pricingPlan?.maxIntegrations || "N/A"}{" "}
            integrations
          </p>
        </div>
      </div>

      {/* Capabilities */}
      {agent.capabilities && agent.capabilities.length > 0 && (
        <div>
          <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-6">
            Capabilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agent.capabilities.map((cap) => (
              <div
                key={cap}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
              >
                <CheckCircle className="text-primary shrink-0" size={18} />
                <span className="font-bold text-sm uppercase tracking-tight">{cap}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
