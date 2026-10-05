import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

import { mapApiAgentToAgent } from "../../shared/utils/mapping";

import type { Agent } from "../../shared/types";
import type { ApiAgent } from "../../shared/utils/mapping";
import type { AxiosError } from "axios";

export interface CommunityAgentsPagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CommunityAgentsApiResponse {
  message: string;
  data: ApiAgent[];
  pagination: CommunityAgentsPagination;
}

export interface CommunityAgentsResult {
  agents: Agent[];
  pagination: CommunityAgentsPagination;
}

const GET_COMMUNITY_AGENTS_URL = "/api/marketplace/v1/agents/";

export interface GetCommunityAgentsParams {
  search?: string;
  page?: number;
  page_size?: number;
  source_type?: string;
}

const getCommunityAgentsList = async (
  params: GetCommunityAgentsParams = {}
): Promise<CommunityAgentsResult> => {
  try {
    const response = await axios.get<CommunityAgentsApiResponse>(GET_COMMUNITY_AGENTS_URL, {
      params: {
        ...params,
        source_type: "user_created",
      },
    });
    const data = toCamelCase(response);
    return {
      agents: (data.data || []).map(mapApiAgentToAgent),
      pagination: data.pagination ?? { total: 0, page: 1, pageSize: 12, totalPages: 1 },
    };
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

export interface UseCommunityAgentsOptions {
  search?: string;
  page?: number;
  pageSize?: number;
  enabled?: boolean;
  config?: Omit<
    import("@tanstack/react-query").UseQueryOptions<CommunityAgentsResult, AxiosError>,
    "queryKey" | "queryFn"
  >;
}

export const useCommunityAgentsList = ({
  search,
  page = 1,
  pageSize = 12,
  enabled = true,
  config,
}: UseCommunityAgentsOptions = {}) => {
  return useQuery<CommunityAgentsResult, AxiosError>({
    queryKey: ["community-agents-list", { search, page, pageSize }],
    queryFn: () =>
      getCommunityAgentsList({
        search: search || undefined,
        page,
        page_size: pageSize,
      }),
    placeholderData: keepPreviousData,
    enabled,
    ...config,
  });
};
