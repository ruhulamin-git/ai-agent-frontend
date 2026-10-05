import { useQuery } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

import { mapApiAgentToAgent } from "../../shared/utils/mapping";

import type { UseAgentDetailsOptions } from "../../agent-details/services/types";
import type { Agent } from "../../shared/types";
import type { AxiosError } from "axios";

const GET_EXTERNAL_AGENT_DETAILS_URL = (id: string | number) => `/api/marketplace/v1/agents/${id}/`;

const getExternalAgentDetails = async (id: string | number): Promise<Agent | null> => {
  try {
    const response = await axios.get(GET_EXTERNAL_AGENT_DETAILS_URL(id));
    const data = toCamelCase(response);

    // Verify this is an external agent
    if (data.data.sourceType !== "external") {
      throw new Error("Agent is not an external agent");
    }

    return mapApiAgentToAgent(data.data);
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

export const useExternalAgentDetails = ({ id, enabled = true, config }: UseAgentDetailsOptions) => {
  return useQuery<Agent | null, AxiosError>({
    queryKey: ["agent-details", "external", id],
    queryFn: () => getExternalAgentDetails(id),
    enabled: enabled && !!id,
    ...config,
  });
};
