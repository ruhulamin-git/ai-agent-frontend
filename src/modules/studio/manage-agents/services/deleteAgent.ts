import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axios, handleApiError } from "@/utils";

import type { MutationConfig } from "@/utils/reactQuery";
import type { AxiosError } from "axios";

const DELETE_AGENT_URL = (id: string) => `/api/ai-agents/v1/user-created-agents/${id}/`;

const deleteAgent = async (agentId: string): Promise<void> => {
  try {
    await axios.delete(DELETE_AGENT_URL(agentId));
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

type DeleteAgentOptions = {
  config?: MutationConfig<typeof deleteAgent>;
};

const useDeleteAgent = ({ config }: DeleteAgentOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: deleteAgent,
    onSuccess: (_data, agentId) => {
      // Remove the deleted agent's detail cache immediately
      queryClient.removeQueries({ queryKey: ["user-agent-detail", agentId] });
      // Refetch the list so the deleted agent disappears
      queryClient.invalidateQueries({ queryKey: ["user-created-agents-list"] });
    },
    ...config,
  });
};

export { useDeleteAgent };
