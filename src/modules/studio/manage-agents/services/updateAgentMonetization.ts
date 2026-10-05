import { useMutation } from "@tanstack/react-query";

import type { AgentPlan } from "../agent-settings/types";
import type { MutationConfig } from "@/utils/reactQuery";
import type { AxiosError } from "axios";

export interface UpdateMonetizationDTO {
  subscriptionModel: string;
  plans?: AgentPlan[];
}

interface UpdateAgentMonetizationParams {
  agentId: string;
  payload: UpdateMonetizationDTO;
}

const updateAgentMonetization = async ({
  agentId,
  payload,
}: UpdateAgentMonetizationParams): Promise<void> => {
  console.log(`[MOCK API] Updating monetization for agent ${agentId}`, payload);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 800);
  });
};

type UpdateAgentMonetizationOptions = {
  config?: MutationConfig<typeof updateAgentMonetization>;
};

const useUpdateAgentMonetization = ({ config }: UpdateAgentMonetizationOptions = {}) => {
  return useMutation<void, AxiosError, UpdateAgentMonetizationParams>({
    mutationFn: updateAgentMonetization,
    ...config,
  });
};

export { useUpdateAgentMonetization };
