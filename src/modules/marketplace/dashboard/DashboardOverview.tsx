"use client";

import { useTranslation } from "react-i18next";

import { useDashboardData } from "@/services/dashboard";
import { Button } from "@/shared/ui/button";

import { RecentActivity } from "./recent-activity/RecentActivity";
import { StatsOverviewSkeleton } from "./stats-overview/StatsOverviewSkeleton";
import { WelcomeCard } from "./welcome-card/WelcomeCard";
import { WorkforceChart } from "./workforce-chart/WorkforceChart";

export const DashboardOverview = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useDashboardData();

  const stats = [
    {
      label: t("dashboard.active_agents"),
      value: data?.stats.activeAgents ?? 0,
      sub: t("dashboard.operational"),
      icon: "smart_toy",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      border: "hover:border-emerald-500/20",
    },
    {
      label: t("dashboard.channels"),
      value: 5,
      sub: t("dashboard.connected"),
      icon: "hub",
      color: "text-primary",
      bg: "bg-primary/5 dark:bg-primary/10",
      border: "hover:border-primary/20",
    },
    {
      label: t("dashboard.my_private_agents"),
      value: data?.stats.myPrivateAgents ?? 0,
      sub: t("dashboard.created"),
      icon: "smart_toy",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      border: "hover:border-amber-500/20",
    },
    {
      label: t("dashboard.my_subscriptions"),
      value: data?.stats.mySubscriptions ?? 0,
      sub: t("dashboard.active"),
      icon: "subscriptions",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-500/10",
      border: "hover:border-blue-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <WelcomeCard data={data?.welcome} isLoading={isLoading} />

      {/* Stats Row */}
      {isLoading ? (
        <StatsOverviewSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="h-full rounded-3xl border-0 dark:border hover:border-primary/50 hover:bg-black/60 transition-all duration-300 hover:scale-101"
            >
              <div
                className={`h-full rounded-3xl bg-card dark:bg-primary/5 p-5 shadow-sm transition-all hover:shadow-md hover:bg-slate-50 glass-panel ${stat.border} group/stat`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}
                  >
                    <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold ${stat.color} ${stat.bg} px-2 py-1 rounded-md uppercase tracking-wider`}
                  >
                    {stat.sub}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white leading-none">
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Full Width Chart */}
        <div className="w-full">
          <WorkforceChart isLoading={isLoading} />
        </div>

        {/* Full Width Activity */}
        <div className="bg-card dark:bg-primary/5 rounded-4xl shadow-sm overflow-hidden flex flex-col glass-panel">
          <div className="p-6 border-b border-slate-300 dark:border-slate-600 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              {t("dashboard.workforce_activity")}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-semibold text-primary hover:bg-primary/5 px-3"
            >
              {t("dashboard.view_analytics")}
            </Button>
          </div>
          <div>
            <RecentActivity activities={data?.activities} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};
