"use client";

import { NewDashboard } from "@/modules/newdashboard/NewDashboard";
import { PaymentHistoryTable } from "@/modules/newdashboard/user-dashboard/payment-history/PaymentHistory";

const PaymentHistoryPage = () => {
  return (
    <NewDashboard>
      <PaymentHistoryTable />
    </NewDashboard>
  );
};
export default PaymentHistoryPage;
