import { axios, handleApiError, toCamelCase } from "@/utils";

import type { UserAgent } from "./types";

const GET_AGENT_LIST_URL = (params?: { search?: string }): string => {
  let baseUrl = "/api/ai-agents/v1/user-created-agents/";
  const query: string[] = [];

  if (params?.search) {
    query.push(`search=${encodeURIComponent(params.search)}`);
  }

  if (query.length > 0) {
    baseUrl += `?${query.join("&")}`;
  }

  return baseUrl;
};

export const getAgentList = async (params?: { search?: string }): Promise<UserAgent[]> => {
  try {
    const response = await axios.get(GET_AGENT_LIST_URL(params));
    return toCamelCase(response.data?.data ?? response.data) as UserAgent[];
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};
