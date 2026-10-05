import { useMutation } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

import type { UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const SUBSCRIBE_TO_EXTERNAL_AGENT_URL = (agentId: string | number) =>
  `/api/marketplace/v1/agents/${agentId}/subscribe/`;

export interface SubscribeToExternalAgentRequest {
  pricingPlanId: number;
}

export interface SubscribeToExternalAgentResponse {
  message: string;
  data: {
    checkoutSessionId?: string | null;
    checkoutUrl?: string | null;
    purchase: {
      id: number;
      status: string;
      agent: string;
      plan: string;
    };
    invoice?: {
      id: number;
      invoiceNumber: string;
      status: string;
      totalAmount: string;
    };
  };
}

const subscribeToExternalAgent = async (
  agentId: string | number,
  data: SubscribeToExternalAgentRequest
): Promise<SubscribeToExternalAgentResponse> => {
  try {
    const payload = {
      pricing_plan_id: data.pricingPlanId,
    };
    const response = await axios.post(SUBSCRIBE_TO_EXTERNAL_AGENT_URL(agentId), payload);
    return toCamelCase(response) as SubscribeToExternalAgentResponse;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

export interface UseSubscribeToExternalAgentOptions {
  config?: UseMutationOptions<
    SubscribeToExternalAgentResponse,
    AxiosError,
    { agentId: string | number; data: SubscribeToExternalAgentRequest }
  >;
}

export const useSubscribeToExternalAgent = ({
  config,
}: UseSubscribeToExternalAgentOptions = {}) => {
  return useMutation({
    mutationFn: ({
      agentId,
      data,
    }: {
      agentId: string | number;
      data: SubscribeToExternalAgentRequest;
    }) => subscribeToExternalAgent(agentId, data),
    ...config,
  });
};
