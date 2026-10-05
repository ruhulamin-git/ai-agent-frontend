"use client";

import { Clock } from "lucide-react";
import { useMemo } from "react";

import { DataTable } from "@/shared/components";
import { Badge } from "@/shared/ui/badge";
import { Breadcrumb } from "@/shared/ui/breadcrumb";

import { PricingPlans } from "../new-pricing-plans/components/NewPricingPlans";

import { useSubscriptionHistories } from "./service";

import type { SubscriptionHistory } from "./service";
import type { ColumnDef } from "@tanstack/react-table";

export const SubscriptionDashboard = () => {
  const { data: subscriptionHistories = [], isLoading, isError } = useSubscriptionHistories();

  // Use fetched data for the table
  const data = subscriptionHistories;

  const columns = useMemo<Array<ColumnDef<SubscriptionHistory>>>(
    () => [
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
          const date = row.original.createdAt
            ? new Date(row.original.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "-";
          return date;
        },
      },
      {
        accessorKey: "plan",
        header: "Plan",
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => <span className="font-semibold text-gray-900 dark:text-white">{row.original.amount}</span>,
      },
      {
        accessorKey: "invoice",
        header: "Invoice",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = (row.original.status ?? "").toLowerCase();
          return (
            <Badge
              variant={status === "paid" || status === "active" ? "default" : "secondary"}
              className={
                status === "paid" || status === "active"
                  ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
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

  const breadcrumbItems = [{ label: "Billing Management", isActive: true }];

  return (
    <div className="space-y-4">
      <div>
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Manage your platform subscription plan and billing history.</p>
      </div>

      {/* Current Plan Card */}
      <div className="text-left">
        <PricingPlans />
      </div>

      {/* Billing History Section */}
      <div className="space-y-6 pt-0">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Billing History</h2>
        </div>

        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          pageCount={1}
          pagination={{ pageIndex: 0, pageSize: 10 }}
          totalCount={data.length}
          emptyMessage={isError ? "Failed to load billing history." : "No billing history found."}
        />
      </div>
    </div>
  );
};
