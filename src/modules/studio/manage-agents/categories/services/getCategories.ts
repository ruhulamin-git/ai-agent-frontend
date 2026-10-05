import { useQuery } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

import type { AxiosError } from "axios";

const GET_CATEGORIES_URL = "/api/ai-agents/v1/agent-categories/?page_size=100";

interface Category {
  id: number;
  name: string;
  description?: string;
  slug?: string;
  order?: number;
}

interface CategoriesResponse {
  data: Category[];
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

const useGetCategories = () => {
  return useQuery<Category[], AxiosError>({
    queryKey: ["agent-categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export { useGetCategories };
export type { Category };
