import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

import type { Agent, AgentsApiResponse, UseAgentsOptions } from "./type";
import type { AxiosError } from "axios";

const AGENTS_URL = "/api/marketplace/v1/agents/public";

const getAgentsList = async (
  params: {
    search?: string;
    source_type?: string;
    agent_type?: string;
    category?: string;
    pricing_type?: string;
    tags?: string;
    page?: number;
    page_size?: number;
  } = {}
): Promise<AgentsApiResponse> => {
  try {
    const response = await axios.get<AgentsApiResponse>(AGENTS_URL, { params });
    const data = toCamelCase(response);
    return data;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

const getAgentById = async (id: string | number): Promise<Agent> => {
  try {
    const response = await axios.get<{ data: Agent }>(`/api/marketplace/v1/agents/public/${id}/`);
    const data = toCamelCase(response);
    return data.data;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

const getAgentBySlug = async (slug: string): Promise<Agent> => {
  try {
    // First get all agents to find the one matching the slug
    const response = await getAgentsList();
    const agent = response.data.find((agent) => {
      const agentSlug = agent.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      return agentSlug === slug;
    });

    if (!agent) {
      throw new Error(`Agent with slug "${slug}" not found`);
    }

    // Then get the full details using the ID
    return await getAgentById(agent.id);
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

export const useAgentsList = ({
  search,
  sourceType,
  agentType,
  category,
  pricingType,
  tags,
  page = 1,
  pageSize = 12,
  enabled = true,
  config,
}: UseAgentsOptions = {}) => {
  return useQuery<AgentsApiResponse, AxiosError>({
    queryKey: [
      "newmarketplace-agents",
      { search, sourceType, agentType, category, pricingType, tags, page, pageSize },
    ],
    queryFn: () =>
      getAgentsList({
        search,
        source_type: sourceType,
        agent_type: agentType,
        category,
        pricing_type: pricingType,
        tags: tags?.join(","),
        page,
        page_size: pageSize,
      }),
    placeholderData: keepPreviousData,
    enabled,
    ...config,
  });
};

export const useAgent = (id: string | number, enabled = true) => {
  return useQuery<Agent, AxiosError>({
    queryKey: ["newmarketplace-agent", id],
    queryFn: () => getAgentById(id),
    enabled: enabled && !!id,
  });
};

export const useAgentBySlug = (slug: string, enabled = true) => {
  return useQuery<Agent, AxiosError>({
    queryKey: ["newmarketplace-agent-slug", slug],
    queryFn: () => getAgentBySlug(slug),
    enabled: enabled && !!slug,
  });
};

// Export the raw functions for use in other hooks
export { getAgentById, getAgentBySlug, getAgentsList };
