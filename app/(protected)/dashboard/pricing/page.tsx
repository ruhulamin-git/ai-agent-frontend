"use client";

import dynamic from "next/dynamic";

import { CircularLoader } from "@/shared/components";

const ProtectedPricingPage = dynamic(
  () =>
    import("@/modules/pricing/pricing-plans/ProtectedPricingPage").then(
      (mod) => mod.ProtectedPricingPage
    ),
  { loading: () => <CircularLoader /> }
);

const PricingPage = () => {
  return <ProtectedPricingPage />;
};

export default PricingPage;
