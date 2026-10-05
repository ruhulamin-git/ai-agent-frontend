"use client";

import { WelcomeCard } from "@/modules/marketplace/dashboard/welcome-card/WelcomeCard";
import { useDashboardData } from "@/services/dashboard";

import { RecentSales } from "./recent-sales/RecentSales";
import { CreatorRevenueChart } from "./revenue-chart/CreatorRevenueChart";
import { CreatorStatsGrid } from "./stats-grid/CreatorStatsGrid";
import { TopPerformingAgents } from "./top-performing-agents/TopPerformingAgents";
import { useSellerSummary } from "./services";

export const CreatorDashboardOverview = () => {
  const { data, isLoading } = useDashboardData();
  const { data: summaryData } = useSellerSummary();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <WelcomeCard
        data={data?.welcome}
        isLoading={isLoading}
        isCreator
        totalRevenue={summaryData?.totalRevenue}
        totalAgents={summaryData?.totalAgentsCreated}
      />

      {/* Stats Grid */}
      <CreatorStatsGrid />

      {/* Top Performing and Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopPerformingAgents />
        <RecentSales />
      </div>

      {/* Revenue Chart */}
      <div className="w-full">
        <CreatorRevenueChart isLoading={isLoading} />
      </div>
    </div>
  );
};
