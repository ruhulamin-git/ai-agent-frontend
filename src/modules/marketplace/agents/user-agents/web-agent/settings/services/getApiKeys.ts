// Get API keys for a user agent
import { useQuery } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

import type { ApiKey, ApiKeyListResponse } from "../types";
import type { AxiosError } from "axios";

const API_KEYS_URL = (agentId: string | number) =>
  `/api/ai-agents/v1/user-agents/${agentId}/api-keys/`;

const getApiKeys = async (agentId: string | number): Promise<ApiKey[]> => {
  try {
    const response = await axios.get<ApiKeyListResponse>(API_KEYS_URL(agentId));
    const data = toCamelCase(response);
    const keys = data?.data ?? data;

    if (Array.isArray(keys)) return keys;
    // API may return a single object — normalise to array
    if (keys && typeof keys === "object" && "id" in keys) return [keys as ApiKey];
    return [];
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

interface UseApiKeysOptions {
  agentId: string | number;
  enabled?: boolean;
}

export const useApiKeys = ({ agentId, enabled = true }: UseApiKeysOptions) => {
  return useQuery<ApiKey[], AxiosError>({
    queryKey: ["api-keys", agentId],
    queryFn: () => getApiKeys(agentId),
    enabled: enabled && !!agentId,
  });
};
