import { useQuery } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

import { mapApiAgentToAgent } from "../../shared/utils/mapping";

import type { UseAgentDetailsOptions } from "../../agent-details/services/types";
import type { Agent } from "../../shared/types";
import type { AxiosError } from "axios";

const GET_PUBLIC_AGENT_DETAILS_URL = (id: string | number) =>
  `/api/marketplace/v1/agents/public/${id}/`;

const getPublicAgentDetails = async (id: string | number): Promise<Agent | null> => {
  try {
    const response = await axios.get(GET_PUBLIC_AGENT_DETAILS_URL(id));
    const data = toCamelCase(response);
    return mapApiAgentToAgent(data.data);
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

export const useCommunityAgentDetails = ({
  id,
  enabled = true,
  config,
}: UseAgentDetailsOptions) => {
  return useQuery<Agent | null, AxiosError>({
    queryKey: ["agent-details", "public", id],
    queryFn: () => getPublicAgentDetails(id),
    enabled: enabled && !!id,
    ...config,
  });
};
