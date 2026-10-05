"use client";

import { motion } from "framer-motion";
import { Link2, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Skeleton } from "@/shared/ui/skeleton";

import { AIStudioTabs } from "../AIStudioTabs";

import { ExternalAgentCard } from "./components/ExternalAgentCard";
import { useExternalAgentsData } from "./hooks";

const LOADING_SKELETON_COUNT = 6;

const MotionDiv = motion.div as React.ComponentType<
  React.ComponentProps<typeof motion.div> & { className?: string }
>;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const ExternalAgentsPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { agents, isLoading, error, refetch } = useExternalAgentsData();

  const handleConnectAgent = () => {
    router.push("/dashboard/ai-studio/external-agents/connect");
  };

  const filteredAgents = agents.filter((externalAgent) => {
    const name = externalAgent.agent?.name || "";
    const searchLower = search.toLowerCase();

    return name.toLowerCase().includes(searchLower);
  });

  if (isLoading) {
    return <ExternalAgentsPageSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-8">
        {/* Tabs Navigation */}
        <AIStudioTabs />

        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-red-500 text-lg font-semibold">Backend API Not Available</div>
            <p className="text-muted-foreground max-w-md">
              The external agents API endpoint is not responding. Please ensure:
            </p>
            <ul className="text-sm text-muted-foreground text-left max-w-md mx-auto space-y-2">
              <li>• Backend server is running</li>
              <li>
                • Endpoint{" "}
                <code className="bg-muted px-1 py-0.5 rounded">/api/v1/external-agents</code> is
                implemented
              </li>
              <li>• CORS is configured correctly</li>
              <li>• Authentication token is valid</li>
            </ul>
            <Button onClick={() => refetch()} variant="outline" className="mt-4">
              Retry Connection
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
            {t("pages.external_agents.badge", "Third-Party Integrations")}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
            {t("pages.external_agents.title", "External AI Agents")}
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
            {t(
              "pages.external_agents.description",
              "Connect external AI agents via API to expand your workflow capabilities."
            )}
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative group w-full sm:w-72">
            <Input
              type="text"
              placeholder={t("pages.external_agents.search_placeholder", "Search agents...")}
              className="h-12 pl-11 pr-4 bg-slate-50 dark:bg-primary/5 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-300 focus:bg-white dark:focus:bg-primary/10 focus:ring-slate-200 dark:focus:ring-primary/30 caret-slate-900 dark:caret-primary transition-all duration-300 rounded-xl w-full text-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute left-4 top-0 bottom-0 flex items-center text-slate-400 dark:text-slate-500 group-focus-within:text-primary transition-colors">
              <Search size={18} />
            </div>
          </div>
          <Button onClick={handleConnectAgent} className="h-10 px-4 w-full sm:w-auto font-medium">
            <Plus size={16} className="mr-1.5" />
            {t("pages.external_agents.connect_button", "Connect External Agent")}
          </Button>
        </div>
      </div>

      {/* Agent Cards Grid */}
      {filteredAgents.length > 0 && (
        <MotionDiv
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr"
        >
          {filteredAgents.map((agent) => (
            <MotionDiv key={agent.id} variants={item} className="h-full">
              <ExternalAgentCard agent={agent} />
            </MotionDiv>
          ))}
        </MotionDiv>
      )}

      {/* Empty State */}
      {filteredAgents.length === 0 && (
        <MotionDiv
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center px-8 py-16 text-center rounded-3xl bg-muted/30 border border-dashed border-border"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-card shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-border">
              <Link2 size={32} className="text-primary" />
            </div>
          </div>
          <h3 className="text-[22px] font-extrabold text-foreground mb-2 uppercase tracking-tight">
            {search
              ? t("pages.external_agents.no_matches", "No Matching Agents")
              : t("pages.external_agents.no_agents", "No External Agents")}
          </h3>
          <p className="text-[15px] text-muted-foreground max-w-sm mb-6 leading-relaxed">
            {search
              ? t(
                  "pages.external_agents.no_matches_description",
                  "No agents match your search. Try different keywords."
                )
              : t(
                  "pages.external_agents.no_agents_description",
                  "Connect your first external AI agent to start integrating third-party services into your workflows."
                )}
          </p>
          {!search && (
            <Button onClick={handleConnectAgent} className="h-10 px-5 font-medium">
              <Plus size={16} className="mr-1.5" />
              {t("pages.external_agents.connect_button", "Connect External Agent")}
            </Button>
          )}
        </MotionDiv>
      )}
    </div>
  );
};

const ExternalAgentsPageSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-96" />
          <Skeleton className="h-6 w-[500px]" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-12 w-72" />
          <Skeleton className="h-12 w-48" />
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
        {[...Array(LOADING_SKELETON_COUNT)].map((_, i) => (
          <Skeleton key={`loading-skeleton-${i}`} className="h-64 rounded-2xl" />
        ))}
      </div>
    </div>
  );
};
