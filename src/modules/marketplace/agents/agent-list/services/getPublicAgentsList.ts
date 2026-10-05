import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

import { mapApiAgentToAgent } from "../../shared/utils/mapping";

import type { Agent } from "../../shared/types";
import type { AgentsApiResponse, UseAgentsOptions } from "./types";
import type { AxiosError } from "axios";

const PUBLIC_AGENTS_URL = "/api/marketplace/v1/agents/public";

const getPublicAgentsList = async (
  params: {
    search?: string;
    source_type?: string;
    agent_type?: string;
    publish_status?: string;
  } = {}
): Promise<Agent[]> => {
  try {
    const response = await axios.get<AgentsApiResponse>(PUBLIC_AGENTS_URL, { params });
    const data = toCamelCase(response);
    return (data.data || []).map(mapApiAgentToAgent);
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

export const usePublicAgentsList = ({
  search,
  category,
  agentType,
  publishStatus,
  enabled = true,
  config,
}: UseAgentsOptions = {}) => {
  return useQuery<Agent[], AxiosError>({
    queryKey: ["agents-list", "public", { search, category, agentType, publishStatus }],
    queryFn: () =>
      getPublicAgentsList({
        search,
        source_type: category === "All" ? undefined : category,
        agent_type: agentType === "All" ? undefined : agentType,
        publish_status: publishStatus === "All" ? undefined : publishStatus,
      }),
    placeholderData: keepPreviousData,
    enabled,
    ...config,
  });
};
