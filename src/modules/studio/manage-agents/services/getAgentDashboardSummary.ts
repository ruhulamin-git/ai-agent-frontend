import { useQuery } from "@tanstack/react-query";

import { toCamelCase } from "@/utils";
import { axios } from "@/utils/axios";

export interface AgentDashboardSummary {
  averageRating: string;
  totalReviews: number;
  totalSales: number;
  currentTotalSubscribers: number;
  totalMoneyEarned: string;
  monthlyRevenue: string;
  lifetimeRevenue: string;
}

export const getAgentDashboardSummary = async (
  agentId: string | number
): Promise<AgentDashboardSummary> => {
  try {
    console.log("Fetching agent dashboard summary for agentId:", agentId);

    const response = await axios.get(`/api/dashboard/v1/agents/${agentId}/summary/`);

    console.log("Raw API Response:", response.data);

    // Handle different possible response structures
    let responseData;
    if (response.data?.data) {
      // Nested structure: { message: "...", data: { ... } }
      responseData = response.data.data;
    } else if (response.data) {
      // Direct structure: { averageRating, totalReviews, ... }
      responseData = response.data;
    } else {
      // Fallback to default values
      responseData = null;
    }

    if (!responseData) {
      return {
        averageRating: "0.00",
        totalReviews: 0,
        totalSales: 0,
        currentTotalSubscribers: 0,
        totalMoneyEarned: "0.00",
        monthlyRevenue: "0.00",
        lifetimeRevenue: "0.00",
      };
    }

    const result = toCamelCase(responseData) as AgentDashboardSummary;

    console.log("Processed Result:", result);

    return result;
  } catch (error) {
    console.error("Error fetching agent dashboard summary:", error);
    return {
      averageRating: "0.00",
      totalReviews: 0,
      totalSales: 0,
      currentTotalSubscribers: 0,
      totalMoneyEarned: "0.00",
      monthlyRevenue: "0.00",
      lifetimeRevenue: "0.00",
    };
  }
};

export const useAgentDashboardSummary = (agentId: string | number) => {
  return useQuery({
    queryKey: ["agent-dashboard-summary", agentId],
    queryFn: () => getAgentDashboardSummary(agentId),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!agentId, // Only run query if agentId is provided
  });
};
