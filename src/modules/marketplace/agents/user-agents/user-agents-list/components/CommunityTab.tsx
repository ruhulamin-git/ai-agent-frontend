"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { ErrorState } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { CommunityAgentCard } from "../../../community-agents/components";
import { useMyCommunityAgentsData } from "../../../community-agents/hooks/useMyCommunityAgentsData";

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

export const CommunityTab = () => {
  const { t } = useTranslation();
  const { agents, pagination, isLoading, isError, refetch, search, setSearch, page, setPage } =
    useMyCommunityAgentsData();

  if (isLoading) {
    return (
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
        {[...Array(8)].map((_, index) => (
          <div
            key={`community-skeleton-${index}`}
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
          title={t("pages.agents.unable_to_load")}
          message={t("pages.agents.unable_to_load_message")}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Search */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto mb-8">
        <div className="relative group w-full sm:w-72">
          <Input
            type="text"
            placeholder={t("pages.my_agents.search_community_placeholder")}
            className="h-12 pl-11 pr-4 bg-slate-50 dark:bg-primary/5 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-300 focus:bg-white dark:focus:bg-primary/10 focus:ring-slate-200 dark:focus:ring-primary/30 caret-slate-900 dark:caret-primary transition-all duration-300 rounded-xl w-full text-sm font-medium"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <div className="absolute left-4 top-0 bottom-0 flex items-center text-slate-400 dark:text-slate-500 group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined text-[22px]">search</span>
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <MotionDiv
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr"
      >
        {agents.map((agent) => (
          <MotionDiv key={agent.id} variants={item} className="h-full">
            <CommunityAgentCard agent={agent} href={`/dashboard/my-agents/community/${agent.id}`} />
          </MotionDiv>
        ))}
      </MotionDiv>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="gap-1"
          >
            <span className="material-symbols-outlined text-base">chevron_left</span>
            {t("common.previous")}
          </Button>
          <span className="text-sm text-slate-500 dark:text-slate-400 px-3">
            {t("common.page_of", { page, total: pagination.totalPages })}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage(page + 1)}
            className="gap-1"
          >
            {t("common.next")}
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </Button>
        </div>
      )}

      {/* Empty State */}
      {agents.length === 0 && (
        <MotionDiv
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 px-4 text-center rounded-3xl bg-slate-50/50 dark:bg-slate-900/20 border border-dashed border-slate-200 dark:border-slate-800"
        >
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-white dark:bg-slate-900 shadow-xl ring-1 ring-slate-200 dark:ring-slate-800">
              <span className="material-symbols-outlined text-5xl text-primary animate-pulse-glow">
                {search ? "search_off" : "groups"}
              </span>
            </div>
          </div>

          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3 uppercase tracking-tight">
            {search
              ? t("pages.my_agents.no_community_matches")
              : t("pages.my_agents.no_community_agents")}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-10 text-base leading-relaxed">
            {search
              ? t("pages.my_agents.no_community_matches_description", { search })
              : t("pages.my_agents.no_community_agents_description")}
          </p>

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
