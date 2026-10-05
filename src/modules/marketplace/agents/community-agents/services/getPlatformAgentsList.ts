import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

import { mapApiAgentToAgent } from "../../shared/utils/mapping";

import type { Agent } from "../../shared/types";
import type { ApiAgent } from "../../shared/utils/mapping";
import type { AxiosError } from "axios";

export interface PlatformAgentsPagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PlatformAgentsApiResponse {
  message: string;
  data: ApiAgent[];
  pagination: PlatformAgentsPagination;
}

export interface PlatformAgentsResult {
  agents: Agent[];
  pagination: PlatformAgentsPagination;
}

const GET_PLATFORM_AGENTS_URL = "/api/marketplace/v1/agents/";

export interface GetPlatformAgentsParams {
  search?: string;
  page?: number;
  page_size?: number;
  category?: string;
}

const getPlatformAgentsList = async (
  params: GetPlatformAgentsParams = {}
): Promise<PlatformAgentsResult> => {
  try {
    const response = await axios.get<PlatformAgentsApiResponse>(GET_PLATFORM_AGENTS_URL, {
      params: { ...params, category: "internal" },
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

export interface UsePlatformAgentsOptions {
  search?: string;
  page?: number;
  pageSize?: number;
  enabled?: boolean;
  config?: Omit<
    import("@tanstack/react-query").UseQueryOptions<PlatformAgentsResult, AxiosError>,
    "queryKey" | "queryFn"
  >;
}

export const usePlatformAgentsList = ({
  search,
  page = 1,
  pageSize = 12,
  enabled = true,
  config,
}: UsePlatformAgentsOptions = {}) => {
  return useQuery<PlatformAgentsResult, AxiosError>({
    queryKey: ["platform-agents-list", { search, page, pageSize }],
    queryFn: () =>
      getPlatformAgentsList({
        search: search || undefined,
        page,
        page_size: pageSize,
      }),
    placeholderData: keepPreviousData,
    enabled,
    ...config,
  });
};
