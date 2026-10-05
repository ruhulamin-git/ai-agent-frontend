"use client";

import { ScrollAnimationWrapper } from "@/shared/ui/scroll-animation-wrapper";

import { FAQSection } from "./components/FAQSection";
import { PricingHero } from "./components/PricingHero";
import { PricingPlans } from "./components/PricingPlans";

export const PricingPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Secondary Orb - Bottom Right */}
      <div
        className="absolute bottom-20 right-20 w-80 h-80 bg-primary/30 rounded-full blur-[140px] animate-float opacity-30"
        style={{ animationDelay: "4s", animationDuration: "10s" }}
      />

      <main className="relative z-10 flex flex-col items-center">
        <PricingHero />
        <PricingPlans />

        <ScrollAnimationWrapper animation="fade-up" className="w-full">
          <FAQSection />
        </ScrollAnimationWrapper>
      </main>
    </div>
  );
};
