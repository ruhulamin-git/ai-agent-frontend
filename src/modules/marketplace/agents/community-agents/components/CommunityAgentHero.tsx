import { CheckCircle, Star } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/shared/ui/button";

import { AgentAvatar } from "../../shared/components/AgentAvatar";
import { useAgentPricingPlans } from "../services/getAgentPricingPlans";
import { useSubscribeToAgent } from "../services/subscribeToAgent";

import type { Agent } from "../../shared/types";

interface CommunityAgentHeroProps {
  agent: Agent;
}

export const CommunityAgentHero = ({ agent }: CommunityAgentHeroProps) => {
  const { t } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly" | "free">("monthly");

  const { data: pricingPlans = [], isLoading: isLoadingPlans } = useAgentPricingPlans({
    id: agent.id,
  });

  const { mutate: subscribeToAgent, isPending: isSubscribing } = useSubscribeToAgent({
    config: {
      onSuccess: (data) => {
        if (!data) return;
        if (data.data.checkoutUrl) {
          window.location.href = data.data.checkoutUrl;
        } else if (data.data.purchase.status === "active") {
          toast.success(t("pages.agents.subscribe_success", "Successfully subscribed to agent"));
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to subscribe to agent");
      },
    },
  });

  const handleSubscribe = (pricingPlanId: number) => {
    subscribeToAgent({ agentId: agent.id, data: { pricingPlanId } });
  };

  return (
    <div className="relative w-full bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative px-6 pt-12 pb-16 border-b border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-8">
          <div className="relative shrink-0">
            <AgentAvatar
              agent={{
                icon: agent.icon,
                color: agent.color,
                imageUrl: (agent as { imageUrl?: string }).imageUrl,
                name: agent.name,
              }}
              size="lg"
              className="w-32 h-32 rounded-3xl shadow-2xl"
            />
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-foreground tracking-tight uppercase">
                {agent.name}
              </h2>
              <p className="text-lg text-primary font-bold uppercase tracking-wider">
                {agent.role}
              </p>
            </div>

            <p className="max-w-3xl text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium line-clamp-3">
              {agent.description || "No description provided for this agent."}
            </p>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-border">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                  Official Release
                </span>
              </div>
              {Number(agent.averageRating) > 0 && (
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
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16">
        <main className="space-y-12">
          <section>
            <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4">
              Overview
            </h3>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {agent.description || "Detailed information about this agent is being synchronized."}
              </p>
            </div>
          </section>

          {/* Capabilities based on actual Agent data if available */}
          {agent.capabilities && agent.capabilities.length > 0 && (
            <section>
               <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-6">
                Capabilities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agent.capabilities.map((cap: string) => (
                   <div key={cap} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                    <CheckCircle className="text-primary" size={18} />
                    <span className="font-bold text-sm uppercase tracking-tight">{cap}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Sidebar - Pricing Focus */}
        <aside>
          <div className="sticky top-24 space-y-8">
            <div className="bg-card rounded-3xl border border-border p-8 shadow-xl shadow-black/5 dark:shadow-primary/5">
              {isLoadingPlans ? (
                <div className="text-center py-12 animate-pulse space-y-4">
                  <div className="h-4 bg-muted w-24 mx-auto rounded" />
                  <div className="h-10 bg-muted w-32 mx-auto rounded" />
                </div>
              ) : pricingPlans && pricingPlans.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-foreground text-[10px] font-black uppercase tracking-widest border-b-2 border-primary pb-1">
                      Billing Options
                    </h4>
                    <div className="flex bg-muted p-1 rounded-xl border border-border">
                      {["monthly", "yearly", "free"].map((cycle) => (
                        pricingPlans?.some((p) => p.pricingType === cycle) && (
                          <button
                            key={cycle}
                            onClick={() => setBillingCycle(cycle as any)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${
                              billingCycle === cycle
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {cycle}
                          </button>
                        )
                      ))}
                    </div>
                  </div>

                  {pricingPlans
                    ?.filter((p) => p.pricingType === billingCycle)
                    .map((plan) => (
                      <div key={plan.id} className="space-y-8">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-foreground tracking-tighter">
                              {plan.price === "0.00" || plan.price === "0"
                                ? "FREE"
                                : `$${plan.price}`}
                            </span>
                            {plan.pricingType !== "free" && plan.pricingType !== "lifetime" && (
                              <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
                                / {plan.pricingType === "monthly" ? "month" : "year"}
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-primary mt-4 uppercase tracking-widest">
                            {plan.name}
                          </p>
                        </div>

                        <ul className="space-y-4 mb-10">
                          <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
                            <CheckCircle className="text-primary" size={16} />
                            {plan.maxMessagesPerMonth === -1 ? "Unlimited" : plan.maxMessagesPerMonth} Messages/Mo
                          </li>
                          <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
                            <CheckCircle className="text-primary" size={16} />
                            {plan.maxIntegrations === -1 ? "Unlimited" : plan.maxIntegrations} Integrations
                          </li>
                          {plan.trialDays > 0 && (
                            <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
                              <CheckCircle className="text-primary" size={16} />
                              {plan.trialDays}-Day Free Trial
                            </li>
                          )}
                        </ul>

                        <Button
                          onClick={() => handleSubscribe(plan.id)}
                          disabled={isSubscribing}
                          className="w-full py-7 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                          {isSubscribing ? "Processing..." : `Subscribe to ${agent.name}`}
                        </Button>
                      </div>
                    ))}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">
                    Subscription Unavailable
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
