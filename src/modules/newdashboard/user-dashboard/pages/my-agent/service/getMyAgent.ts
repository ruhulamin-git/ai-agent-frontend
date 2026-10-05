import { axios, handleApiError, toCamelCase } from "@/utils";

import type { MyAgentsResponse, MyAgentSubscription } from "./types";

const MY_AGENTS_URL = "/api/marketplace/v1/my-agents/";

export const getMyAgents = async (
  params: {
    page?: number;
    page_size?: number;
  } = {}
): Promise<MyAgentsResponse> => {
  try {
    const response = await axios.get<MyAgentsResponse>(MY_AGENTS_URL, { params });
    const data = toCamelCase(response);
    return data;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

export const getMyAgentById = async (id: number): Promise<MyAgentSubscription | null> => {
  try {
    const response = await axios.get(`${MY_AGENTS_URL}${id}/`);
    // Assuming backend wraps the detail in a data property, or standard structure
    // Since axios.get resolves to the response body via interceptor,
    // response might be the object itself, or { data: {...} }. We handle both using toCamelCase
    const data = toCamelCase(response);
    // If backend returns { data: ... } we return data.data, otherwise we return data itself
    return data?.data || data || null;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};
