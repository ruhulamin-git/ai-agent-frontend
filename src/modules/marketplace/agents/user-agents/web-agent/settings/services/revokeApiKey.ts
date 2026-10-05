import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axios, handleApiError } from "@/utils";

const REVOKE_API_KEY_URL = (agentId: string | number, apiKeyId: string) =>
  `/api/ai-agents/v1/user-agents/${agentId}/api-keys/${apiKeyId}/`;

const revokeApiKey = async (agentId: string | number, apiKeyId: string): Promise<void> => {
  try {
    await axios.delete(REVOKE_API_KEY_URL(agentId, apiKeyId));
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

interface RevokeApiKeyMutationParams {
  agentId: string | number;
  apiKeyId: string;
}

export const useRevokeApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ agentId, apiKeyId }: RevokeApiKeyMutationParams) =>
      revokeApiKey(agentId, apiKeyId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["api-keys", variables.agentId] });
    },
  });
};
