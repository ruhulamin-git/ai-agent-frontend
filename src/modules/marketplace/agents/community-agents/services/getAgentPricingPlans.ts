import { useQuery } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

import type { AgentPricingPlan } from "../../shared/types";
import type { UseQueryResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const GET_AGENT_PRICING_PLANS_URL = (id: string | number) =>
  `/api/marketplace/v1/agents/${id}/pricing-plans/`;

export interface AgentPricingPlansResponse {
  message: string;
  data: AgentPricingPlan[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

const getAgentPricingPlans = async (id: string | number): Promise<AgentPricingPlan[]> => {
  try {
    const response = await axios.get(GET_AGENT_PRICING_PLANS_URL(id));
    const data = toCamelCase(response) as AgentPricingPlansResponse;
    return data.data || [];
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

export interface UseAgentPricingPlansOptions {
  id: string | number;
  enabled?: boolean;
}

export const useAgentPricingPlans = ({
  id,
  enabled = true,
}: UseAgentPricingPlansOptions): UseQueryResult<AgentPricingPlan[], AxiosError> => {
  return useQuery({
    queryKey: ["agent-pricing-plans", id],
    queryFn: () => getAgentPricingPlans(id),
    enabled: enabled && !!id,
  });
};
