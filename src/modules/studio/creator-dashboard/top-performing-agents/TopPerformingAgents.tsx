"use client";

import { useTranslation } from "react-i18next";

import { useTopPerformingAgents } from "../services";

export const TopPerformingAgents = () => {
  const { t } = useTranslation();
  const { data: agentsData, isLoading, error } = useTopPerformingAgents({ pageSize: 4 });

  const agents = agentsData?.data || [];

  const getAgentIcon = (name: string) => {
    if (name.toLowerCase().includes("support")) return "support_agent";
    if (name.toLowerCase().includes("content") || name.toLowerCase().includes("writer"))
      return "edit_note";
    if (name.toLowerCase().includes("data") || name.toLowerCase().includes("analyst"))
      return "analytics";
    if (name.toLowerCase().includes("code")) return "code";
    return "smart_toy";
  };

  const getAgentColor = (index: number) => {
    const colors = [
      { color: "text-blue-500", bg: "bg-blue-500/10" },
      { color: "text-emerald-500", bg: "bg-emerald-500/10" },
      { color: "text-purple-500", bg: "bg-purple-500/10" },
      { color: "text-amber-500", bg: "bg-amber-500/10" },
    ];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <div className="bg-card dark:bg-primary/5 rounded-4xl shadow-sm border border-slate-200/60 dark:border-slate-200/15 overflow-hidden flex flex-col glass-panel">
        <div className="p-6 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {t("pages.creator_dashboard.top_agents", "Top Performing Agents")}
          </h3>
        </div>
        <div className="p-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div>
                  <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
                  <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </div>
              </div>
              <div className="text-right">
                <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-1" />
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show error or no data state
  if (error || agents.length === 0) {
    return (
      <div className="bg-card dark:bg-primary/5 rounded-4xl shadow-sm border border-slate-200/60 dark:border-slate-200/15 overflow-hidden flex flex-col glass-panel">
        <div className="p-6 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {t("pages.creator_dashboard.top_agents", "Top Performing Agents")}
          </h3>
        </div>
        <div className="p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-slate-400">smart_toy</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {error
              ? t("creator_dashboard.agents_error", "Unable to load top performing agents.")
              : t("creator_dashboard.no_agents", "No top performing agents available.")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card dark:bg-primary/5 rounded-4xl shadow-sm border border-slate-200/60 dark:border-slate-200/15 overflow-hidden flex flex-col glass-panel">
      <div className="p-6 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          {t("pages.creator_dashboard.top_agents", "Top Performing Agents")}
        </h3>
        <button className="text-xs font-bold text-primary hover:underline uppercase tracking-wider cursor-pointer">
          {t("pages.creator_dashboard.view_all", "View All")}
        </button>
      </div>
      <div className="p-2">
        {agents.map((agent, i) => {
          const { color, bg } = getAgentColor(i);
          const icon = getAgentIcon(agent.name);

          return (
            <div
              key={agent.id}
              className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-primary/10 rounded-2xl transition-all group"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${color}`}
                >
                  <span className="material-symbols-outlined text-xl">{icon}</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                    {agent.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px] text-amber-400">
                        star
                      </span>
                      {agent.averageRating && parseFloat(agent.averageRating) > 0
                        ? parseFloat(agent.averageRating).toFixed(1)
                        : "0.0"}
                    </span>
                    <span className="h-0.5 w-0.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                    <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">
                      {agent.currentTotalSubscribers || 0} subscribers
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  ${parseFloat(agent.totalRevenue).toFixed(2)}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {t("pages.creator_dashboard.revenue", "Revenue")}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
