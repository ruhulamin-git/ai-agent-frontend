import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase, toSnakeCase } from "@/utils";

import type { AgentPricingPlan, UpdatePricingPlanDTO } from "../agent-settings/types";
import type { MutationConfig } from "@/utils/reactQuery";
import type { AxiosError } from "axios";

const UPDATE_PRICING_PLAN_URL = (agentId: string, planId: number) =>
  `/api/marketplace/v1/agents/${agentId}/pricing-plans/${planId}/`;

interface UpdatePricingPlanParams {
  agentId: string;
  planId: number;
  payload: UpdatePricingPlanDTO;
}

const updatePricingPlan = async ({
  agentId,
  planId,
  payload,
}: UpdatePricingPlanParams): Promise<AgentPricingPlan> => {
  try {
    const response = await axios.put(
      UPDATE_PRICING_PLAN_URL(agentId, planId),
      toSnakeCase(payload)
    );
    return toCamelCase(response.data?.data ?? response.data) as AgentPricingPlan;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

type UpdatePricingPlanOptions = {
  config?: MutationConfig<typeof updatePricingPlan>;
};

const useUpdatePricingPlan = ({ config }: UpdatePricingPlanOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation<AgentPricingPlan, AxiosError, UpdatePricingPlanParams>({
    mutationFn: updatePricingPlan,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["agent-pricing-plans", variables.agentId],
      });
    },
    ...config,
  });
};

export { useUpdatePricingPlan };
export type { UpdatePricingPlanParams };
