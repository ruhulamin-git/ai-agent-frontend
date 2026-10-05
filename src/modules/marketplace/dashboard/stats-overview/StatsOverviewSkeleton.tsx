"use client";

import { Skeleton } from "@/shared/ui/skeleton";

export const StatCardSkeleton = () => {
  return (
    <div className="rounded-3xl bg-white dark:bg-primary/5 border border-slate-200/60 dark:border-slate-800/60 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="h-5 w-16 rounded-md" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
};

export const StatsOverviewSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {["stat-1", "stat-2", "stat-3", "stat-4"].map((id) => (
        <StatCardSkeleton key={id} />
      ))}
    </div>
  );
};
