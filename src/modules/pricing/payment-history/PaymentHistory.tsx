"use client";

import { Settings } from "lucide-react";
import { useMemo, useState } from "react";

import { DataTable } from "@/shared/components";
import { Badge } from "@/shared/ui/badge";

import { usePaymentHistoryList } from "./service";

import type { PaymentHistory } from "./types";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";

export const PaymentHistoryTable = () => {
  const PAGE_SIZE_OPTIONS = ["10", "20", "50", "100"].map((value) => Number(value));

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = usePaymentHistoryList({ pagination });

  const columns = useMemo<Array<ColumnDef<PaymentHistory>>>(
    () => [
      {
        accessorKey: "createdAt",
        header: "Purchased On",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
      },
      {
        id: "agent",
        header: "Agent",
        cell: ({ row }) => <div className="font-medium">{row.original.agent.displayTitle}</div>,
      },
      {
        id: "plan",
        header: "Plan",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.pricingPlan.name}</div>
            <div className="text-xs text-muted-foreground capitalize">
              {row.original.pricingPlan.pricingType}
            </div>
          </div>
        ),
      },
      {
        id: "amount",
        header: "Amount",
        cell: ({ row }) => (
          <div className="font-semibold text-white">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: row.original.pricingPlan.currency.toUpperCase() || "USD",
            }).format(Number(row.original.pricingPlan.price || 0))}
          </div>
        ),
      },
      {
        id: "invoice",
        header: "Invoice",
        cell: ({ row }) =>
          row.original.invoices?.[0]?.invoiceNumber ? (
            <span className="text-sm">{row.original.invoices[0].invoiceNumber}</span>
          ) : (
            <span className="text-sm text-muted-foreground">N/A</span>
          ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status.toLowerCase();
          return (
            <Badge
              variant={status === "active" || status === "paid" ? "default" : "secondary"}
              className={
                status === "active" || status === "paid"
                  ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                  : status === "failed" || status === "cancelled"
                  ? "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                  : "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20"
              }
            >
              <span className="capitalize">{status}</span>
            </Badge>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Purchase History
        </h1>
        <p className="text-muted-foreground mt-1">
          View your purchased agents, plans, and invoice references.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        pageCount={data?.pagination?.numPages || 1}
        pagination={pagination}
        totalCount={data?.pagination?.totalCount || 0}
        onPaginationChange={(newPagination) => setPagination(newPagination)}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        emptyMessage="No purchase history found."
      />
    </div>
  );
};
