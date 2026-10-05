import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axios, toCamelCase } from "@/utils";
import { handleApiError } from "@/utils/handleApiError";

import type { ReviewListResponse } from "./types";
import type { FilterType, URLParams } from "@/types";
import type { QueryConfig } from "@/utils/reactQuery";
import type { PaginationState, SortingState } from "@tanstack/react-table";

const GET_REVIEWS_URL = (
  agentId: string,
  params?: URLParams,
  filters?: FilterType,
  sorting?: SortingState
): string => {
  let baseUrl = `/api/marketplace/v1/agents/${agentId}/reviews/`;
  const query: string[] = [];

  if (params?.page) query.push(`page=${params.page}`);
  if (params?.pageSize) query.push(`page_size=${params.pageSize}`);

  // Handle sorting if present
  if (sorting && sorting.length > 0) {
    const sortField = sorting[0].id;
    const sortDirection = sorting[0].desc ? "-" : "";
    query.push(`ordering=${sortDirection}${sortField}`);
  }

  // Handle filters if needed
  if (filters && filters.length > 0) {
    filters.forEach((filter) => {
      query.push(`${filter.id}=${filter.value}`);
    });
  }

  if (query.length > 0) {
    baseUrl += `?${query.join("&")}`;
  }

  return baseUrl;
};

export const getReviews = async (
  agentId: string,
  pagination?: PaginationState,
  filters?: FilterType,
  sorting?: SortingState
): Promise<ReviewListResponse | null> => {
  try {
    const params: URLParams | undefined = pagination
      ? { page: pagination.pageIndex + 1, pageSize: pagination.pageSize }
      : undefined;

    const url = GET_REVIEWS_URL(agentId, params, filters, sorting);
    const response = await axios.get<unknown, unknown>(url);
    const camelCasedData = toCamelCase(response) as ReviewListResponse & {
      pagination: { numPages?: number; totalPages?: number };
    };

    if (camelCasedData?.pagination?.numPages !== undefined) {
      camelCasedData.pagination.totalPages = camelCasedData.pagination.numPages;
    }

    return camelCasedData as ReviewListResponse;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

interface UseReviewsListOptions {
  agentId: string;
  pagination?: PaginationState;
  filters?: FilterType;
  sorting?: SortingState;
  enabled?: boolean;
  config?: QueryConfig<typeof getReviews>;
}

export const useReviewsList = ({
  agentId,
  pagination,
  filters,
  sorting,
  enabled = true,
  config,
}: UseReviewsListOptions) => {
  return useQuery({
    queryKey: ["agent-reviews", agentId, pagination, filters, sorting],
    queryFn: () => getReviews(agentId, pagination, filters, sorting),
    placeholderData: keepPreviousData,
    enabled: enabled && !!agentId,
    ...config,
  });
};
