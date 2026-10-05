"use client";

import { motion } from "framer-motion";
import { Clock, Pencil, Plus, Search, Settings, Sparkles, Workflow } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { useStudioAgentsData } from "./hooks";

import type { StudioAgent } from "./types";
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

const AgentCard = ({ agent }: { agent: StudioAgent }) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-col bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 h-full hover:border-primary/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08),0_0_0_1px_rgba(var(--primary)/0.1)] hover:-translate-y-0.5 group">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary to-primary/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative py-5 px-5 pb-0">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 mb-3.5 transition-transform duration-300 group-hover:scale-105 overflow-hidden">
          <Sparkles size={20} className="text-primary" />
        </div>
        <h3 className="font-bold text-base text-foreground mb-1 leading-snug">{agent.name}</h3>
        <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
          {agent.description}
        </p>
      </div>

      <div className="flex items-center gap-4 py-3.5 px-5 mt-auto">
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            agent.status === "published"
              ? "bg-green-500/10 text-green-500"
              : "bg-muted-foreground/10 text-muted-foreground"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {agent.status === "published"
            ? t("pages.ai_studio.published")
            : t("pages.ai_studio.draft")}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Workflow size={12} />
          {t("pages.ai_studio.nodes_count", { count: agent.nodesCount })}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Clock size={12} />
          {agent.lastModified}
        </div>
      </div>

      <div className="flex items-center gap-2 py-3.5 px-5 border-t border-border">
        <button
          className="flex items-center justify-center gap-1.5 flex-1 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all border bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 no-underline"
          onClick={() => router.push(`/dashboard/ai-studio/${agent.id}/edit`)}
        >
          <Pencil size={13} />
          {t("pages.ai_studio.edit_agent")}
        </button>
        <button
          className="flex items-center justify-center gap-1.5 flex-none p-2 rounded-lg text-xs font-semibold cursor-pointer transition-all bg-transparent text-muted-foreground border border-border hover:bg-accent hover:text-foreground no-underline shrink-0"
          onClick={() => router.push(`/dashboard/ai-studio/${agent.id}/settings`)}
          aria-label="Settings"
        >
          <Settings size={13} />
        </button>
      </div>
    </div>
  );
};

export const AIStudioPage: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { studioAgents, isLoading, search, setSearch } = useStudioAgentsData();

  const SKELETON_COUNT = 4;

  return (
    <div>
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
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <div
              key={`skeleton-item-${Date.now()}-${i}`}
              className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Agent Cards Grid */}
      {!isLoading && studioAgents.length > 0 && (
        <MotionDiv
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr mt-10"
        >
          {studioAgents.map((agent) => (
            <MotionDiv key={agent.id} variants={item} className="h-full">
              <AgentCard agent={agent} />
            </MotionDiv>
          ))}
        </MotionDiv>
      )}

      {/* Empty State */}
      {!isLoading && studioAgents.length === 0 && (
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
