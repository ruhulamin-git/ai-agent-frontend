"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui";

import { RecentActivitySkeleton } from "./RecentActivitySkeleton";

import type { RecentActivity as ActivityType } from "@/services/dashboard";

dayjs.extend(relativeTime);

interface RecentActivityProps {
  activities?: ActivityType[];
  isLoading: boolean;
}

export const RecentActivity = ({ activities, isLoading }: RecentActivityProps) => {
  const { t } = useTranslation();
  if (isLoading) {
    return <RecentActivitySkeleton />;
  }

  const getIcon = (type: ActivityType["type"]) => {
    switch (type) {
      case "agent_run":
        return "play_circle";
      case "agent_deployed":
        return "rocket_launch";
      case "integration_connected":
        return "link";
      default:
        return "info";
    }
  };

  return (
    <div className="divide-y divide-slate-300 dark:divide-slate-600">
      {activities?.map((activity) => (
        <div
          key={activity.id}
          className="p-3 hover:bg-slate-50 dark:hover:bg-primary/8 transition-all flex items-center gap-4 group"
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              activity.status === "success"
                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"
            }`}
          >
            <span className="material-symbols-outlined text-lg">{getIcon(activity.type)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-slate-900 dark:text-white leading-tight mb-0.5 truncate group-hover:text-primary transition-colors">
              {activity.title}
            </p>
            <div className="flex items-center gap-2 text-[10px] font-medium">
              <span className="text-slate-400 dark:text-slate-500">
                {dayjs(activity.timestamp).fromNow()}
              </span>
              <span className="h-0.5 w-0.5 rounded-full bg-slate-200 dark:bg-slate-700" />
              <span
                className={`uppercase tracking-wider font-bold ${
                  activity.status === "success" ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {t(`dashboard.${activity.status}`)}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 rounded-md"
          >
            <span className="material-symbols-outlined text-base text-slate-400">
              chevron_right
            </span>
          </Button>
        </div>
      ))}
    </div>
  );
};
