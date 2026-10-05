"use client";

import { IconCrown, IconRocket } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import { usePlans } from "@/modules/pricing/pricing-plans/services/getPlans";
import { useSidebar } from "@/shared/ui/sidebar";
import { Skeleton } from "@/shared/ui/skeleton";

export const SidebarPlanBadge = () => {
  const router = useRouter();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { data: plans, isLoading } = usePlans();
  const currentPlan = plans?.find((plan) => plan.isCurrentPlan);
  const planName = currentPlan?.name || "Free";
  const isFree = !currentPlan || planName === "Free";

  if (isLoading) {
    return (
      <div className="px-2 pb-2">
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    );
  }

  if (isCollapsed) {
    return (
      <div className="flex justify-center pb-2">
        <button
          onClick={() => router.push("/dashboard/pricing")}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
          title={`${planName} Plan — Upgrade`}
        >
          <IconCrown size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="px-2 pb-2">
      <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 px-3 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 ${
              isFree
                ? "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                : "bg-primary/15 text-primary"
            }`}
          >
            <IconCrown size={14} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
              Current Plan
            </p>
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight">
              {planName}
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push("/dashboard/pricing")}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider hover:bg-primary/20 transition-colors shrink-0 cursor-pointer"
        >
          <IconRocket size={12} />
          Upgrade
        </button>
      </div>
    </div>
  );
};
