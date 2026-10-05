"use client";

import { Check } from "lucide-react";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { NeonBlobCursor } from "@/shared/ui/neon-blob-cursor";
import { ScrollAnimationWrapper } from "@/shared/ui/scroll-animation-wrapper";

import { usePublicPlans } from "../services/getPublicPlans";

import type { PublicPlan } from "../../types";

const PlanCard = ({
  plan,
  index,
  isPopular,
}: {
  plan: PublicPlan;
  index: number;
  isPopular: boolean;
}) => {
  const price = parseFloat(plan.pricing?.price || "0");
  const ANIMATION_DELAY_BASE = 0.1;

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
      <NeonBlobCursor blobColor="#60a5fa" blobSize={200} intensity={0.3}>
        <div
          className={`p-8 transition-all duration-500 overflow-hidden flex flex-col relative border ${isPopular
              ? "rounded-2xl border-2 border-primary/20 hover:border-primary/40"
              : "rounded-2xl border-2 border-white/10 hover:border-primary/40"
            } bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm`}
        >
          <div className="relative flex flex-col z-10 w-full">
            <h2 className="text-xl font-bold text-white">{plan.name}</h2>

            <div className="mt-6 flex items-baseline gap-1">
              {price === 0 ? (
                <span className="text-4xl font-bold text-white tracking-tight">Free</span>
              ) : (
                <>
                  <span className="text-4xl font-bold text-white tracking-tight">
                    ${plan.pricing?.price}
                  </span>
                  <span className="text-base text-slate-400 font-medium">
                    /{plan.pricing?.planCycle?.name?.toLowerCase()}
                  </span>
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
                    <span className="text-sm text-slate-300 leading-relaxed">{point.title}</span>
                  </div>
                ))}
            </div>

            <Button
              variant={isPopular ? "default" : "outline"}
              className={`w-full mt-8 mb-2 rounded-xl font-semibold transition-all ${isPopular
                  ? "gold-gradient text-black font-bold shadow-lg hover:brightness-110"
                  : "border-white/20 text-white hover:bg-white/5 hover:text-primary hover:border-primary/30"
                }`}
            >
              {plan.isFreeTrial
                ? "Start Free"
                : plan.code === "enterprise_plan"
                  ? "Contact Sales"
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
  const { data: plans } = usePublicPlans();

  const popularPlan = plans?.find((p) => p.isPopular);
  const hasPopular = Boolean(popularPlan);

  return (
    <section className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-24 pt-8 overflow-visible">
      {/* Animated Orbs */}
      <div
        className="absolute top-1/3 left-10 w-64 h-64 bg-primary/30 rounded-full blur-[120px] animate-float opacity-30"
        style={{ animationDelay: "1s", animationDuration: "7s" }}
      />
      <div
        className="absolute bottom-1/4 right-10 w-56 h-56 bg-primary/20 rounded-full blur-[100px] animate-float opacity-25"
        style={{ animationDelay: "3s", animationDuration: "9s" }}
      />

      <div
        className={`relative z-10 ${plans && plans.length <= 3 ? "lg:flex lg:justify-center" : ""}`}
      >
        <div
          className={`grid grid-cols-1 gap-8 ${plans && plans.length <= 3
              ? "md:grid-cols-2 lg:grid-cols-2"
              : "md:grid-cols-2 lg:grid-cols-3"
            }`}
        >
          {plans?.map((plan, index) => (
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
