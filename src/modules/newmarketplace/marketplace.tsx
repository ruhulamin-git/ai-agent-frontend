"use client";

import { useMemo, useState } from "react";

import { SectionContainer } from "@/shared/components";

import { AgentCard } from "./components/AgentCard";
import { FilterSidebar } from "./components/FilterSidebar";
import { SearchBar } from "./components/SearchBar";
import { TabNavigation } from "./components/TabNavigation";
import { useAgent, useAgentFilters, useCategories, useUIAgents } from "./service/hooks";
import { AgentDetails } from "./agent-details";

import type { UIAgent } from "./service/type";

const AgentDetailsWrapper = ({ agent, onBack }: { agent: UIAgent; onBack: () => void }) => {
  const { data: fullAgent, isLoading } = useAgent(agent.id);

  if (isLoading) {
    return (
      <SectionContainer>
        <div className="pt-10 pb-20 flex justify-center items-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </SectionContainer>
    );
  }

  return <AgentDetails agent={agent} originalAgent={fullAgent || (agent as any).originalAgent} onBack={onBack} />;
};

export const Marketplace = () => {
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "official" | "community" | "external">("all");
  const [selectedAgent, setSelectedAgent] = useState<UIAgent | null>(null);

  // Use the custom hooks for filters and data fetching
  const { filters, pagination, updateFilters, updatePagination } = useAgentFilters();
  const { data: categories } = useCategories();

  // Combine search with filters and tab-based source_type filtering
  const combinedFilters = useMemo(() => {
    const baseFilters = {
      ...filters,
      search: searchValue || undefined,
    };

    // Map tab to source_type filter
    if (activeTab === "official") {
      baseFilters.source_type = "internal";
    } else if (activeTab === "community") {
      baseFilters.source_type = "user_created";
    } else if (activeTab === "external") {
      baseFilters.source_type = "external";
    }
    // For "all" tab, don't set source_type filter

    return baseFilters;
  }, [filters, searchValue, activeTab]);

  // Fetch agents with real API
  const {
    data: agents = [],
    isLoading,
    error,
    pagination: paginationInfo,
  } = useUIAgents(combinedFilters, pagination);

  // Filter agents based on search and other filters (client-side filtering for additional refinement)
  const filteredAgents = useMemo(() => {
    if (!agents) return [];

    return agents.filter((agent: UIAgent) => {
      const matchesSearch =
        searchValue === "" ||
        agent.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchValue.toLowerCase()) ||
        agent.capabilities.some((cap: string) =>
          cap.toLowerCase().includes(searchValue.toLowerCase())
        );

      // Category filtering is now handled by the backend via agent_type filter
      return matchesSearch;
    });
  }, [agents, searchValue]);

  // If an agent is selected, show the details page
  if (selectedAgent) {
    return <AgentDetailsWrapper agent={selectedAgent} onBack={() => setSelectedAgent(null)} />;
  }

  return (
    <SectionContainer>
      {/* Header */}
      <div className="py-10">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">AI Marketplace</h1>
          <p className="text-lg text-gray-400">
            Browse intelligent AI agents for automation, analytics, content creation, and more.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-20 grid grid-cols-1 lg:grid-cols-12 lg:gap-10 space-y-10">
        {/* Sidebar */}
        <div className="w-full col-span-12 lg:col-span-3">
          <div className="sticky top-40">
            <FilterSidebar
              filters={{
                tab: "all",
                pricing: filters.pricing_type || "all",
                category: filters.category || "",
                search: searchValue,
              }}
              onFiltersChange={(newFilters) => {
                if (newFilters.pricing !== undefined) {
                  const pricingMap = {
                    all: undefined,
                    free: "free" as const,
                    freemium: "freemium" as const,
                    premium: "premium" as const,
                  };
                  updateFilters({ pricing_type: pricingMap[newFilters.pricing] });
                }
                if (newFilters.category !== undefined) {
                  updateFilters({ category: newFilters.category || undefined });
                }
              }}
              categories={categories || []}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-span-12 lg:col-span-9">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="w-full sm:w-96">
              <SearchBar
                value={searchValue}
                onChange={setSearchValue}
                placeholder="Search agents..."
              />
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-800/50 rounded-xl h-80" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center pt-20">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg text-white mb-5">Failed to Load Agents</h3>
              <p className="text-gray-400 mb-4">
                There was an error loading the agents. Please try again.
              </p>
            </div>
          )}

          {/* agent Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAgents.map((agent: UIAgent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onInstall={() => console.log(`Installing ${agent.name}`)}
                  onViewDetails={(agent) => setSelectedAgent(agent)}
                />
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && !error && filteredAgents.length === 0 && (
            <div className="text-center pt-20">
              <div className="text-4xl mb-5">🔍</div>
              <h3 className="text-lg text-white mb-5">No Agents Found!</h3>
            </div>
          )}

          {/* Pagination */}
          {paginationInfo && paginationInfo.num_pages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => updatePagination({ page: Math.max(1, pagination.page! - 1) })}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50"
              >
                Previous
              </button>

              <span className="px-4 py-2 text-gray-400">
                Page {paginationInfo.current_page} of {paginationInfo.num_pages}
              </span>

              <button
                onClick={() =>
                  updatePagination({
                    page: Math.min(paginationInfo.num_pages, pagination.page! + 1),
                  })
                }
                disabled={pagination.page === paginationInfo.num_pages}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </SectionContainer>
  );
};
