"use client";

import { useTranslation } from "react-i18next";

import { useRecentSales } from "../services";

export const RecentSales = () => {
  const { t } = useTranslation();
  const { data: salesData, isLoading, error } = useRecentSales({ pageSize: 4 });

  const sales = salesData?.data || [];

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
        return "text-emerald-500";
      case "pending":
        return "text-amber-500";
      case "failed":
      case "cancelled":
        return "text-red-500";
      default:
        return "text-slate-500";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card dark:bg-primary/5 rounded-4xl shadow-sm border border-slate-200/60 dark:border-slate-200/15 overflow-hidden flex flex-col glass-panel">
        <div className="p-6 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {t("pages.creator_dashboard.recent_sales", "Recent Sales")}
          </h3>
        </div>
        <div className="p-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div>
                  <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
                  <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </div>
              </div>
              <div className="text-right">
                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-1" />
                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show error or no data state
  if (error || sales.length === 0) {
    return (
      <div className="bg-card dark:bg-primary/5 rounded-4xl shadow-sm border border-slate-200/60 dark:border-slate-200/15 overflow-hidden flex flex-col glass-panel">
        <div className="p-6 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {t("pages.creator_dashboard.recent_sales", "Recent Sales")}
          </h3>
        </div>
        <div className="p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-slate-400">shopping_cart</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {error
              ? t("creator_dashboard.sales_error", "Unable to load recent sales.")
              : t("creator_dashboard.no_sales", "No recent sales available.")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card dark:bg-primary/5 rounded-4xl shadow-sm border border-slate-200/60 dark:border-slate-200/15 overflow-hidden flex flex-col glass-panel">
      <div className="p-6 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          {t("pages.creator_dashboard.recent_sales", "Recent Sales")}
        </h3>
        <button className="text-xs font-bold text-primary hover:underline uppercase tracking-wider cursor-pointer">
          {t("pages.creator_dashboard.view_all", "View All")}
        </button>
      </div>
      <div className="p-2">
        {sales.map((sale) => (
          <div
            key={sale.purchaseId}
            className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-primary/10 rounded-2xl transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-primary/10 flex items-center justify-center text-slate-400">
                <span className="material-symbols-outlined text-lg">person</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {sale.buyerName}
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                  {sale.agentName}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-primary">
                ${parseFloat(sale.amount).toFixed(2)}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`text-[10px] font-bold uppercase tracking-tighter ${getStatusColor(
                    sale.status
                  )}`}
                >
                  {sale.status}
                </span>
                <span className="h-0.5 w-0.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {formatTimeAgo(sale.purchasedAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
