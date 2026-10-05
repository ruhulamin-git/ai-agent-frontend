import { useQuery } from "@tanstack/react-query";

import { getMyAgentById, getMyAgents } from "./getMyAgent";

import type { MyAgentsResponse, MyAgentsStats, MyAgentSubscription } from "./types";
import type { UseQueryResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";

// Hook to fetch all my agents with pagination
export const useMyAgents = (
  page = 1,
  pageSize = 12
): UseQueryResult<MyAgentsResponse, AxiosError> => {
  return useQuery({
    queryKey: ["myAgents", page, pageSize],
    queryFn: () => getMyAgents({ page, page_size: pageSize }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to fetch a specific agent by ID
export const useMyAgent = (id: number): UseQueryResult<MyAgentSubscription | null, AxiosError> => {
  return useQuery({
    queryKey: ["myAgent", id],
    queryFn: () => getMyAgentById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook to calculate stats from my agents data
export const useMyAgentsStats = (
  page = 1,
  pageSize = 12
): UseQueryResult<MyAgentsStats, AxiosError> => {
  return useQuery({
    queryKey: ["myAgentsStats", page, pageSize],
    queryFn: async () => {
      const response = await getMyAgents({ page, page_size: pageSize });
      const agents = response.data;

      const stats: MyAgentsStats = {
        totalSubscriptions: response.pagination.total_count,
        activeSubscriptions: agents.filter(
          (agent: MyAgentSubscription) => agent.status === "active"
        ).length,
        pendingSubscriptions: agents.filter(
          (agent: MyAgentSubscription) => agent.status === "pending"
        ).length,
        cancelledSubscriptions: agents.filter(
          (agent: MyAgentSubscription) => agent.status === "cancelled"
        ).length,
        monthlySpend: agents
          .filter(
            (agent: MyAgentSubscription) =>
              agent.status === "active" && agent.pricing_plan.pricing_type === "monthly"
          )
          .reduce(
            (sum: number, agent: MyAgentSubscription) => sum + parseFloat(agent.pricing_plan.price),
            0
          ),
      };

      return stats;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook to get filtered agents by status
export const useFilteredMyAgents = (
  status: "all" | "active" | "pending" | "cancelled" | "expired" = "all",
  page = 1,
  pageSize = 12
): UseQueryResult<MyAgentSubscription[], AxiosError> => {
  return useQuery({
    queryKey: ["filteredMyAgents", status, page, pageSize],
    queryFn: async () => {
      const response = await getMyAgents({ page, page_size: pageSize });
      const agents = response.data;

      if (status === "all") {
        return agents;
      }

      return agents.filter((agent: MyAgentSubscription) => agent.status === status);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
