"use client";

import { useTranslation } from "react-i18next";

import { useSellerSummary } from "../services";

export const CreatorStatsGrid = () => {
  const { t } = useTranslation();
  const { data: summaryData } = useSellerSummary();

  const stats = [
    {
      label: t("pages.creator_dashboard.total_agents", "Total Agents Created"),
      value: summaryData?.totalAgentsCreated ?? 0,
      sub: t("pages.creator_dashboard.lifetime", "Lifetime"),
      icon: "smart_toy",
      color: "text-primary",
      bg: "bg-primary/5 dark:bg-primary/10",
      border: "hover:border-primary/20",
    },
    {
      label: t("pages.creator_dashboard.public_agents", "Total Public Agents"),
      value: summaryData?.totalPublicAgents ?? 0,
      sub: t("pages.creator_dashboard.marketplace", "Marketplace"),
      icon: "public",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      border: "hover:border-emerald-500/20",
    },
    {
      label: t("pages.creator_dashboard.subscribers", "Total Subscribers"),
      value: summaryData?.totalSubscribers ?? 0,
      sub: t("pages.creator_dashboard.active", "Active"),
      icon: "group",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-500/10",
      border: "hover:border-blue-500/20",
    },
    {
      label: t("pages.creator_dashboard.total_sales", "Total Sales"),
      value: summaryData?.totalSales ?? 0,
      sub: t("pages.creator_dashboard.completed", "Completed"),
      icon: "shopping_cart",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      border: "hover:border-amber-500/20",
    },
    {
      label: t("pages.creator_dashboard.total_revenue", "Total Revenue"),
      value: summaryData?.totalRevenue ? `$${summaryData.totalRevenue}` : "$0",
      sub: t("pages.creator_dashboard.earned", "Earned"),
      icon: "payments",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-500/10",
      border: "hover:border-purple-500/20",
    },
    {
      label: t("pages.creator_dashboard.pending_payouts", "Pending Payouts"),
      value: summaryData?.pendingPayouts ? `$${summaryData.pendingPayouts}` : "$0",
      sub: t("pages.creator_dashboard.processing", "Processing"),
      icon: "account_balance_wallet",
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-500/10",
      border: "hover:border-rose-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, key) => (
        <div
          key={key}
          className="h-full rounded-3xl border-0 dark:border hover:border-primary/50 transition-all duration-300 hover:scale-[1.01]"
        >
          <div
            className={`h-full rounded-3xl bg-card dark:bg-primary/5 p-5 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-black/40 glass-panel ${stat.border} group/stat`}
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
  );
};
