"use client";

import { getCookie } from "cookies-next";
import { AlertCircle, Check } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { NeonBlobCursor } from "@/shared/ui/neon-blob-cursor";
import { ScrollAnimationWrapper } from "@/shared/ui/scroll-animation-wrapper";
import { Skeleton } from "@/shared/ui/skeleton";
import { axios } from "@/utils/axios";

import { usePlans } from "../services/getPlans";

import type { AuthenticatedPlan } from "../../types";

const PlanCard = ({
  plan,
  index,
  isPopular,
}: {
  plan: AuthenticatedPlan;
  index: number;
  isPopular: boolean;
}) => {
  const price = plan.pricing ? parseFloat(plan.pricing.price) : 0;
  const ANIMATION_DELAY_BASE = 0.1;

  const handleSubscribe = async () => {
    // Skip subscription for free plans or enterprise plans
    if (plan.isFreeTrial || plan.code === "enterprise_plan") {
      return;
    }

    // Check if user is logged in by checking for token in cookies
    // This avoids triggering authentication redirects at component mount
    const token = getCookie("nextjs_access_token");
    if (!token) {
      toast.error("Please sign in to continue with subscription");
      // Redirect to login page with returnTo parameter
      const currentUrl = window.location.href;
      const loginUrl = new URL("/auth/login", window.location.origin);
      loginUrl.searchParams.append("returnTo", currentUrl);
      window.location.href = loginUrl.toString();
      return;
    }

    try {
      const response = await axios.post("/api/subscriptions/v1/create-checkout-session/", {
        plan_id: plan.id,
      });

      if (response.data.checkout_url && typeof response.data.checkout_url === "string") {
        window.location.href = response.data.checkout_url;
      } else {
        toast.error("Failed to get checkout URL");
      }
    } catch (error: any) {
      if (error.response) {
        const errorMessage =
          (error.response.data as { message?: string }).message || error.response.statusText;
        // Special handling for the "already has active subscription" error
        if (errorMessage.includes("active subscription")) {
          toast.error(
            "You already have an active subscription. Please check your account or contact support for assistance."
          );
        } else if (
          errorMessage.includes("authentication") ||
          errorMessage.includes("unauthorized")
        ) {
          // Handle authentication errors by redirecting to login
          toast.error("Please sign in to continue with subscription");
          const currentUrl = window.location.href;
          const loginUrl = new URL("/auth/login", window.location.origin);
          loginUrl.searchParams.append("returnTo", currentUrl);
          window.location.href = loginUrl.toString();
        } else {
          toast.error(`Subscription failed: ${errorMessage}`);
        }
      } else {
        toast.error("Failed to initiate subscription. Please check your connection and try again.");
      }
    }
  };

  return (
    <ScrollAnimationWrapper animation="fade-up" delay={ANIMATION_DELAY_BASE * (index + 1)}>
      <div className="relative pt-6" />
      {isPopular && (
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20">
          <Badge className="gold-gradient text-black border-0 px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow-lg">
            Most Popular
          </Badge>
        </div>
      )}
      {plan.isCurrentPlan && (
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20">
          <Badge className="bg-primary text-black border-0 px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow-lg">
            Current Plan
          </Badge>
        </div>
      )}
      <NeonBlobCursor blobColor="#60a5fa" blobSize={200} intensity={0.3}>
        <div
          className={`p-8 transition-all duration-500 overflow-hidden flex flex-col relative border ${isPopular
            ? "rounded-2xl border-2 border-primary/20 hover:border-primary/40"
            : "rounded-2xl border-2 border-gray-300 dark:border-white/10 hover:border-primary/40"
            } bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm`}
        >
          <div className="relative flex flex-col z-10 w-full">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h2>

            <div className="mt-6 flex items-baseline gap-1">
              {price === 0 ? (
                <span className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Free</span>
              ) : (
                <>
                  <span className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                    ${plan.pricing?.price}
                  </span>
                  {plan.pricing?.planCycle && (
                    <span className="text-base text-gray-500 dark:text-slate-400 font-medium">
                      /{plan.pricing.planCycle?.name?.toLowerCase()}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* <p className="mt-4 text-base text-slate-400 font-light">{plan.description}</p> */}

            <div className="space-y-4 mt-8">
              {plan.planPoints
                .sort((a, b) => a.order - b.order)
                .map((point) => (
                  <div key={point.id} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">{point.title}</span>
                  </div>
                ))}
            </div>

            <Button
              variant={isPopular ? "default" : "outline"}
              className={`w-full mt-8 mb-2 rounded-xl font-semibold transition-all ${isPopular
                ? "gold-gradient text-black font-bold shadow-lg hover:brightness-110"
                : "border-gray-300 dark:border-white/20 text-gray-900 dark:text-white bg-transparent hover:bg-gray-200 dark:hover:bg-white/10 hover:text-primary hover:border-primary/30"
                }`}
              onClick={handleSubscribe}
              disabled={plan.isCurrentPlan}
            >
              {plan.isFreeTrial
                ? "Start Free"
                : plan.code === "enterprise_plan"
                  ? "Contact Sales"
                  : plan.isCurrentPlan
                    ? "Current Plan"
                    : "Get Started"}
            </Button>

            {/* Hover Glow */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-500 hover:opacity-100 pointer-events-none" />
          </div>
        </div>
      </NeonBlobCursor>
    </ScrollAnimationWrapper>
  );
};

export const PricingPlans = () => {
  const { data: plans, isLoading, isError } = usePlans();

  // Sort plans by ID to maintain consistent ordering
  // Sort plans so the free plan is in the middle
  const sortedPlans = plans ? [...plans].sort((a, b) => a.id - b.id) : [];
  if (sortedPlans.length === 3) {
    const freeIndex = sortedPlans.findIndex(p => p.code === "free_plan");
    if (freeIndex !== -1 && freeIndex !== 1) {
      const freePlan = sortedPlans.splice(freeIndex, 1)[0];
      sortedPlans.splice(1, 0, freePlan);
    }
  }

  const popularPlan = sortedPlans?.find((p) => p.isPopular);
  const hasPopular = Boolean(popularPlan);

  if (isLoading) {
    return (
      <section className="relative w-full  px-4 sm:px-6 lg:px-8 pb-24 pt-8 overflow-visible">
        {/* Animated Orbs */}
        <div
          className="absolute top-1/3 left-10 w-64 h-64 bg-primary/30 rounded-full blur-[120px] animate-float opacity-30"
          style={{ animationDelay: "1s", animationDuration: "7s" }}
        />
        <div
          className="absolute bottom-1/4 right-10 w-56 h-56 bg-primary/20 rounded-full blur-[100px] animate-float opacity-25"
          style={{ animationDelay: "3s", animationDuration: "9s" }}
        />

        <div className="lg:flex lg:justify-center">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm"
              >
                <div className="flex flex-col">
                  <Skeleton className="h-6 w-3/4 mb-6" />
                  <Skeleton className="h-10 w-1/2 mb-6" />
                  <div className="space-y-4 mb-8">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="flex items-start gap-3">
                        <Skeleton className="w-5 h-5 rounded-full mt-0.5" />
                        <Skeleton className="h-4 w-5/6" />
                      </div>
                    ))}
                  </div>
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || (plans && plans.length === 0)) {
    return (
      <section className="relative w-full px-4 sm:px-6 lg:px-8 pb-24 pt-8 overflow-visible">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No response from server
          </h3>
          <p className="text-gray-500 dark:text-slate-400 max-w-xs mx-auto">
            We are having trouble connecting to our servers or no plans are available. Please try
            again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full  px-4 sm:px-6 lg:px-8 pb-8 pt-8 overflow-visible">
      <div
        className={`relative z-10 ${sortedPlans && sortedPlans.length <= 3 ? "lg:flex lg:justify-center" : ""
          }`}
      >
        <div
          className={`grid grid-cols-1 gap-8 ${sortedPlans && sortedPlans.length <= 3
            ? "md:grid-cols-2 lg:grid-cols-3"
            : "md:grid-cols-2 lg:grid-cols-3"
            }`}
        >
          {sortedPlans?.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              index={index}
              isPopular={hasPopular ? plan.id === popularPlan?.id : false}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
