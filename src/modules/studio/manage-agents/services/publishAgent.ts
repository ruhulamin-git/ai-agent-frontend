import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

import type { PublishAgentResponse } from "../agent-settings/types";
import type { MutationConfig } from "@/utils/reactQuery";
import type { AxiosError } from "axios";

const PUBLISH_AGENT_URL = (id: string) => `/api/ai-agents/v1/user-created-agents/${id}/publish/`;

const publishAgent = async (agentId: string): Promise<PublishAgentResponse> => {
  try {
    const response = await axios.post(PUBLISH_AGENT_URL(agentId));
    return toCamelCase(response.data) as PublishAgentResponse;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

type PublishAgentOptions = {
  config?: MutationConfig<typeof publishAgent>;
};

const usePublishAgent = ({ config }: PublishAgentOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation<PublishAgentResponse, AxiosError, string>({
    mutationFn: publishAgent,
    onSuccess: (_data, agentId) => {
      queryClient.invalidateQueries({ queryKey: ["user-agent-detail", agentId] });
      queryClient.invalidateQueries({ queryKey: ["user-created-agents-list"] });
    },
    ...config,
  });
};

export { usePublishAgent };
