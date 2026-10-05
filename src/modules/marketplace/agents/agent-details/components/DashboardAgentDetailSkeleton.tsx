import { Skeleton } from "@/shared/ui/skeleton";

export const DashboardAgentDetailSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Hero Skeleton (Flat) */}
      <div className="flex flex-col items-center text-center pt-10 pb-12 px-4">
        {/* Icon */}
        <div className="mb-6">
          <Skeleton className="h-20 w-20 rounded-2xl" />
        </div>

        {/* Badge */}
        <Skeleton className="h-6 w-48 rounded-full mb-4" />

        {/* Title */}
        <Skeleton className="h-10 w-64 mb-3" />

        {/* Role */}
        <Skeleton className="h-6 w-40 mb-6" />

        {/* Description */}
        <div className="space-y-2 max-w-2xl mx-auto w-full mb-8">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Skeleton className="h-12 w-32 rounded-full" />
          <Skeleton className="h-12 w-32 rounded-full" />
        </div>
      </div>

      {/* Preview Section Skeleton */}
      <div className="border-t border-slate-100 dark:border-slate-800 py-12">
        <div className="max-w-3xl mx-auto space-y-4 px-4">
          <Skeleton className="h-10 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-lg p-2" />
          <div className="flex justify-end">
            <Skeleton className="h-10 w-1/2 bg-slate-100 dark:bg-slate-800 rounded-lg p-2" />
          </div>
        </div>
      </div>

      {/* Overview Skeleton */}
      <div className="border-t border-slate-100 dark:border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-6 w-32" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
