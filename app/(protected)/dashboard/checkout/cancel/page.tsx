"use client";

import dynamic from "next/dynamic";

import { CircularLoader } from "@/shared/components";

const CheckoutCancel = dynamic(
  () =>
    import("@/modules/pricing/checkout-cancel/CheckoutCancelPage").then(
      (mod) => mod.CheckoutCancelPage
    ),
  { loading: () => <CircularLoader /> }
);

const CheckoutCancelRoute = () => {
  return <CheckoutCancel />;
};

export default CheckoutCancelRoute;
