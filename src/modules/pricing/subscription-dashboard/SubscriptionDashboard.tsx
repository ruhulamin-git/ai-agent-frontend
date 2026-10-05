"use client";

import { format } from "date-fns";
import { AlertCircle, Clock, Crown, Settings } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";

import { useCurrentSubscription } from "./service";

export const SubscriptionDashboard = () => {
  const { data: subscription, isLoading } = useCurrentSubscription();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Safely parse the plan name to avoid any potential type errors
  const planName =
    typeof subscription?.plan?.name === "string" ? subscription.plan.name.toLowerCase() : "";
  const isFreePlan =
    !subscription ||
    subscription.plan?.code === "free_plan" ||
    planName === "free" ||
    planName === "basic";

  // Safely parse the status as the exact API return type can vary
  let status = "inactive";
  if (subscription) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subAny = subscription as any;
    if (typeof subAny.status === "string") {
      status = subAny.status.toLowerCase();
    } else if (
      subAny.status &&
      typeof subAny.status === "object" &&
      typeof subAny.status.name === "string"
    ) {
      status = subAny.status.name.toLowerCase();
    } else if (subAny.status === true || subAny.isActive === true) {
      status = "active";
    } else if (typeof subAny.status === "number") {
      status = subAny.status === 1 ? "active" : "inactive";
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Subscription Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your platform subscription plan and billing history.
        </p>
      </div>

      {/* Current Plan Card */}
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Plan</p>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    {subscription?.plan?.name || "Free"}
                  </h2>
                  <Badge
                    variant={
                      status === "active"
                        ? "default"
                        : status === "canceled"
                        ? "destructive"
                        : "secondary"
                    }
                    className={
                      status === "active"
                        ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                        : ""
                    }
                  >
                    {status}
                  </Badge>
                </div>
              </div>
            </div>

            {!isFreePlan && subscription?.endDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-xl">
                <Clock className="w-4 h-4" />
                <span>
                  {status === "canceled" ? "Access ends on " : "Renews on "}
                  <strong className="text-foreground">
                    {format(new Date(subscription.endDate), "MMMM d, yyyy")}
                  </strong>
                </span>
              </div>
            )}

            {status === "canceled" && (
              <div className="flex items-start gap-2 text-sm text-orange-600 bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Your subscription will be canceled at the end of the billing period.</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 min-w-50">
            {isFreePlan || status === "canceled" ? (
              <Button asChild className="w-full rounded-xl">
                <Link href="/dashboard/pricing">Upgrade Plan</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full rounded-xl">
                  <Link href="/dashboard/pricing">Change Plan</Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl"
                >
                  Cancel Subscription
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 gap-4">
        {/* Billing History */}
        <Link href="/dashboard/subscription/history" className="block group">
          <div className="h-full bg-card border border-border rounded-2xl p-6 hover:border-primary/40 transition-all shadow-sm group-hover:shadow-md">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              Billing History
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              View past invoices, charges, and download receipts.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};
