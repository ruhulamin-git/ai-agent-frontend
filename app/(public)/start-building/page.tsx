"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { PricingPlans } from "@/modules/pricing/new-pricing-plans/components/NewPricingPlans";
import { SectionContainer } from "@/shared/components";

const StartBuildingPage = () => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (

    <SectionContainer className="py-12">
      <div className="text-center mb-12">
        <h1 className="section-title mb-4">Start Building Your AI Agents</h1>
        <p className="section-subtitle max-w-3xl mx-auto">Get started with our platform and create powerful AI agents to automate your business processes.</p>
      </div>
      <PricingPlans />
    </SectionContainer>
  );
};

export default StartBuildingPage;
