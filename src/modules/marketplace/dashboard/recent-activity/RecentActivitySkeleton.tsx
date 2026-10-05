"use client";

import { Skeleton } from "@/shared/ui/skeleton";

const SKELETON_ITEMS = ["activity-1", "activity-2", "activity-3", "activity-4", "activity-5"];

export const RecentActivitySkeleton = () => {
  return (
    <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
      {SKELETON_ITEMS.map((id) => (
        <div key={id} className="p-3 flex items-center gap-4">
          {/* Icon skeleton */}
          <Skeleton className="w-9 h-9 rounded-lg shrink-0" />

          {/* Content skeleton */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <Skeleton className="h-4 w-48 max-w-full" />
            <Skeleton className="h-3 w-32" />
          </div>

          {/* Button skeleton */}
          <Skeleton className="h-7 w-16 rounded-lg shrink-0" />
        </div>
      ))}
    </div>
  );
};
