import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { axios, handleApiError, objectToFormData, toCamelCase, toSnakeCase } from "@/utils";

import type { AxiosError } from "axios";

const GET_CATEGORIES_URL = "/api/ai-agents/v1/agent-categories/?page_size=100";
const UPDATE_AGENT_URL = (id: string) => `/api/ai-agents/v1/user-created-agents/${id}/`;

export interface Category {
  id: number;
  name: string;
  description?: string;
  slug?: string;
  order?: number;
}

interface CategoriesResponse {
  data: Category[];
}

export interface UpdateAgentData {
  name?: string;
  description?: string;
  welcomeMessage?: string;
  shortDescription?: string;
  longDescription?: string;
  demoUrl?: string;
  category?: number;
  tags?: string[];
  icon?: File | null;
  coverImage?: File | null;
  iconRemoved?: boolean;
  coverRemoved?: boolean;
}

interface UpdateAgentPayload {
  agentId: string;
  data: UpdateAgentData;
}

const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get<CategoriesResponse>(GET_CATEGORIES_URL);
    const data = toCamelCase(response.data?.data ?? response.data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

const updateAgent = async (agentId: string, data: UpdateAgentData): Promise<void> => {
  const { tags, icon, coverImage, iconRemoved, coverRemoved, ...rest } = data;
  const snaked = toSnakeCase(rest);

  const formData = objectToFormData(snaked);

  if (tags !== undefined) {
    formData.append("tags", JSON.stringify(tags));
  }

  // Handle icon
  if (icon !== undefined) {
    formData.append("icon", icon === null ? "null" : icon);
  } else if (iconRemoved) {
    formData.append("icon", "null");
  }

  // Handle cover image
  if (coverImage !== undefined) {
    formData.append("cover_image", coverImage === null ? "null" : coverImage);
  } else if (coverRemoved) {
    formData.append("cover_image", "null");
  }

  try {
    await axios.put(UPDATE_AGENT_URL(agentId), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

export const useGetCategories = () => {
  return useQuery<Category[], AxiosError>({
    queryKey: ["agent-categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, UpdateAgentPayload>({
    mutationFn: ({ agentId, data }) => updateAgent(agentId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user-agent-detail", variables.agentId] });
      queryClient.invalidateQueries({ queryKey: ["user-created-agents-list"] });
    },
  });
};
