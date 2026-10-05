import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase, toSnakeCase } from "@/utils";

import type {
  UpdateUserAgentPayload,
  UserAgent,
  UserAgentResponse,
  UseUserAgentsOptions,
} from "./types";
import type { QueryConfig } from "@/utils/reactQuery";

const USER_AGENTS_URL = "/api/ai-agents/v1/user-agents/";

// Get all user agents
const getUserAgents = async (
  params: { search?: string; status?: string } = {}
): Promise<UserAgent[]> => {
  try {
    const response = await axios.get<UserAgentResponse>(USER_AGENTS_URL, { params });
    const data = toCamelCase(response);
    return data.data || [];
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

// Get single user agent
const getUserAgent = async (id: string | number): Promise<UserAgent> => {
  try {
    const response = await axios.get(`${USER_AGENTS_URL}${id}/`);
    const data = toCamelCase(response);
    return data.data || data;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

// Update user agent
const updateUserAgent = async (
  id: string | number,
  payload: UpdateUserAgentPayload
): Promise<UserAgent> => {
  try {
    const snakeCasePayload = toSnakeCase(payload as Record<string, unknown>);
    const response = await axios.put(`${USER_AGENTS_URL}${id}/`, snakeCasePayload);
    const data = toCamelCase(response);
    return data.data || data;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

// Delete user agent
const deleteUserAgent = async (id: string | number): Promise<void> => {
  try {
    await axios.delete(`${USER_AGENTS_URL}${id}/`);
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

type GetUserAgentsOptions = {
  config?: QueryConfig<typeof getUserAgents>;
};

export const useUserAgentsList = ({
  search,
  status,
  enabled = true,
  config,
}: UseUserAgentsOptions & GetUserAgentsOptions = {}) => {
  return useQuery({
    queryKey: ["user-agents-list", { search, status }],
    queryFn: () => getUserAgents({ search, status }),
    placeholderData: keepPreviousData,
    enabled,
    ...config,
  });
};

export const useUserAgent = (id: string | number, enabled = true) => {
  return useQuery({
    queryKey: ["user-agent", id],
    queryFn: () => getUserAgent(id),
    enabled: enabled && !!id,
  });
};

export const useUpdateUserAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: UpdateUserAgentPayload }) =>
      updateUserAgent(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user-agent", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["user-agents-list"] });
    },
  });
};

export const useDeleteUserAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => deleteUserAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-agents-list"] });
    },
  });
};
