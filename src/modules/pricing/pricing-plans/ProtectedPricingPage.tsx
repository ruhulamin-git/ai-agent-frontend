"use client";

import { Check, Crown, Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";

import { useCreateCheckoutSession } from "./services/createCheckoutSession";
import { usePlans } from "./services/getPlans";

import type { AuthenticatedPlan } from "../types";

const UNLIMITED_LIMIT = -1;

const formatLimit = (limit: number): string => {
  if (limit === UNLIMITED_LIMIT) return "Unlimited";
  return limit.toLocaleString();
};

const PlanCard = ({
  plan,
  isCurrentPlan,
  onUpgrade,
  isUpgrading,
}: {
  plan: AuthenticatedPlan;
  isCurrentPlan: boolean;
  onUpgrade: (planId: number) => void;
  isUpgrading: boolean;
}) => {
  const price = parseFloat(plan.pricing?.price || "0");

  return (
    <div
      className={`flex flex-col rounded-2xl p-6 transition-all duration-300 h-full relative ${isCurrentPlan
          ? "border-2 border-primary shadow-lg shadow-primary/10 bg-primary/5"
          : "border border-border hover:border-primary/30 bg-card"
        }`}
    >
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground border-0 px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-md">
            Current Plan
          </Badge>
        </div>
      )}

      <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>

      <div className="mt-4 flex items-baseline gap-1">
        {price === 0 ? (
          <span className="text-4xl font-black text-foreground tracking-tight">Free</span>
        ) : (
          <>
            <span className="text-4xl font-black text-foreground tracking-tight">
              ${plan.pricing?.price}
            </span>
            <span className="text-sm text-muted-foreground font-medium">
              /{plan.pricing?.planCycle?.name?.toLowerCase()}
            </span>
          </>
        )}
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>

      <Button
        variant={isCurrentPlan ? "outline" : "default"}
        disabled={isCurrentPlan || isUpgrading || price === 0}
        onClick={() => !isCurrentPlan && price > 0 && onUpgrade(plan.id)}
        className="w-full mt-6 mb-6 rounded-xl font-semibold"
      >
        {isUpgrading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : isCurrentPlan ? (
          "Current Plan"
        ) : price === 0 ? (
          "Free Plan"
        ) : (
          "Upgrade"
        )}
      </Button>

      {/* Plan Points */}
      <div className="space-y-3 mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          What&apos;s included
        </p>
        {plan.planPoints
          .sort((a, b) => a.order - b.order)
          .map((point) => (
            <div key={point.id} className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={2.5} />
              <span className="text-sm text-foreground/80">{point.title}</span>
            </div>
          ))}
      </div>

      {/* Feature Limits */}
      {plan.features && (
        <div className="space-y-3 pt-4 border-t border-border">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Limits & Features
          </p>
          {plan.features.featureLimit.map((feature) => (
            <div key={feature.id} className="flex items-center justify-between text-sm">
              <span className="text-foreground/70">{feature.title}</span>
              <span className="font-semibold text-foreground">{formatLimit(feature.limit)}</span>
            </div>
          ))}
          {plan.features.featureCheckbox.map((feature) => (
            <div key={feature.id} className="flex items-center justify-between text-sm">
              <span className="text-foreground/70">{feature.title}</span>
              {feature.value ? (
                <Check className="w-4 h-4 text-primary" strokeWidth={2.5} />
              ) : (
                <X className="w-4 h-4 text-muted-foreground/40" strokeWidth={2} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PlanCardSkeleton = () => (
  <div className="flex flex-col rounded-2xl p-6 border border-border bg-card h-full space-y-4">
    <Skeleton className="h-5 w-20" />
    <Skeleton className="h-10 w-28" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-10 w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  </div>
);

export const ProtectedPricingPage = () => {
  const { data: plans, isLoading: plansLoading } = usePlans();
  const { mutate: createCheckout, isPending } = useCreateCheckoutSession();
  const [upgradingPlanId, setUpgradingPlanId] = useState<number | null>(null);

  const isLoading = plansLoading;

  const handleUpgrade = (planId: number) => {
    setUpgradingPlanId(planId);
    createCheckout(
      { planId },
      {
        onSuccess: (data) => {
          if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
          }
        },
        onError: () => {
          toast.error("Failed to create checkout session. Please try again.");
          setUpgradingPlanId(null);
        },
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Crown className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Subscription Plans</h1>
        </div>
        <p className="text-muted-foreground">
          Choose the plan that best fits your needs. Upgrade or downgrade at any time.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PlanCardSkeleton />
          <PlanCardSkeleton />
          <PlanCardSkeleton />
          <PlanCardSkeleton />
        </div>
      ) : !plans || plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Plans Available</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            There are no subscription plans available at the moment. Please check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...(plans || [])]
            .sort((a, b) => {
              const priceA = parseFloat(a.pricing?.price || "0");
              const priceB = parseFloat(b.pricing?.price || "0");
              return priceA - priceB;
            })
            .map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={plan.isCurrentPlan}
                onUpgrade={handleUpgrade}
                isUpgrading={isPending && upgradingPlanId === plan.id}
              />
            ))}
        </div>
      )}
    </div>
  );
};
