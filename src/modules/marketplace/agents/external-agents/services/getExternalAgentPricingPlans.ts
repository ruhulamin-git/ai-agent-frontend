import { useQuery } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

import type { AgentPricingPlan } from "../../shared/types";
import type { UseQueryResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const GET_EXTERNAL_AGENT_PRICING_PLANS_URL = (id: string | number) =>
  `/api/marketplace/v1/agents/${id}/pricing-plans/`;

export interface ExternalAgentPricingPlansResponse {
  message: string;
  data: AgentPricingPlan[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

const getExternalAgentPricingPlans = async (id: string | number): Promise<AgentPricingPlan[]> => {
  try {
    const response = await axios.get(GET_EXTERNAL_AGENT_PRICING_PLANS_URL(id));
    const data = toCamelCase(response) as ExternalAgentPricingPlansResponse;
    return data.data || [];
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

export interface UseExternalAgentPricingPlansOptions {
  id: string | number;
  enabled?: boolean;
}

export const useExternalAgentPricingPlans = ({
  id,
  enabled = true,
}: UseExternalAgentPricingPlansOptions): UseQueryResult<AgentPricingPlan[], AxiosError> => {
  return useQuery({
    queryKey: ["external-agent-pricing-plans", id],
    queryFn: () => getExternalAgentPricingPlans(id),
    enabled: enabled && !!id,
  });
};
