import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axios, toCamelCase } from "@/utils";
import { handleApiError } from "@/utils/handleApiError";

import type { PaymentHistoryResponse } from "./types";
import type { PaginationState } from "@tanstack/react-table";
import type { AxiosError } from "axios";

const DEFAULT_PAGE_SIZE = 10;

const GET_PAYMENT_HISTORY_URL = (pageIndex: number, pageSize: number) =>
  `/api/marketplace/v1/purchase-history/?page=${pageIndex + 1}&page_size=${pageSize}`;

const getPaymentHistoryList = async (
  pagination?: PaginationState
): Promise<PaymentHistoryResponse | null> => {
  const pageIndex = pagination?.pageIndex ?? 0;
  const pageSize = pagination?.pageSize ?? DEFAULT_PAGE_SIZE;

  try {
    const response = await axios.get(GET_PAYMENT_HISTORY_URL(pageIndex, pageSize));
    return toCamelCase(response) as PaymentHistoryResponse;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

interface UsePaymentHistoryListOptions {
  pagination?: PaginationState;
  enabled?: boolean;
  config?: Omit<
    import("@tanstack/react-query").UseQueryOptions<PaymentHistoryResponse | null, AxiosError>,
    "queryKey" | "queryFn"
  >;
}

const usePaymentHistoryList = ({
  pagination,
  enabled = true,
  config,
}: UsePaymentHistoryListOptions = {}) => {
  return useQuery<PaymentHistoryResponse | null, AxiosError>({
    queryKey: ["purchase-history", pagination],
    queryFn: () => getPaymentHistoryList(pagination),
    placeholderData: keepPreviousData,
    enabled,
    ...(config || {}),
  });
};

export { usePaymentHistoryList };
