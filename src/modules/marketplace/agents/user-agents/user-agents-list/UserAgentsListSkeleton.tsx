import { UserAgentCardSkeleton } from "./components/UserAgentCardSkeleton";

export const UserAgentsListSkeleton = () => {
  return (
    <div className="space-y-10">
      {/* Header Section Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="space-y-4">
          <div className="w-32 h-6 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
          <div className="w-64 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="w-96 max-w-full h-6 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        </div>

        {/* Search & Actions Skeleton */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="w-full sm:w-72 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="w-full sm:w-48 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
            <div className="w-24 h-10 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="w-24 h-10 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="w-24 h-10 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          </div>
          <div className="hidden md:flex gap-4">
            <div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
            <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Grid Section Skeleton */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <UserAgentCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};
