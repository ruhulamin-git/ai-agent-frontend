"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { ErrorState } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { useUserAgentsData } from "../hooks";

import { UserAgentCard } from "./UserAgentCard";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Workaround for React 19 types compatibility with framer-motion
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as React.ComponentType<any>;

export const MyAgentsTab = () => {
  const { t } = useTranslation();
  const { userAgents, isLoading, isError, refetch, search, setSearch, status, setStatus } =
    useUserAgentsData();

  const statusOptions = [
    { value: "all", label: t("pages.my_agents.all_status") },
    { value: "active", label: t("pages.my_agents.active") },
    { value: "inactive", label: t("pages.my_agents.inactive") },
  ];

  const filteredAgents = userAgents.filter((agent) => {
    if (status === "all") return true;
    return agent.status === status;
  });

  if (isLoading) {
    return (
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
        {[...Array(8)].map((_, index) => (
          <div
            key={`my-agents-skeleton-${index}`}
            className="h-72 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-20">
        <ErrorState
          title={t("pages.my_agents.unable_to_load")}
          message={t("pages.my_agents.unable_to_load_message")}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto mb-8">
        <div className="relative group w-full sm:w-72">
          <Input
            type="text"
            placeholder={t("pages.my_agents.search_placeholder")}
            className="h-12 pl-11 pr-4 bg-slate-50 dark:bg-primary/5 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-300 focus:bg-white dark:focus:bg-primary/10 focus:ring-slate-200 dark:focus:ring-primary/30 caret-slate-900 dark:caret-primary transition-all duration-300 rounded-xl w-full text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute left-4 top-0 bottom-0 flex items-center text-slate-400 dark:text-slate-500 group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined text-[22px]">search</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant={status === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setStatus(option.value)}
              className="rounded-lg"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid Section */}
      <MotionDiv
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr"
      >
        {filteredAgents.map((userAgent) => (
          <MotionDiv key={userAgent.id} variants={item} className="h-full">
            <UserAgentCard userAgent={userAgent} />
          </MotionDiv>
        ))}
      </MotionDiv>

      {/* Empty State */}
      {filteredAgents.length === 0 && (
        <MotionDiv
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 px-4 text-center rounded-3xl bg-slate-50/50 dark:bg-slate-900/20 border border-dashed border-slate-200 dark:border-slate-800"
        >
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-white dark:bg-slate-900 shadow-xl ring-1 ring-slate-200 dark:ring-slate-800">
              <span className="material-symbols-outlined text-5xl text-primary animate-pulse-glow">
                {search ? "search_off" : "smart_toy"}
              </span>
            </div>
          </div>

          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3 uppercase tracking-tight">
            {search ? t("pages.my_agents.no_matches_found") : t("pages.my_agents.ready_to_launch")}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-10 text-base leading-relaxed">
            {search
              ? t("pages.my_agents.no_matches_description", { search })
              : t("pages.my_agents.empty_state_description")}
          </p>

          {!search && (
            <Button
              onClick={() => (window.location.href = "/dashboard/agents")}
              className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 uppercase tracking-wide text-xs"
            >
              <span className="material-symbols-outlined mr-2 text-lg">rocket_launch</span>
              {t("pages.my_agents.explore_marketplace")}
            </Button>
          )}
          {search && (
            <Button
              onClick={() => setSearch("")}
              variant="outline"
              className="h-11 px-6 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold rounded-xl uppercase tracking-wide text-xs"
            >
              {t("pages.my_agents.clear_filter")}
            </Button>
          )}
        </MotionDiv>
      )}
    </div>
  );
};
