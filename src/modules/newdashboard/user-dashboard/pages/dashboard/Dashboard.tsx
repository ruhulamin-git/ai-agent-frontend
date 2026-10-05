"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

import { useBuyerDashboardSummary, useBuyerRecentPurchases, useBuyerTopRatedAgents } from "./service";
import { Skeleton } from "@/shared/ui/skeleton";

export const Dashboard = () => {
  const { data: summaryResponse, isLoading } = useBuyerDashboardSummary();
  const summary = summaryResponse?.data;

  const { data: topRatedResponse, isLoading: isLoadingTopRated } = useBuyerTopRatedAgents();
  const topRatedAgents = topRatedResponse?.data || [];

  const { data: recentPurchasesResponse, isLoading: isLoadingRecentPurchases } = useBuyerRecentPurchases();
  const recentPurchases = recentPurchasesResponse?.data || [];

  return (
    <div className="flex-1 p-4 lg:p-6 overflow-y-auto scrollbar-thin">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Purchased Agents</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary?.total_purchased_agents ?? 0}</p>
                )}
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-xl">🤖</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Active Subscriptions</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary?.total_active_subscriptions ?? 0}</p>
                )}
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-xl">✅</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Amount Spent</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    $ {summary?.total_amount_spent ?? "0.00"}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 text-xl">�</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Cancelled Subscriptions</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary?.cancelled_subscriptions ?? 0}</p>
                )}
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-lg flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 text-xl">❌</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Rated agent & Recent purchases */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Top Rated agent */}
        <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900 dark:text-white text-lg">Top Performing Agents</CardTitle>
            </div>
          </CardHeader>
          <CardContent>

            <div className="space-y-4">
              {isLoadingTopRated ? (
                <>
                  <div className="h-20 animate-pulse bg-gray-300 dark:bg-gray-800/50 rounded-lg" />
                  <div className="h-20 animate-pulse bg-gray-300 dark:bg-gray-800/50 rounded-lg" />
                  <div className="h-20 animate-pulse bg-gray-300 dark:bg-gray-800/50 rounded-lg" />
                </>
              ) : topRatedAgents.length === 0 ? (
                <p className="text-sm text-gray-500">No agents found.</p>
              ) : (
                topRatedAgents.slice(0, 5).map((agent) => (
                  <div
                    key={agent.agent_id}
                    className="flex items-center justify-between p-4 bg-gray-200 dark:bg-gray-800/30 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center font-bold text-purple-600 dark:text-purple-400">
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{agent.name}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            👥 {agent.total_reviews} Reviews
                          </span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            ⭐ {agent.average_rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </CardContent>
        </Card>

        {/* Recent purchases */}
        <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900 dark:text-white text-lg">Recent purchases</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingRecentPurchases ? (
                <>
                  <div className="h-20 animate-pulse bg-gray-300 dark:bg-gray-800/50 rounded-lg" />
                  <div className="h-20 animate-pulse bg-gray-300 dark:bg-gray-800/50 rounded-lg" />
                  <div className="h-20 animate-pulse bg-gray-300 dark:bg-gray-800/50 rounded-lg" />
                </>
              ) : recentPurchases.length === 0 ? (
                <p className="text-sm text-gray-500">No recent purchases.</p>
              ) : (
                recentPurchases.map((purchase) => (
                  <div
                    key={purchase.purchase_id}
                    className="flex items-center justify-between p-4 bg-gray-200 dark:bg-gray-800/30 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{purchase.agent_name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {new Date(purchase.purchased_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">$ {purchase.amount}</p>
                      <p className={`text-xs capitalize ${purchase.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        {purchase.status}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};
