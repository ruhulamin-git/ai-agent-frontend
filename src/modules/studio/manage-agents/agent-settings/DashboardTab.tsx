import {
  Activity,
  CircleDollarSign,
  Globe,
  Lock,
  Pause,
  Play,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/button";

import { useAgentDashboardSummary } from "../services/getAgentDashboardSummary";

import { AgentRevenueChart } from "./AgentRevenueChart";

interface DashboardTabProps {
  agentId: string;
  visibility: "public" | "private";
  isActive: boolean;
  setIsActive: (v: boolean) => void;
}

export const DashboardTab = ({ agentId, visibility, isActive, setIsActive }: DashboardTabProps) => {
  const { t } = useTranslation();

  // Load real dashboard data from API
  const { data: dashboardSummary, isLoading: isLoadingSummary } = useAgentDashboardSummary(agentId);

  // Debug: Log dashboard data
  console.log("Dashboard Summary:", dashboardSummary);

  const stats = [
    {
      label: t("pages.agent_settings.dashboard.metrics.total_subscribers", "Total Subscribers"),
      value: dashboardSummary?.currentTotalSubscribers?.toLocaleString() ?? "0",
      sub: t("pages.agent_settings.dashboard.metrics.active", "Active"),
      icon: <Users size={18} />,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "hover:border-blue-500/20",
    },
    {
      label: t("pages.agent_settings.dashboard.metrics.monthly_revenue", "Monthly Revenue"),
      value: dashboardSummary?.monthlyRevenue
        ? `$${parseFloat(dashboardSummary.monthlyRevenue).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        : "$0.00",
      sub: t("pages.agent_settings.dashboard.metrics.current_month", "This Month"),
      icon: <CircleDollarSign size={18} />,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "hover:border-emerald-500/20",
    },
    {
      label: t("pages.agent_settings.dashboard.metrics.lifetime_revenue", "Lifetime Revenue"),
      value: dashboardSummary?.lifetimeRevenue
        ? `$${parseFloat(dashboardSummary.lifetimeRevenue).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        : "$0.00",
      sub: t("pages.agent_settings.dashboard.metrics.total_earned", "Total Earned"),
      icon: <Wallet size={18} />,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      border: "hover:border-violet-500/20",
    },
    {
      label: t("pages.agent_settings.dashboard.metrics.user_rating", "User Rating"),
      value:
        dashboardSummary?.averageRating && parseFloat(dashboardSummary.averageRating) > 0
          ? `${parseFloat(dashboardSummary.averageRating).toFixed(1)}/5.0`
          : "N/A",
      sub: t("pages.agent_settings.dashboard.metrics.reviews", "Reviews", {
        count: dashboardSummary?.totalReviews ?? 0,
      }),
      icon: <Star size={18} />,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "hover:border-amber-500/20",
    },
    {
      label: t("pages.agent_settings.dashboard.metrics.total_sales", "Total Sales"),
      value: dashboardSummary?.totalSales?.toLocaleString() ?? "0",
      sub: t("pages.agent_settings.dashboard.metrics.completed", "Completed"),
      icon: <Activity size={18} />,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "hover:border-purple-500/20",
    },
    {
      label: t("pages.agent_settings.dashboard.metrics.total_earned", "Total Earned"),
      value: dashboardSummary?.totalMoneyEarned
        ? `$${parseFloat(dashboardSummary.totalMoneyEarned).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        : "$0.00",
      sub: t("pages.agent_settings.dashboard.metrics.all_time", "All Time"),
      icon: <CircleDollarSign size={18} />,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "hover:border-rose-500/20",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header className="mb-2">
        <h2 className="text-3xl font-black tracking-tight text-foreground mb-1">
          {t("pages.agent_settings.dashboard.title")}
        </h2>
        <p className="text-muted-foreground text-[0.9375rem]">
          {t("pages.agent_settings.dashboard.description")}
        </p>
      </header>

      <div className="flex flex-col gap-12">
        {/* Status Bar */}
        <div className="flex items-center justify-between gap-4 p-4 mb-8">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wide border ${
                visibility === "public"
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-muted text-muted-foreground border-border"
              }`}
            >
              {visibility === "public" ? <Globe size={12} /> : <Lock size={12} />}
              {visibility === "public"
                ? t("pages.agent_settings.dashboard.visibility.public")
                : t("pages.agent_settings.dashboard.visibility.private")}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wide border ${
                isActive
                  ? "bg-green-600/10 text-green-600 border-green-600/20"
                  : "bg-amber-500/10 text-amber-500 border-amber-500/30"
              }`}
            >
              {isActive ? <Play size={12} /> : <Pause size={12} />}
              {isActive
                ? t("pages.agent_settings.dashboard.status.active")
                : t("pages.agent_settings.dashboard.status.paused")}
            </span>
          </div>
          <Button
            variant={isActive ? "secondary" : "default"}
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? (
              <>
                <Pause size={16} className="mr-2" />{" "}
                {t("pages.agent_settings.dashboard.controls.pause")}
              </>
            ) : (
              <>
                <Play size={16} className="mr-2" />{" "}
                {t("pages.agent_settings.dashboard.controls.activate")}
              </>
            )}
          </Button>
        </div>

        {/* Metrics Grid */}
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
                    {stat.icon}
                  </div>
                  <span
                    className={`text-[10px] font-bold ${stat.color} ${stat.bg} px-2 py-1 rounded-md uppercase tracking-wider`}
                  >
                    {stat.sub}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white leading-none">
                    {isLoadingSummary ? (
                      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="mt-8">
          <AgentRevenueChart agentId={agentId} />
        </div>
      </div>
    </div>
  );
};
