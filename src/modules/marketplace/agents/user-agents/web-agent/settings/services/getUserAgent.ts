// Get single user agent details
import { useQuery } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

import type { UserAgent } from "../../../user-agents-list/types";

const USER_AGENT_URL = (id: string | number) => `/api/ai-agents/v1/user-agents/${id}/`;

const getUserAgent = async (id: string | number): Promise<UserAgent> => {
  try {
    const response = await axios.get(USER_AGENT_URL(id));
    const data = toCamelCase(response);
    return data.data || data;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

interface UseUserAgentOptions {
  agentId: string | number;
  enabled?: boolean;
}

export const useUserAgentDetails = ({ agentId, enabled = true }: UseUserAgentOptions) => {
  return useQuery({
    queryKey: ["user-agent", agentId],
    queryFn: () => getUserAgent(agentId),
    enabled: enabled && !!agentId,
  });
};
