"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

import type { MyAgentSubscription } from "../../service/types";

interface UsageStatsTabProps {
  subscription: MyAgentSubscription;
}

export const UsageStatsTab = ({ subscription: _subscription }: UsageStatsTabProps) => {
  // Mock usage data (should come from API in production)
  const usageData = {
    messagesThisMonth: 1247,
    messageLimit: 5000,
    apiCalls: 3421,
    activeUsers: 89,
  };

  const usagePercentage = (usageData.messagesThisMonth / usageData.messageLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
          <CardContent className="p-4 text-center">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Messages This Month</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{usageData.messagesThisMonth}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">of {usageData.messageLimit} limit</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
          <CardContent className="p-4 text-center">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">API Calls</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{usageData.apiCalls}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total this month</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
          <CardContent className="p-4 text-center">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Active Users</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{usageData.activeUsers}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Last 30 days</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
          <CardContent className="p-4 text-center">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Usage</div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{usagePercentage.toFixed(0)}%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Of monthly limit</div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Progress */}
      <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Monthly Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Messages</span>
              <span className="text-gray-900 dark:text-white">
                {usageData.messagesThisMonth} / {usageData.messageLimit}
              </span>
            </div>
            <div className="w-full bg-gray-300 dark:bg-gray-800 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon */}
      <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Detailed Analytics (Coming Soon)</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-600 dark:text-gray-400 text-sm">
          <p>Advanced analytics features including:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Message volume trends</li>
            <li>Response time metrics</li>
            <li>User engagement analytics</li>
            <li>Conversation insights</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
