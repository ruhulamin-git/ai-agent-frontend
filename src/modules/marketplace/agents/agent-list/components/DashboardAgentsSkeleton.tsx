import { Skeleton } from "@/shared/ui/skeleton";

export const DashboardAgentsSkeleton = () => {
  return (
    <div className="space-y-8 max-w-[1600px] mx-auto py-8 px-4 sm:px-6">
      {/* Header & Search Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-primary/5 pb-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>

        <Skeleton className="h-10 w-full sm:w-64 rounded-lg" />
      </div>

      {/* Tabs Skeleton */}
      <div>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {Array.from({ length: 6 }, (_, i) => `tab-skeleton-${i}`).map((id) => (
            <Skeleton key={id} className="h-9 w-24 rounded-md shrink-0" />
          ))}
        </div>

        {/* Grid Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {Array.from({ length: 10 }, (_, i) => `agent-card-skeleton-${i}`).map((id) => (
            <AgentCardSkeleton key={id} />
          ))}
        </div>
      </div>
    </div>
  );
};

const AgentCardSkeleton = () => {
  return (
    <div className="flex flex-col h-[280px] rounded-xl border border-slate-100 dark:border-primary/5 bg-white dark:bg-primary/5 p-6">
      <div className="flex items-center gap-4 mb-6">
        {/* Avatar */}
        <Skeleton className="h-12 w-12 rounded-xl shrink-0" />

        {/* Title & Role */}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2 mb-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Footer */}
      <div className="mt-auto pt-5 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
};
