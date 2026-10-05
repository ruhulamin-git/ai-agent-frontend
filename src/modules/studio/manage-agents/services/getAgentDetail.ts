import { useQuery } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

import type { UserAgent, UseUserAgentDetailOptions } from "../types";
import type { AxiosError } from "axios";

const GET_AGENT_DETAIL_URL = (id: string) => `/api/ai-agents/v1/user-created-agents/${id}/`;

const getAgentDetail = async (agentId: string): Promise<UserAgent> => {
  try {
    const response = await axios.get(GET_AGENT_DETAIL_URL(agentId));
    return toCamelCase(response.data?.data ?? response.data) as UserAgent;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

const useUserAgentDetail = ({ agentId, enabled, config }: UseUserAgentDetailOptions) => {
  return useQuery<UserAgent, AxiosError>({
    queryKey: ["user-agent-detail", agentId],
    queryFn: () => getAgentDetail(agentId),
    enabled: enabled ?? !!agentId,
    refetchOnMount: true,
    staleTime: 0,
    ...config,
  });
};

export { useUserAgentDetail };
