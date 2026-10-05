export const UserAgentCardSkeleton = () => {
  return (
    <div className="group relative flex flex-col h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary/5 p-6 overflow-hidden">
      <div className="relative z-10 flex flex-col h-full">
        {/* Top Section: Avatar & Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-primary/5 animate-pulse" />
          <div className="w-16 h-6 rounded-lg bg-slate-200 dark:bg-primary/5 animate-pulse" />
        </div>

        {/* Content Section */}
        <div className="space-y-3 flex-1">
          <div className="space-y-2">
            <div className="h-6 w-3/4 bg-slate-200 dark:bg-primary/5 rounded-md animate-pulse" />
            <div className="h-3 w-1/4 bg-slate-200 dark:bg-primary/5 rounded-md animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-full bg-slate-200 dark:bg-primary/5 rounded-md animate-pulse" />
            <div className="h-4 w-5/6 bg-slate-200 dark:bg-primary/5 rounded-md animate-pulse" />
          </div>
        </div>

        {/* Bottom Section: Single Button */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="h-10 w-full bg-slate-200 dark:bg-primary/5 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
};
