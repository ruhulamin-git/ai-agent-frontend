import { useQuery } from "@tanstack/react-query";

import { toCamelCase } from "@/utils";
import { axios } from "@/utils/axios";

export interface AgentRevenueOverview {
  mode: "monthly" | "yearly";
  year: number;
  month: number | null;
  week: number | null;
  labels: string[];
  values: string[];
}

export const getAgentRevenueOverview = async (
  agentId: string | number,
  params: {
    mode: "monthly" | "yearly";
    year?: number;
    month?: number;
  }
): Promise<AgentRevenueOverview> => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append("mode", params.mode);
    if (params.year) searchParams.append("year", params.year.toString());
    if (params.month) searchParams.append("month", params.month.toString());

    const response = await axios.get(
      `/api/dashboard/v1/agents/${agentId}/revenue-overview/?${searchParams.toString()}`
    );

    console.log("Agent Revenue Overview API Response:", response);

    // Handle different possible response structures
    let responseData;
    if (response.data?.data) {
      // Nested structure: { message: "...", data: { mode, year, labels, values } }
      responseData = response.data.data;
    } else if (response.data?.labels && response.data?.values) {
      // Direct structure: { mode, year, labels, values }
      responseData = response.data;
    } else {
      // Fallback: create default structure
      responseData = {
        mode: params.mode,
        year: params.year || new Date().getFullYear(),
        month: params.month || null,
        week: null,
        labels: [],
        values: [],
      };
    }

    const result = toCamelCase(responseData) as AgentRevenueOverview;

    // Ensure we always return a valid structure
    if (!result?.labels || !result.values) {
      return {
        mode: params.mode,
        year: params.year || new Date().getFullYear(),
        month: params.month || null,
        week: null,
        labels: [],
        values: [],
      };
    }

    return result;
  } catch (error) {
    console.error("API Error for agent revenue-overview:", error);
    // Return empty data structure on error so the component can handle it
    return {
      mode: params.mode,
      year: params.year || new Date().getFullYear(),
      month: params.month || null,
      week: null,
      labels: [],
      values: [],
    };
  }
};

export const useAgentRevenueOverview = (
  agentId: string | number,
  params: {
    mode: "monthly" | "yearly";
    year?: number;
    month?: number;
  }
) => {
  return useQuery({
    queryKey: ["agent-revenue-overview", agentId, params],
    queryFn: () => getAgentRevenueOverview(agentId, params),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!agentId,
    // Ensure we always have a valid response
    select: (data) => {
      if (!data) {
        return {
          mode: params.mode,
          year: params.year || new Date().getFullYear(),
          month: params.month || null,
          week: null,
          labels: [],
          values: [],
        };
      }
      return data;
    },
  });
};
