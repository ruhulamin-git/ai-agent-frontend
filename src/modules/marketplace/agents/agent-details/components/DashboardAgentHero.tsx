import {
  Brain,
  CheckCircle,
  DollarSign,
  ShoppingCart,
  Star,
  Terminal,
  TrendingUp,
  User,
  Users,
  Verified,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useAgentPricingPlans } from "../../community-agents/services/getAgentPricingPlans";
import { useSubscribeToAgent } from "../../community-agents/services/subscribeToAgent";
import { AgentAvatar } from "../../shared/components/AgentAvatar";

import type { Agent } from "../../shared/types";

interface DashboardAgentHeroProps {
  agent: Agent;
}

const CreatorProfile = () => (
  <div className="w-full max-w-md bg-card rounded-2xl p-4 border border-border mb-6">
    <div className="flex items-center gap-3">
      <div className="size-12 rounded-xl border border-border p-1 bg-muted">
        <div className="w-full h-full rounded-lg bg-gradient-to-br from-primary to-primary flex items-center justify-center">
          <span className="text-lg font-black text-primary-foreground">RK</span>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1 mb-1">
          <p className="text-foreground font-bold text-sm">Rahat Khan</p>
          <Verified className="text-primary fill-current" size={16} />
        </div>
        <p className="text-muted-foreground text-xs font-medium">
          Elite Architect • 128 Deployments
        </p>
      </div>
      <button className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-sm hover:scale-105 transition-all">
        <Users size={16} />
      </button>
    </div>

    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
      <div className="text-center">
        <p className="text-foreground font-bold text-lg tracking-tight">2.5M+</p>
        <p className="text-muted-foreground text-[9px] uppercase font-bold tracking-wider">
          Installs
        </p>
      </div>
      <div className="text-center">
        <p className="text-foreground font-bold text-lg tracking-tight">5.2k</p>
        <p className="text-muted-foreground text-[9px] uppercase font-bold tracking-wider">
          Followers
        </p>
      </div>
      <div className="text-center">
        <p className="text-foreground font-bold text-lg tracking-tight">4.9</p>
        <p className="text-muted-foreground text-[9px] uppercase font-bold tracking-wider">
          Rating
        </p>
      </div>
    </div>
  </div>
);

const AgentCapabilities = () => (
  <section className="space-y-8">
    <div className="flex items-end justify-between">
      <div>
        <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-2">
          Agent Features
        </h3>
        <h4 className="text-3xl font-bold text-foreground tracking-tight">AgentKit Capabilities</h4>
      </div>
    </div>

    <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-lg">
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-gradient-to-br from-primary to-primary flex items-center justify-center shadow-lg">
              <Brain className="text-primary-foreground" size={24} />
            </div>
            <div>
              <h5 className="text-foreground font-bold text-lg">AI Agent Intelligence</h5>
              <p className="text-muted-foreground text-xs font-medium">
                Advanced Reasoning & Decision Making
              </p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider">
            Active & Learning
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/30 rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 text-sm">🧠</span>
                </div>
                <span className="font-semibold text-sm text-foreground">Natural Language</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Understands complex instructions and context
              </p>
            </div>

            <div className="bg-muted/30 rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 text-sm">⚡</span>
                </div>
                <span className="font-semibold text-sm text-foreground">Task Automation</span>
              </div>
              <p className="text-xs text-muted-foreground">Executes workflows autonomously</p>
            </div>

            <div className="bg-muted/30 rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-sm">🔗</span>
                </div>
                <span className="font-semibold text-sm text-foreground">API Integration</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Connects with external services seamlessly
              </p>
            </div>
          </div>

          <AgentMetrics />

          <p className="text-muted-foreground text-sm leading-relaxed">
            This AI agent is built on AgentKit&apos;s advanced framework, featuring multi-modal
            capabilities, intelligent decision-making, and seamless integration with your existing
            workflows. Designed for enterprise-grade reliability and performance.
          </p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="bg-card p-6 rounded-3xl group hover:border-primary/50 transition-all border border-border">
        <div className="size-12 rounded-2xl bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <TrendingUp className="text-primary" size={24} />
        </div>
        <h5 className="text-foreground font-bold mb-2">Predictive Analytics</h5>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Real-time forecasting with high-dimensional data processing and automated reporting.
        </p>
      </div>
      <div className="bg-card p-6 rounded-3xl group hover:border-primary/50 transition-all border border-border">
        <div className="size-12 rounded-2xl bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <Terminal className="text-primary" size={24} />
        </div>
        <h5 className="text-foreground font-bold mb-2">Auto-Code Synthesis</h5>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Dynamic script generation and security auditing across 40+ programming languages.
        </p>
      </div>
    </div>
  </section>
);

const AgentMetrics = () => (
  <div className="bg-muted/20 rounded-xl p-6 border border-border">
    <h6 className="font-bold text-foreground mb-4 flex items-center gap-2">
      <div className="size-5 rounded bg-primary/20 flex items-center justify-center">
        <span className="text-primary text-xs">📊</span>
      </div>
      Performance Metrics
    </h6>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center">
        <div className="text-2xl font-black text-primary">99.9%</div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider">Uptime</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-black text-primary">&lt;200ms</div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider">Response</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-black text-primary">24/7</div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider">Available</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-black text-primary">∞</div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider">Scalable</div>
      </div>
    </div>
  </div>
);

const RealTimeVitals = () => (
  <div className="bg-card rounded-[2.5rem] border border-border p-8">
    <h4 className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
      Real-Time Vitals
    </h4>

    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-muted-foreground text-[9px] uppercase font-bold tracking-widest">
              Network Uptime
            </p>
            <p className="text-xl font-bold text-foreground">99.98%</p>
          </div>
          <div className="flex items-end gap-1 h-8">
            <div className="w-1 bg-primary/20 h-3 rounded-full" />
            <div className="w-1 bg-primary/40 h-5 rounded-full" />
            <div className="w-1 bg-primary/60 h-4 rounded-full" />
            <div className="w-1 bg-primary/80 h-7 rounded-full" />
            <div className="w-1 bg-primary h-6 rounded-full shadow-[0_0_8px_rgba(40,172,144,0.5)]" />
          </div>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary w-[99.9%]" />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-muted-foreground text-[9px] uppercase font-bold tracking-widest">
              Global Latency
            </p>
            <p className="text-xl font-bold text-foreground">
              184<span className="text-xs text-muted-foreground ml-1">ms</span>
            </p>
          </div>
          <div className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 text-[9px] font-bold uppercase">
            Optimal
          </div>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-green-500 w-[92%]" />
        </div>
      </div>
    </div>
  </div>
);

export const DashboardAgentHero = ({ agent }: DashboardAgentHeroProps) => {
  const isCommunity = agent.sourceType === "user_created";
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

  if (isCommunity) {
    return (
      <div className="relative w-full bg-background text-foreground">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

        {/* Hero Section */}
        <section className="relative px-6 pt-8 pb-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 blur-[80px] -z-10" />

          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-full h-full rounded-xl bg-center bg-cover overflow-hidden">
                <AgentAvatar
                  agent={{
                    icon: agent.icon,
                    color: agent.color,
                    imageUrl: (agent as { imageUrl?: string }).imageUrl,
                    name: agent.name,
                  }}
                  size="lg"
                  className="w-full h-full rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <h2 className="text-3xl font-black text-foreground tracking-tight">{agent.name}</h2>
              <p className="text-base text-muted-foreground font-medium">{agent.role}</p>

              {/* Clean Status Badges */}
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
                    Online
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full">
                  <Star className="text-yellow-500 fill-current" size={12} />
                  <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">
                    Top Rated
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <span className="px-2 py-1 rounded-full bg-muted border border-border text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
                  v4.2 Stable
                </span>
                <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                <span className="px-2 py-1 rounded-full bg-muted border border-border text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
                  Multi-Modal
                </span>
              </div>
            </div>

            <CreatorProfile />
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          <main className="space-y-12">
            <AgentCapabilities />
          </main>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-20 space-y-8">
              {/* Pricing Card */}
              <div className="bg-card rounded-[2.5rem] border border-border p-8 shadow-2xl overflow-hidden relative">
                <div className="absolute -top-12 -right-12 size-32 bg-primary/10 blur-3xl" />

                {isLoadingPlans ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground text-sm">Loading pricing plans...</p>
                  </div>
                ) : pricingPlans && pricingPlans.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between mb-8">
                      <h4 className="text-foreground text-xs font-black uppercase tracking-[0.2em]">
                        License
                      </h4>
                      <div className="flex bg-muted p-1.5 rounded-full border border-border">
                        {pricingPlans?.some((p) => p.pricingType === "monthly") && (
                          <button
                            onClick={() => setBillingCycle("monthly")}
                            className={`px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight transition-all ${
                              billingCycle === "monthly"
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Monthly
                          </button>
                        )}
                        {pricingPlans?.some((p) => p.pricingType === "yearly") && (
                          <button
                            onClick={() => setBillingCycle("yearly")}
                            className={`px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight transition-all ${
                              billingCycle === "yearly"
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Yearly
                          </button>
                        )}
                        {pricingPlans?.some((p) => p.pricingType === "free") && (
                          <button
                            onClick={() => setBillingCycle("free")}
                            className={`px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight transition-all ${
                              billingCycle === "free"
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Free
                          </button>
                        )}
                      </div>
                    </div>

                    {pricingPlans
                      ?.filter((p) => p.pricingType === billingCycle)
                      .map((plan) => (
                        <div key={plan.id}>
                          <div className="mb-8">
                            <div className="flex items-baseline gap-2">
                              <span className="text-6xl font-black text-foreground tracking-tighter">
                                {plan.price === "0.00" || plan.price === "0"
                                  ? "Free"
                                  : `$${plan.price}`}
                              </span>
                              {plan.pricingType !== "free" && plan.pricingType !== "lifetime" && (
                                <span className="text-muted-foreground text-sm font-semibold uppercase tracking-wider">
                                  / {plan.pricingType === "monthly" ? "mo" : "yr"}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-3 font-medium">
                              {plan.name} -{" "}
                              {plan.maxMessagesPerMonth === -1
                                ? "Unlimited"
                                : plan.maxMessagesPerMonth}{" "}
                              messages.
                            </p>
                          </div>

                          <div className="space-y-4 mb-10">
                            <div className="flex items-center gap-4 text-sm text-foreground font-medium">
                              <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center">
                                <CheckCircle className="text-primary" size={14} />
                              </div>
                              Commercial Rights Included
                            </div>
                            <div className="flex items-center gap-4 text-sm text-foreground font-medium">
                              <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center">
                                <CheckCircle className="text-primary" size={14} />
                              </div>
                              Priority 24/7 API Support
                            </div>
                            <div className="flex items-center gap-4 text-sm text-foreground font-medium">
                              <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center">
                                <CheckCircle className="text-primary" size={14} />
                              </div>
                              {plan.maxIntegrations === -1 ? "Unlimited" : plan.maxIntegrations}{" "}
                              Custom Integrations
                            </div>
                          </div>

                          <button
                            onClick={() => handleSubscribe(plan.id)}
                            disabled={isSubscribing}
                            className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-primary text-primary-foreground font-extrabold text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
                          >
                            {isSubscribing ? "Initializing..." : `Initialize ${agent.name}`}
                          </button>
                        </div>
                      ))}
                  </>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground text-sm">
                      No pricing plans available for this agent.
                    </p>
                  </div>
                )}
              </div>

              <RealTimeVitals />
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // Original design for non-community agents
  return (
    <div className="relative overflow-hidden bg-white dark:bg-primary/5 pt-10 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6">
            <AgentAvatar
              agent={{
                icon: agent.icon,
                color: agent.color,
                imageUrl: (agent as { imageUrl?: string }).imageUrl,
                name: agent.name,
              }}
              size="lg"
              className="animate-fade-in-up"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            {agent.category} • {t("pages.agents.ready_to_deploy")}
          </div>

          <h1 className="mb-3 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl animate-fade-in-up [animation-delay:100ms]">
            {agent.name}
          </h1>

          <p className="mb-4 text-xl font-medium text-primary animate-fade-in-up [animation-delay:200ms]">
            {agent.role}
          </p>

          <div className="flex flex-col sm:flex-row md:gap-4 lg:gap-6 justify-around">
            <p className="lg:mb-2 max-w-3xl text-md font-semibold leading-relaxed flex items-center gap-1">
              <User className="w-4 h-4 text-primary" />
              Platform
            </p>
            <p className="lg:mb-2 max-w-3xl text-md font-semibold leading-relaxed flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-primary" />
              {agent.price}
            </p>
            <p className="mb-2 max-w-3xl text-md font-semibold leading-relaxed flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-primary" />
              Total Sales: 56
            </p>
          </div>

          <p className="mb-8 max-w-2xl text-lg text-slate-600 dark:text-slate-400 leading-relaxed animate-fade-in-up [animation-delay:300ms]">
            {agent.longDescription}
          </p>
        </div>
      </div>

      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-linear-to-b ${agent.bgColor} to-transparent opacity-30 dark:opacity-10 blur-3xl pointer-events-none -z-10`}
      />
    </div>
  );
};
