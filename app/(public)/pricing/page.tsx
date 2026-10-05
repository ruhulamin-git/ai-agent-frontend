"use client";

import dynamic from "next/dynamic";

import { CircularLoader } from "@/shared/components";

const PricingPage = dynamic(
  () => import("@/modules/pricing/pricing-plans/PricingPage").then((mod) => mod.PricingPage),
  { loading: () => <CircularLoader /> }
);

const PublicPricingPage = () => {
  return <PricingPage />;
};

export default PublicPricingPage;
