import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import { useAgent, useAgentBySlug, useAgentsList } from "./getAgent";
import { convertToUIAgent } from "./type";

import type { AgentFilters, PaginationParams, UseAgentsOptions } from "./type";

// Hook for managing filters and pagination state
export const useAgentFilters = () => {
  const [filters, setFilters] = useState<AgentFilters>({});
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    page_size: 12,
  });

  const updateFilters = useCallback((newFilters: Partial<AgentFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when filters change
  }, []);

  const updatePagination = useCallback((newPagination: Partial<PaginationParams>) => {
    setPagination((prev) => ({ ...prev, ...newPagination }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
    setPagination({ page: 1, page_size: 12 });
  }, []);

  return {
    filters,
    pagination,
    updateFilters,
    updatePagination,
    resetFilters,
  };
};

// Hook for UI agents (converts API response to UI format)
export const useUIAgents = (filters?: AgentFilters, pagination?: PaginationParams) => {
  // Convert filters to the format expected by useAgentsList
  const options: UseAgentsOptions = {
    search: filters?.search,
    sourceType: filters?.source_type,
    agentType: filters?.agent_type,
    category: filters?.category,
    pricingType: filters?.pricing_type,
    tags: filters?.tags,
    page: pagination?.page,
    pageSize: pagination?.page_size,
  };

  const { data: response, isLoading, error, ...queryResult } = useAgentsList(options);

  const uiAgents = useMemo(() => {
    if (!response?.data) return [];

    return response.data.map(convertToUIAgent);
  }, [response?.data]);

  return {
    data: uiAgents,
    isLoading,
    error,
    pagination: response?.pagination,
    ...queryResult,
  };
};

// Categories hook that extracts unique categories from agents
export const useCategories = () => {
  const { data: response } = useAgentsList({ pageSize: 100 }); // Get more agents to extract all categories

  return useQuery({
    queryKey: ["newmarketplace-categories"],
    queryFn: () => {
      if (!response?.data) return [];

      // Extract unique categories from agents
      const categoriesMap = new Map();
      response.data.forEach((agent) => {
        if (agent.category) {
          categoriesMap.set(agent.category.id, agent.category);
        }
      });

      return Array.from(categoriesMap.values()).sort((a, b) => a.order - b.order);
    },
    enabled: !!response?.data,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Re-export the main hooks from getAgent
export { useAgent, useAgentBySlug, useAgentsList };
