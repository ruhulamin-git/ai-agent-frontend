"use client";

import { useMemo, useState } from "react";

import { DataTable } from "@/shared/components";
import { Badge } from "@/shared/ui/badge";
import { Breadcrumb } from "@/shared/ui/breadcrumb";

import { usePaymentHistoryList } from "./service";

import type { PaymentHistory } from "./types";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";

export const PaymentHistoryTable = () => {
  const breadcrumbItems = [{ label: "Payment History", isActive: true }];
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
          <div className="font-semibold text-gray-900 dark:text-white">
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

  if (isLoading) {
    return (
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-900 dark:text-white">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-6 overflow-y-auto scrollbar-thin">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        <p className="text-gray-600 dark:text-gray-400">View your purchased agents, plans, and invoice references.</p>
      </div>

      {/* Data Table */}
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
