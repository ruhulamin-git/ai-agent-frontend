"use client";

import { Skeleton } from "@/shared/ui/skeleton";

export const WelcomeCardSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-4xl bg-white dark:bg-primary/5 border border-slate-200/60 dark:border-slate-800/60 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4 flex-1">
          {/* Plan badge skeleton */}
          <Skeleton className="h-6 w-24 rounded-full" />

          {/* Title skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-80 max-w-full" />
            <Skeleton className="h-5 w-64 max-w-full" />
          </div>

          {/* Progress bar skeleton */}
          <div className="w-full max-w-70 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        </div>

        {/* Credits card skeleton */}
        <div className="flex items-center gap-5 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 self-start md:self-center shrink-0">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
};
