import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase, toSnakeCase } from "@/utils";

import type { AgentPricingPlan, CreatePricingPlanDTO } from "../agent-settings/types";
import type { MutationConfig } from "@/utils/reactQuery";
import type { AxiosError } from "axios";

const CREATE_PRICING_PLAN_URL = (agentId: string) =>
  `/api/marketplace/v1/agents/${agentId}/pricing-plans/`;

interface CreatePricingPlanParams {
  agentId: string;
  payload: CreatePricingPlanDTO;
}

const createPricingPlan = async ({
  agentId,
  payload,
}: CreatePricingPlanParams): Promise<AgentPricingPlan> => {
  try {
    const response = await axios.post(CREATE_PRICING_PLAN_URL(agentId), toSnakeCase(payload));
    return toCamelCase(response.data?.data ?? response.data) as AgentPricingPlan;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

type CreatePricingPlanOptions = {
  config?: MutationConfig<typeof createPricingPlan>;
};

const useCreatePricingPlan = ({ config }: CreatePricingPlanOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation<AgentPricingPlan, AxiosError, CreatePricingPlanParams>({
    mutationFn: createPricingPlan,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["agent-pricing-plans", variables.agentId],
      });
    },
    ...config,
  });
};

export { useCreatePricingPlan };
export type { CreatePricingPlanParams };
