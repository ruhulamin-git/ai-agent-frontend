"use client";

import { useState } from "react";

import { Breadcrumb } from "@/shared/ui/breadcrumb";

import { AgentCard } from "./components/AgentCard";
import { EmptyState } from "./components/EmptyState";
import { FilterTabs } from "./components/FilterTabs";
import { Pagination } from "./components/Pagination";
import { useMyAgents, useMyAgentsStats } from "./service/hooks";

import type { MyAgentSubscription } from "./service/types";

export const MyAgent = () => {
  const breadcrumbItems = [{ label: "My Agents", isActive: true }];
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "pending" | "cancelled">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Fetch agents data
  const { data: agentsResponse, isLoading, error } = useMyAgents(currentPage, pageSize);
  const { data: stats, isLoading: statsLoading } = useMyAgentsStats(currentPage, pageSize);

  if (isLoading || statsLoading) {
    return (
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-900 dark:text-white">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600 dark:text-red-400">Error loading agents: {error.message}</div>
        </div>
      </div>
    );
  }

  const agents = agentsResponse?.data || [];
  const pagination = agentsResponse?.pagination;

  // Filter agents based on active filter
  const filteredAgents = agents.filter((agent) => {
    if (activeFilter === "all") return true;
    return agent.status === activeFilter;
  });

  return (
    <div className="flex-1 p-4 lg:p-6 overflow-y-auto scrollbar-thin">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Manage and monitor your AI agent subscriptions and performance
        </p>
      </div>



      {/* Filter Tabs */}
      <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} agents={agents} />

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredAgents.map((subscription: MyAgentSubscription) => (
          <AgentCard key={subscription.id} subscription={subscription} />
        ))}
      </div>

      {/* Empty State */}
      {filteredAgents.length === 0 && <EmptyState activeFilter={activeFilter} />}

      {/* Pagination */}
      {pagination && (
        <Pagination
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};
