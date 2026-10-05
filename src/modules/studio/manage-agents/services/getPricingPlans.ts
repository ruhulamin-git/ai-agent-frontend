import { useQuery } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

import type { AgentPricingPlan } from "../agent-settings/types";
import type { AxiosError } from "axios";

const GET_PRICING_PLANS_URL = (agentId: string) =>
  `/api/marketplace/v1/agents/${agentId}/pricing-plans/`;

const getPricingPlans = async (agentId: string): Promise<AgentPricingPlan[]> => {
  try {
    const response = await axios.get(GET_PRICING_PLANS_URL(agentId));
    const raw = response.data?.data ?? response.data;
    return (Array.isArray(raw) ? raw : []).map(
      (item: Record<string, unknown>) => toCamelCase(item) as AgentPricingPlan
    );
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

interface UseGetPricingPlansOptions {
  agentId: string;
  enabled?: boolean;
  config?: Omit<
    import("@tanstack/react-query").UseQueryOptions<AgentPricingPlan[], AxiosError>,
    "queryKey" | "queryFn"
  >;
}

const useGetPricingPlans = ({ agentId, enabled, config }: UseGetPricingPlansOptions) => {
  return useQuery<AgentPricingPlan[], AxiosError>({
    queryKey: ["agent-pricing-plans", agentId],
    queryFn: () => getPricingPlans(agentId),
    enabled: enabled ?? !!agentId,
    ...config,
  });
};

export { useGetPricingPlans };
