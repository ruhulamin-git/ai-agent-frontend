"use client";

import { ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

import {
  useRecentSales,
  useSellerRevenueOverview,
  useSellerSummary,
  useTopPerformingAgents,
} from "./service";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApexChartOptions = any;

const GRADIENT_STOP_0 = 0;
const GRADIENT_STOP_100 = 100;
const STROKE_WIDTH = 3;
const GRID_STROKE_DASH_ARRAY = 4;
const FONT_SIZE_SMALL = 10;
const FONT_SIZE_MEDIUM = 12;

export const DeveloperDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data: summaryData, isLoading: summaryLoading } = useSellerSummary();
  const { data: agentsData, isLoading: agentsLoading } = useTopPerformingAgents({ pageSize: 3 });
  const { data: salesData, isLoading: salesLoading } = useRecentSales({ pageSize: 3 });
  const { data: revenueData, isLoading: revenueLoading } = useSellerRevenueOverview({
    mode: "monthly",
    year: selectedYear,
    month: selectedMonth,
  });

  const stats = {
    totalRevenue: summaryData?.totalRevenue || "$0",
    activeAgents: summaryData?.totalPublicAgents || 0,
    totalUsers: summaryData?.totalSubscribers || 0,
    totalSales: summaryData?.totalSales || 0,
  };

  const topAgents = agentsData?.data || [];
  const recentSales = salesData?.data || [];

  // Handle revenue chart data
  const labels = revenueData?.labels || [];
  const values = revenueData?.values?.map((val: string) => parseFloat(val)) || [];

  const getDescriptionText = () => {
    const monthName = monthNames.find((m) => m.value === selectedMonth)?.label || "";
    return `Showing total revenue generated from your agents in ${monthName} ${selectedYear}.`;
  };

  // Chart configuration
  const chartOptions: ApexChartOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      sparkline: { enabled: false },
      background: "transparent",
      fontFamily: "inherit",
      height: 300,
    },
    stroke: {
      curve: "smooth",
      width: STROKE_WIDTH,
      colors: ["#a855f7"],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [GRADIENT_STOP_0, GRADIENT_STOP_100],
        colorStops: [
          {
            offset: GRADIENT_STOP_0,
            color: "#a855f7",
            opacity: 0.4,
          },
          {
            offset: GRADIENT_STOP_100,
            color: "#a855f7",
            opacity: 0,
          },
        ],
      },
    },
    xaxis: {
      categories: labels.length > 0 ? labels : ["Week 1", "Week 2", "Week 3", "Week 4"],
      labels: {
        show: true,
        style: {
          colors: "#94a3b8",
          fontSize: `${FONT_SIZE_MEDIUM}px`,
          fontWeight: 600,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `$${value.toFixed(0)}`,
        style: {
          colors: "#94a3b8",
          fontSize: `${FONT_SIZE_SMALL}px`,
          fontWeight: 600,
        },
      },
    },
    grid: {
      borderColor: "#374151",
      strokeDashArray: GRID_STROKE_DASH_ARRAY,
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
    tooltip: {
      theme: "dark",
      x: { show: true },
      y: {
        formatter: (value: number) => `$${value.toFixed(2)}`,
      },
    },
    dataLabels: { enabled: false },
  };

  const chartSeries = [
    {
      name: "Revenue",
      data: values.length > 0 ? values : [120, 150, 180, 200],
    },
  ];

  const currentYear = new Date().getFullYear();
  const monthNames = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const yearOptions = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} mins ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  if (summaryLoading) {
    return (
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto scrollbar-thin">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
              <CardContent className="p-4">
                <div className="h-20 animate-pulse bg-gray-300 dark:bg-gray-800/50 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-6 overflow-y-auto scrollbar-thin">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$ {stats.totalRevenue}</p>
                <p className="text-xs text-green-600 dark:text-green-400">Lifetime earnings</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 text-xl">💰</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Active Agents</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeAgents}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Public agents</p>
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
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Subscribers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                <p className="text-xs text-green-600 dark:text-green-400">Active users</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-xl">👥</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSales}</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">Completed</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 dark:text-orange-400 text-xl">🛒</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Agents & Recent Sales */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Top Performing Agents */}
        <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900 dark:text-white text-lg">Top Performing Agents</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {agentsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 animate-pulse bg-gray-300 dark:bg-gray-800/50 rounded-lg" />
                ))}
              </div>
            ) : topAgents.length === 0 ? (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">No agents available</div>
            ) : (
              <div className="space-y-4">
                {topAgents.map((agent, index) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-4 bg-gray-200 dark:bg-gray-800/30 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center font-bold text-purple-600 dark:text-purple-400">
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{agent.name}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            👥 {agent.currentTotalSubscribers}
                          </span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            ⭐ {parseFloat(agent.averageRating).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 dark:text-green-400">
                        $ {parseFloat(agent.totalRevenue).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900 dark:text-white text-lg">Recent Sales</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {salesLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 animate-pulse bg-gray-300 dark:bg-gray-800/50 rounded-lg" />
                ))}
              </div>
            ) : recentSales.length === 0 ? (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">No sales available</div>
            ) : (
              <div className="space-y-4">
                {recentSales.map((sale) => (
                  <div
                    key={sale.purchaseId}
                    className="flex items-center justify-between p-4 bg-gray-200 dark:bg-gray-800/30 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{sale.agentName}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Purchased by {sale.buyerName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {formatTimeAgo(sale.purchasedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">${parseFloat(sale.amount).toFixed(2)}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{sale.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <CardTitle className="text-gray-900 dark:text-white text-lg">Revenue Overview</CardTitle>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{getDescriptionText()}</p>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="px-4 py-2 cursor-pointer rounded text-sm font-medium transition-colors border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800/20 flex items-center gap-2">
                    {monthNames.find((m) => m.value === selectedMonth)?.label || "Select Month"}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                  {monthNames.map((month) => (
                    <DropdownMenuItem
                      key={month.value}
                      onClick={() => setSelectedMonth(month.value)}
                      className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {month.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="px-4 py-2 cursor-pointer rounded text-sm font-medium transition-colors border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800/20 flex items-center gap-2">
                    {selectedYear}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                  {yearOptions.map((year) => (
                    <DropdownMenuItem
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {year}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Growth Indicator */}
              {values.length > 1 && values.some((val) => val > 0) && (
                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold">
                    <span>📈</span>
                    {(() => {
                      const firstValue = Number(values[0]);
                      const lastValue = Number(values[values.length - 1]);
                      const growth =
                        firstValue > 0
                          ? (((lastValue - firstValue) / firstValue) * 100).toFixed(1)
                          : 0;
                      return `${Number(growth) > 0 ? "+" : ""}${growth}%`;
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {revenueLoading ? (
            <div className="h-64 animate-pulse bg-gray-300 dark:bg-gray-800/50 rounded-lg" />
          ) : (
            <div className="min-h-60">
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="area"
                height="300"
                width="100%"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
