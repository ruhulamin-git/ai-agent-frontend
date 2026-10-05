import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

import { mapApiAgentToAgent } from "../../shared/utils/mapping";

import type { Agent } from "../../shared/types";
import type { ApiAgent } from "../../shared/utils/mapping";
import type { AxiosError } from "axios";

export interface AgentsApiResponse {
  data: ApiAgent[];
  pagination: {
    currentPage: number;
    numPages: number;
    pageSize: number;
    totalCount: number;
  };
}

const GET_AGENTS_URL = "/api/ai-agents/v1/agents/";

export interface GetPlatformAgentsParams {
  search?: string;
  agent_type?: string;
  publish_status?: string;
}

const getPlatformAgentsList = async (params: GetPlatformAgentsParams = {}): Promise<Agent[]> => {
  try {
    const response = await axios.get<AgentsApiResponse>(GET_AGENTS_URL, {
      params: { ...params, source_type: "internal" },
    });
    const data = toCamelCase(response);
    return (data.data || []).map(mapApiAgentToAgent);
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

export interface UsePlatformAgentsOptions {
  search?: string;
  agentType?: string;
  publishStatus?: string;
  enabled?: boolean;
  config?: Omit<
    import("@tanstack/react-query").UseQueryOptions<Agent[], AxiosError>,
    "queryKey" | "queryFn"
  >;
}

export const usePlatformAgentsList = ({
  search,
  agentType,
  publishStatus,
  enabled = true,
  config,
}: UsePlatformAgentsOptions = {}) => {
  return useQuery<Agent[], AxiosError>({
    queryKey: ["platform-agents-list", { search, agentType, publishStatus }],
    queryFn: () =>
      getPlatformAgentsList({
        search,
        agent_type: agentType === "All" ? undefined : agentType,
        publish_status: publishStatus === "All" ? undefined : publishStatus,
      }),
    placeholderData: keepPreviousData,
    enabled,
    ...config,
  });
};
