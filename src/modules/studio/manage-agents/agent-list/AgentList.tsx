"use client";

import { motion } from "framer-motion";
import { Plus, Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { AIStudioTabs } from "../../ai-studio/AIStudioTabs";

import { AgentCard } from "./components/AgentCard";
import { useAgentListData } from "./hooks";

import type { UserAgent } from "../types";
// Workaround for React 19 types compatibility with framer-motion
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as React.ComponentType<any>;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const AgentList: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { agents, isLoading, search, setSearch } = useAgentListData();

  return (
    <div>
      {/* Tabs Navigation */}
      <AIStudioTabs />

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold uppercase tracking-widest text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            {t("pages.ai_studio.title")}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
            {t("pages.ai_studio.title")}
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
            {t("pages.ai_studio.description")}
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative group w-full sm:w-72">
            <Input
              type="text"
              placeholder={t("pages.ai_studio.search_placeholder")}
              className="h-12 pl-11 pr-4 bg-slate-50 dark:bg-primary/5 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-300 focus:bg-white dark:focus:bg-primary/10 focus:ring-slate-200 dark:focus:ring-primary/30 caret-slate-900 dark:caret-primary transition-all duration-300 rounded-xl w-full text-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute left-4 top-0 bottom-0 flex items-center text-slate-400 dark:text-slate-500 group-focus-within:text-primary transition-colors">
              <Search size={18} />
            </div>
          </div>
          <Button
            onClick={() => router.push("/dashboard/ai-studio/create")}
            className="h-10 px-4 w-full sm:w-auto font-medium"
          >
            <Plus size={16} className="mr-1.5" />
            {t("pages.ai_studio.create_agent")}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr mt-10">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={`skeleton-agent-${i}`}
              className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Agent Cards Grid */}
      {!isLoading && agents.length > 0 && (
        <MotionDiv
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr mt-10"
        >
          {agents.map((agent: UserAgent) => (
            <MotionDiv key={agent.id} variants={item} className="h-full">
              <AgentCard agent={agent} />
            </MotionDiv>
          ))}
        </MotionDiv>
      )}

      {/* Empty State */}
      {!isLoading && agents.length === 0 && (
        <MotionDiv
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center px-8 py-16 text-center rounded-3xl bg-muted/30 border border-dashed border-border mt-10"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-card shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-border">
              <Sparkles size={32} className="text-primary" />
            </div>
          </div>
          <h3 className="text-[22px] font-extrabold text-foreground mb-2 uppercase tracking-tight">
            {search ? t("pages.my_agents.no_matches_found") : t("pages.ai_studio.no_agents")}
          </h3>
          <p className="text-[15px] text-muted-foreground max-w-sm mb-6 leading-relaxed">
            {search
              ? t("pages.my_agents.no_matches_description", { search })
              : t("pages.ai_studio.no_agents_description")}
          </p>
          {!search && (
            <Button
              onClick={() => router.push("/dashboard/ai-studio/create")}
              className="h-10 px-5 font-medium"
            >
              <Plus size={16} className="mr-1.5" />
              {t("pages.ai_studio.create_agent")}
            </Button>
          )}
        </MotionDiv>
      )}
    </div>
  );
};
