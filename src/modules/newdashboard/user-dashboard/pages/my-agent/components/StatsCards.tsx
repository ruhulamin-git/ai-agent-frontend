"use client";

import { Card, CardContent } from "@/shared/ui/card";

import type { MyAgentsStats } from "../service/types";

interface StatsCardsProps {
  stats: MyAgentsStats;
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
      <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
        <CardContent className="p-4 text-center">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Subscriptions</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSubscriptions}</div>
        </CardContent>
      </Card>

      <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
        <CardContent className="p-4 text-center">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Active Agents</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.activeSubscriptions}</div>
        </CardContent>
      </Card>

      <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
        <CardContent className="p-4 text-center">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Pending</div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendingSubscriptions}</div>
        </CardContent>
      </Card>

      <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
        <CardContent className="p-4 text-center">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Monthly Spend</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">${stats.monthlySpend.toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
  );
};
