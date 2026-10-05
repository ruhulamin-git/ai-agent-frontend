"use client";

import { Skeleton } from "@/shared/ui/skeleton";

export const UserAgentDetailSkeleton = () => {
  return (
    <div className="bg-white dark:bg-primary/5 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
      <div className="flex h-[700px]">
        {/* Left Sidebar Skeleton */}
        <div className="w-85 shrink-0 border-r border-slate-200 dark:border-slate-800 flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-5">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>

            {/* Search Bar Skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 flex-1 rounded-xl" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          </div>

          {/* Chat List Skeleton */}
          <div className="flex-1 p-4 space-y-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Back Button Skeleton */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>

        {/* Right Chat Panel Skeleton */}
        <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-950/50">
          {/* Chat Header Skeleton */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24 rounded-lg" />
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
          </div>

          {/* Chat Messages Skeleton */}
          <div className="flex-1 p-6 space-y-6 overflow-hidden">
            <div className="flex justify-start">
              <div className="space-y-2">
                <Skeleton className="h-10 w-64 rounded-2xl rounded-tl-none" />
                <Skeleton className="h-10 w-48 rounded-2xl rounded-tl-none" />
              </div>
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-12 w-72 rounded-2xl rounded-tr-none" />
            </div>
            <div className="flex justify-start">
              <Skeleton className="h-20 w-80 rounded-2xl rounded-tl-none" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-10 w-40 rounded-2xl rounded-tr-none" />
            </div>
          </div>

          {/* Chat Input Skeleton */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex gap-3">
              <Skeleton className="h-11 flex-1 rounded-xl" />
              <Skeleton className="h-11 w-11 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
