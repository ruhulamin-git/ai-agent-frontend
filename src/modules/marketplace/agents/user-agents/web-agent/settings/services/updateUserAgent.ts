// Update user agent
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axios, handleApiError, toSnakeCase } from "@/utils";

import type { UpdateUserAgentPayload, UserAgent } from "../../../user-agents-list/types";

const USER_AGENT_URL = (id: string | number) => `/api/ai-agents/v1/user-agents/${id}/`;

const updateUserAgent = async (
  id: string | number,
  payload: UpdateUserAgentPayload
): Promise<UserAgent> => {
  try {
    const snakeCasePayload = toSnakeCase(payload as Record<string, unknown>);
    const response = await axios.put(USER_AGENT_URL(id), snakeCasePayload);
    return response.data;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

interface UpdateUserAgentMutationParams {
  id: string | number;
  payload: UpdateUserAgentPayload;
}

export const useUpdateUserAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateUserAgentMutationParams) => updateUserAgent(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user-agent", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["user-agents-list"] });
    },
  });
};
