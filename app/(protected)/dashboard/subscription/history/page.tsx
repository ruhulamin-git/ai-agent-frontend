"use client";

import dynamic from "next/dynamic";

import { CircularLoader, PageContainer } from "@/shared/components";

const PaymentHistory = dynamic(
  () =>
    import("@/modules/pricing/payment-history/PaymentHistory").then(
      (mod) => mod.PaymentHistoryTable
    ),
  { loading: () => <CircularLoader /> }
);

const PaymentHistoryPage = () => {
  return (
    <PageContainer
      title="Purchase History"
      description="View your purchased agents, plans, and invoice references"
    >
      <PaymentHistory />
    </PageContainer>
  );
};

export default PaymentHistoryPage;
