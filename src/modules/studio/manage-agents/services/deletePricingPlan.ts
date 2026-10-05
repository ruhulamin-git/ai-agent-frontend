import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axios, handleApiError } from "@/utils";

import type { MutationConfig } from "@/utils/reactQuery";
import type { AxiosError } from "axios";

const DELETE_PRICING_PLAN_URL = (agentId: string, planId: number) =>
  `/api/marketplace/v1/agents/${agentId}/pricing-plans/${planId}/`;

interface DeletePricingPlanParams {
  agentId: string;
  planId: number;
}

const deletePricingPlan = async ({ agentId, planId }: DeletePricingPlanParams): Promise<void> => {
  try {
    await axios.delete(DELETE_PRICING_PLAN_URL(agentId, planId));
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

type DeletePricingPlanOptions = {
  config?: MutationConfig<typeof deletePricingPlan>;
};

const useDeletePricingPlan = ({ config }: DeletePricingPlanOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, DeletePricingPlanParams>({
    mutationFn: deletePricingPlan,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["agent-pricing-plans", variables.agentId],
      });
    },
    ...config,
  });
};

export { useDeletePricingPlan };
export type { DeletePricingPlanParams };
