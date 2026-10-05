import { useMutation } from "@tanstack/react-query";

import { axios, toCamelCase } from "@/utils";
import { handleApiError } from "@/utils/handleApiError";

import type { AxiosError } from "axios";

export interface AgentSubscribePayload {
  pricingPlanId: number;
}

export interface AgentSubscribeResponse {
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

const SUBSCRIBE_TO_AGENT_URL = (agentId: string) =>
  `/api/marketplace/v1/agents/${agentId}/subscribe/`;

interface SubscribeToAgentVars {
  agentId: string;
  data: AgentSubscribePayload;
}

const subscribeToAgent = async ({
  agentId,
  data,
}: SubscribeToAgentVars): Promise<AgentSubscribeResponse | null> => {
  try {
    const payload = {
      pricing_plan_id: data.pricingPlanId,
    };
    const response = await axios.post(SUBSCRIBE_TO_AGENT_URL(agentId), payload);
    return toCamelCase(response) as AgentSubscribeResponse;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

interface UseSubscribeToAgentOptions {
  config?: Omit<
    import("@tanstack/react-query").UseMutationOptions<
      AgentSubscribeResponse | null,
      AxiosError,
      SubscribeToAgentVars
    >,
    "mutationFn"
  >;
}

const useSubscribeToAgent = ({ config }: UseSubscribeToAgentOptions = {}) => {
  return useMutation({
    mutationFn: subscribeToAgent,
    ...config,
  });
};

export { useSubscribeToAgent };
