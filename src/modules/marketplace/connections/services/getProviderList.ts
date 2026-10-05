import { useQuery } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

import type { IntegrationProvider, IntegrationProviderListResponse } from "../types";
import type { QueryConfig } from "@/utils/reactQuery";

const PROVIDER_LIST_URL = "/api/integration/v1/integration-providers/list/";

const getProviderList = async (): Promise<IntegrationProvider[]> => {
  try {
    const response = await axios.get(PROVIDER_LIST_URL);
    const camelCased = toCamelCase(response) as IntegrationProviderListResponse;
    return camelCased.data;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

interface UseProviderListOptions {
  config?: QueryConfig<typeof getProviderList>;
}

const useProviderList = ({ config }: UseProviderListOptions = {}) => {
  return useQuery({
    queryKey: ["integration-providers"] as const,
    queryFn: getProviderList,
    ...config,
  });
};

export { useProviderList };
