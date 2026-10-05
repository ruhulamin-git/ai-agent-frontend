import { useQuery } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

import type { IntegrationProviderDetails, IntegrationProviderDetailsResponse } from "../types";
import type { QueryConfig } from "@/utils/reactQuery";

const GET_PROVIDER_DETAILS_URL = (id: number, agentId?: number) => {
  const base = `/api/integration/v1/integration-providers/${id}/`;
  return agentId ? `${base}?agent_id=${agentId}` : base;
};

const getProviderDetails = async (
  id: number,
  agentId?: number
): Promise<IntegrationProviderDetails> => {
  try {
    const response = await axios.get(GET_PROVIDER_DETAILS_URL(id, agentId));
    const camelCased = toCamelCase(response) as IntegrationProviderDetailsResponse;
    return camelCased.data;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

interface UseProviderDetailsOptions {
  providerId: number;
  agentId?: number;
  enabled?: boolean;
  config?: QueryConfig<typeof getProviderDetails>;
}

const useProviderDetails = ({
  providerId,
  agentId,
  enabled = true,
  config,
}: UseProviderDetailsOptions) => {
  return useQuery({
    queryKey: ["integration-provider-details", providerId, agentId] as const,
    queryFn: () => getProviderDetails(providerId, agentId),
    enabled: enabled && providerId > 0,
    ...config,
  });
};

export { getProviderDetails, useProviderDetails };
