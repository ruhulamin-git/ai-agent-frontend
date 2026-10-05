"use client";

import { useTranslation } from "react-i18next";

import { useUserProfile } from "@/shared/api/userProfile";
import { Button } from "@/shared/ui/button";
import { NeonBlobCursor } from "@/shared/ui/neon-blob-cursor";

import { WelcomeCardSkeleton } from "./WelcomeCardSkeleton";

import type { WelcomeData } from "@/services/dashboard";

interface WelcomeCardProps {
  data?: WelcomeData;
  isLoading: boolean;
  isCreator?: boolean;
  totalRevenue?: string;
  totalAgents?: number;
}

export const WelcomeCard = ({
  data,
  isLoading,
  isCreator,
  totalRevenue,
  totalAgents,
}: WelcomeCardProps) => {
  const { t } = useTranslation();
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();

  if (isLoading || isProfileLoading || !data) {
    return <WelcomeCardSkeleton />;
  }

  const lastName = profile ? profile.lastName?.trim() || "" : "";

  return (
    <NeonBlobCursor blobColor="#60a5fa" blobSize={300} intensity={0.3} className="rounded-4xl">
      <div className="relative overflow-hidden rounded-4xl bg-card dark:bg-primary/5 glass-panel p-6 md:p-8 shadow-sm group">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-all duration-1000 animate-pulse" />
        <div className="absolute bottom-0 left-1/4 h-32 w-32 rounded-full bg-indigo-500/5 blur-3xl group-hover:bg-indigo-500/10 transition-all duration-1000" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-[10px] font-bold uppercase tracking-widest text-primary">
              <span className="material-symbols-outlined text-sm">
                {isCreator ? "workspace_premium" : "stars"}
              </span>
              {isCreator ? t("common.creator", "Creator") : data.plan}
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                {t("dashboard.welcome_back")}{" "}
                <span className="text-primary">{lastName || data.userName}</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 max-w-lg text-sm font-medium leading-relaxed">
                {isCreator ? t("dashboard.creator_welcome") : t("dashboard.active_channels")}{" "}
                {!isCreator && (
                  <span className="text-slate-900 dark:text-white font-bold text-base">
                    {t("dashboard.active_channels_count", { count: 5 })}
                  </span>
                )}
                .
              </p>
            </div>

            <div className="w-full max-w-70 space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  {isCreator
                    ? t("pages.creator_dashboard.total_agents")
                    : t("dashboard.plan_utilization")}
                </span>
                <span className="text-[10px] font-bold text-primary">
                  {isCreator
                    ? `${totalAgents ?? 0} ${t("common.agents", "Agents")}`
                    : t("dashboard.agents_count", { used: 4, total: 10 })}
                </span>
              </div>
              {!isCreator && (
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: "40%" }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-5 bg-card-foreground dark:bg-primary/10 p-5 rounded-2xl border border-slate-100 dark:border-slate-200/15 backdrop-blur-sm self-start md:self-center shrink-0 glass-panel">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white dark:text-black shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-2xl">
                {isCreator ? "payments" : "account_balance_wallet"}
              </span>
            </div>
            <div className="flex flex-col">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest mb-0.5">
                {isCreator
                  ? t("pages.creator_dashboard.total_revenue")
                  : t("dashboard.available_credits")}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-white leading-none">
                  {isCreator
                    ? totalRevenue
                      ? `$${totalRevenue}`
                      : "$0"
                    : data.credits.toLocaleString()}
                </span>
                {!isCreator && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-primary/10 text-primary -mt-1"
                  >
                    <span className="material-symbols-outlined text-lg">add_circle</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </NeonBlobCursor>
  );
};
