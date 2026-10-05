"use client";

import Link from "next/link";
import { useState } from "react";

import { Breadcrumb } from "@/shared/ui/breadcrumb";

import { AgentCard } from "./components/AgentCard";
import { EmptyState } from "./components/EmptyState";
import { FilterTabs } from "./components/FilterTabs";
import { useUserAgentList } from "./service/hooks";

export const DeveloperAgents = () => {
  const breadcrumbItems = [{ label: "Agent Library", isActive: true }];
  const [activeFilter, setActiveFilter] = useState<"all" | "published" | "draft">("all");
  const searchQuery = "";

  // Fetch agents from API
  const { data: agents = [], isLoading } = useUserAgentList({ search: searchQuery });

  const filteredAgents = agents.filter((agent) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "published") return agent.publishStatus === "published";
    if (activeFilter === "draft") return agent.publishStatus === "draft";
    return true;
  });

  const stats = {
    total: agents.length,
    published: agents.filter((a) => a.publishStatus === "published").length,
    draft: agents.filter((a) => a.publishStatus === "draft").length,
  };

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

  if (isLoading) {
    return (
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto scrollbar-thin">
        <div className="mb-8">
          <Breadcrumb items={breadcrumbItems} className="mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Create, manage, and monetize your AI agents</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-full h-[320px] rounded-xl border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-gray-900/50 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-6 overflow-y-auto scrollbar-thin">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Create, manage, and monetize your AI agents</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-6">
        <FilterTabs activeFilter={activeFilter} setActiveFilter={setActiveFilter} stats={stats} />

        <Link href="/ai-builder/chatflows">
          <button className="px-4 py-2 text-sm font-medium rounded border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            + Create Agent
          </button>
        </Link>
      </div>

      {/* Agents Grid */}
      {filteredAgents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} formatTimeAgo={formatTimeAgo} />
          ))}
        </div>
      ) : (
        <EmptyState activeFilter={activeFilter} />
      )}
    </div>
  );
};
