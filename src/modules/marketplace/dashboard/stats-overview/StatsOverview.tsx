"use client";

import type { DashboardStats } from "@/services/dashboard";

interface StatsOverviewProps {
  data?: DashboardStats;
  isLoading: boolean;
}

export const StatsOverview = ({ data, isLoading }: StatsOverviewProps) => {
  const SKELETON_COUNT = 4;
  const SKELETON_HEIGHT = 32;

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => `skeleton-${i}`).map((id) => (
          <div
            key={id}
            className={`h-${SKELETON_HEIGHT} rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse`}
          />
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "My Subscriptions",
      value: data.mySubscriptions,
      icon: "subscriptions",
      change: "Active",
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Connected Channels",
      value: data.connectedChannels,
      icon: "hub",
      change: "Connected",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      label: "My Private Agents",
      value: data.myPrivateAgents,
      icon: "smart_toy",
      change: "Created",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
    {
      label: "Active Agents",
      value: data.activeAgents,
      icon: "smart_toy",
      change: "Operational",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-2xl ${stat.bgColor} dark:bg-slate-800 ${stat.color} group-hover:scale-110 transition-transform`}
            >
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {stat.change}
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">
              {stat.label}
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {stat.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
