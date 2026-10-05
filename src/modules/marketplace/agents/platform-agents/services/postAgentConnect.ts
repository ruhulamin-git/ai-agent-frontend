import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axios, handleApiError } from "@/utils";

import type { AxiosError } from "axios";

// Define the payload interface based on user requirements
export interface AgentConnectPayload {
  name: string;
  business_context: string;
  instructions: string;
  agent: number;
  integration_ids: number[];
  settings: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

// Define the response interface (assuming it returns the created agent or similar)
// Adjust this based on actual API response if known, for now using any or a generic type
export interface AgentConnectResponse {
  id: string | number;
  // Add other fields if needed
}

const POST_AGENT_CONNECT_URL = "/api/ai-agents/v1/user-agents/";

const postAgentConnect = async (payload: AgentConnectPayload): Promise<AgentConnectResponse> => {
  try {
    const response = await axios.post(POST_AGENT_CONNECT_URL, payload);
    return response.data;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

export const usePostAgentConnect = (options?: {
  onSuccess?: (
    data: AgentConnectResponse,
    variables: AgentConnectPayload,
    context: unknown
  ) => void;
  onError?: (error: AxiosError, variables: AgentConnectPayload, context: unknown) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<AgentConnectResponse, AxiosError, AgentConnectPayload>({
    mutationFn: postAgentConnect,
    ...options,
    onSuccess: async (data, variables, context) => {
      queryClient.removeQueries({ queryKey: ["user-agents-list"] });
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
  });
};
