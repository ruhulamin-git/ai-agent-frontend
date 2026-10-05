// Create a new API key for a user agent
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase, toSnakeCase } from "@/utils";

import type { CreateApiKeyDTO, CreatedApiKey } from "../types";

const API_KEYS_URL = (agentId: string | number) =>
  `/api/ai-agents/v1/user-agents/${agentId}/api-keys/`;

const createApiKey = async (
  agentId: string | number,
  data: CreateApiKeyDTO
): Promise<CreatedApiKey> => {
  try {
    const payload = toSnakeCase({ ...data });
    const response = await axios.post(API_KEYS_URL(agentId), payload);
    const result = toCamelCase(response);
    return result.data || result;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

interface CreateApiKeyMutationParams {
  agentId: string | number;
  data: CreateApiKeyDTO;
}

export const useCreateApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ agentId, data }: CreateApiKeyMutationParams) => createApiKey(agentId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["api-keys", variables.agentId] });
    },
  });
};
