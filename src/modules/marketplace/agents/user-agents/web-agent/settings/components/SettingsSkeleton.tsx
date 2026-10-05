"use client";

import { Skeleton } from "@/shared/ui/skeleton";

export const SettingsSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Basic Settings Skeleton */}
      <div className="space-y-8">
        {/* Status Section */}
        <div className="flex items-center justify-between py-4 px-5 rounded-xl border border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>

        {/* Configuration Section */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-28" />
          </div>
          <div className="grid grid-cols-1 gap-5 max-w-2xl">
            <div>
              <Skeleton className="h-4 w-12 mb-1.5" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div>
              <Skeleton className="h-4 w-32 mb-1.5" />
              <Skeleton className="h-20 w-full rounded-md" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-1.5" />
              <Skeleton className="h-20 w-full rounded-md" />
            </div>
          </div>
          <Skeleton className="h-9 w-28 mt-5 rounded-md" />
        </div>
      </div>

      <div className="border-t border-border" />

      {/* API Keys Section */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-7 w-20 rounded-md" />
        </div>
        <Skeleton className="h-4 w-64 mb-5" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-7 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Widget Config Skeleton */}
      <div className="space-y-8">
        {/* Widget Status */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-4 w-48 mb-4" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-11 rounded-full" />
            <Skeleton className="h-4 w-14" />
          </div>
        </div>

        {/* Theme Section */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-14" />
          </div>
          <Skeleton className="h-4 w-48 mb-5" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-w-2xl">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-28 mb-1.5" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Display Section */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-4 w-56 mb-5" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-w-2xl">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={i >= 3 ? "md:col-span-2" : ""}>
                <Skeleton className="h-4 w-32 mb-1.5" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
            <div className="flex items-center gap-3 self-end pb-0.5">
              <Skeleton className="h-6 w-11 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        {/* Behavior Section */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-4 w-64 mb-5" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-11 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Allowed Domains Section */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-4 w-56 mb-5" />
          <div className="space-y-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-10 flex-1 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>
            ))}
          </div>
          <Skeleton className="h-9 w-28 mt-4 rounded-md" />
        </div>

        {/* Rate Limiting Section */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-4 w-64 mb-4" />
          <div className="max-w-xs">
            <Skeleton className="h-4 w-32 mb-1.5" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>

        {/* Save Button */}
        <div className="border-t border-border pt-6">
          <Skeleton className="h-9 w-40 rounded-md" />
        </div>
      </div>
    </div>
  );
};
