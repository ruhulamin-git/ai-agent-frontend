import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

import { mapApiAgentToAgent } from "../../shared/utils/mapping";

import type { Agent } from "../../shared/types";
import type { ApiAgent } from "../../shared/utils/mapping";
import type { AxiosError } from "axios";

export interface MyCommunityAgentsPagination {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  numPages: number;
}

export interface ApiMyCommunityAgent {
  id: number;
  agent: {
    id: number;
    name: string;
    displayTitle: string;
    agentType: string;
    sourceType: string;
    iconUrl: string | null;
    isPublished: boolean;
  };
  pricingPlan: {
    id: number;
    name: string;
    pricingType: string;
    price: string;
    currency: string;
    trialDays: number;
  };
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt: string | null;
  isLifetime: boolean;
  cancelAtPeriodEnd: boolean;
  cancelledAt: string | null;
  createdAt: string;
}

export interface MyCommunityAgentsResult {
  agents: Agent[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface MyCommunityAgentsApiResponse {
  message: string;
  data: ApiMyCommunityAgent[];
  pagination: MyCommunityAgentsPagination;
}

const GET_MY_COMMUNITY_AGENTS_URL = "/api/marketplace/v1/my-agents/";

export interface GetMyCommunityAgentsParams {
  search?: string;
  page?: number;
  page_size?: number;
}

const getMyCommunityAgentsList = async (
  params: GetMyCommunityAgentsParams = {}
): Promise<MyCommunityAgentsResult> => {
  try {
    const response = await axios.get<MyCommunityAgentsApiResponse>(GET_MY_COMMUNITY_AGENTS_URL, {
      params,
    });
    const data = toCamelCase(response);

    const agents = (data.data || []).map((item: ApiMyCommunityAgent) => {
      // Map the nested agent and pricing_plan to the ApiAgent format expected by mapApiAgentToAgent
      const apiAgent: ApiAgent = {
        id: item.id,
        name: item.agent.name,
        description:
          item.agent.displayTitle && item.agent.displayTitle !== item.agent.name
            ? item.agent.displayTitle
            : "No description available.", // Let the UI handle empty descriptions or show a simple placeholder
        agentType: item.agent.agentType,
        welcomeMessage: "", // Default empty as it's not in the response
        isActive: item.agent.isPublished,
        iconUrl: item.agent.iconUrl,
        pricingPlans: [
          {
            id: item.pricingPlan.id,
            name: item.pricingPlan.name,
            pricingType: item.pricingPlan.pricingType as any,
            price: item.pricingPlan.price,
            currency: item.pricingPlan.currency,
            maxMessagesPerMonth: 0, // Not available in this specific entry
            maxIntegrations: 0,
            trialDays: item.pricingPlan.trialDays,
            isActive: true,
          },
        ],
      };
      return mapApiAgentToAgent(apiAgent);
    });

    return {
      agents,
      pagination: {
        total: data.pagination?.totalCount ?? 0,
        page: data.pagination?.currentPage ?? 1,
        pageSize: data.pagination?.pageSize ?? 12,
        totalPages: data.pagination?.numPages ?? 1,
      },
    };
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

export interface UseMyCommunityAgentsOptions {
  search?: string;
  page?: number;
  pageSize?: number;
  enabled?: boolean;
  config?: Omit<
    import("@tanstack/react-query").UseQueryOptions<MyCommunityAgentsResult, AxiosError>,
    "queryKey" | "queryFn"
  >;
}

export const useMyCommunityAgentsList = ({
  search,
  page = 1,
  pageSize = 12,
  enabled = true,
  config,
}: UseMyCommunityAgentsOptions = {}) => {
  return useQuery<MyCommunityAgentsResult, AxiosError>({
    queryKey: ["my-community-agents-list", { search, page, pageSize }],
    queryFn: () =>
      getMyCommunityAgentsList({
        search: search || undefined,
        page,
        page_size: pageSize,
      }),
    placeholderData: keepPreviousData,
    enabled,
    ...config,
  });
};
