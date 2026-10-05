import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

import type { PublishAgentResponse } from "../agent-settings/types";
import type { MutationConfig } from "@/utils/reactQuery";
import type { AxiosError } from "axios";

const UNPUBLISH_AGENT_URL = (id: string) => `/api/ai-agents/v1/user-created-agents/${id}/publish/`;

const unpublishAgent = async (agentId: string): Promise<PublishAgentResponse> => {
  try {
    const response = await axios.delete(UNPUBLISH_AGENT_URL(agentId));
    return toCamelCase(response.data) as PublishAgentResponse;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

type UnpublishAgentOptions = {
  config?: MutationConfig<typeof unpublishAgent>;
};

const useUnpublishAgent = ({ config }: UnpublishAgentOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation<PublishAgentResponse, AxiosError, string>({
    mutationFn: unpublishAgent,
    onSuccess: (_data, agentId) => {
      queryClient.invalidateQueries({ queryKey: ["user-agent-detail", agentId] });
      queryClient.invalidateQueries({ queryKey: ["user-created-agents-list"] });
    },
    ...config,
  });
};

export { useUnpublishAgent };
