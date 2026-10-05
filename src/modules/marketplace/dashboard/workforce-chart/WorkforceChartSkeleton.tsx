"use client";

import { Skeleton } from "@/shared/ui/skeleton";

const CHART_BAR_HEIGHTS = ["h-32", "h-40", "h-28", "h-48", "h-36", "h-44", "h-24"];
const CHART_DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export const WorkforceChartSkeleton = () => {
  return (
    <div className="w-full bg-white dark:bg-primary/5 rounded-4xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>

      {/* Chart area */}
      <div className="h-64 flex items-end gap-2">
        {CHART_DAYS.map((day, index) => (
          <div key={day} className="flex-1 flex flex-col items-center gap-2">
            <Skeleton className={`w-full rounded-t-lg ${CHART_BAR_HEIGHTS[index]}`} />
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
};
