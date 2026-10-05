// Get embed code for user agent widget
import { useQuery } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

interface EmbedCodeResponse {
  embedCode: string;
  widgetId: string;
  instructions: string;
}

interface EmbedCodeApiResponse {
  path: string;
  timestamp: string;
  status: string;
  message: string;
  data: EmbedCodeResponse;
  errors: unknown;
}

const EMBED_CODE_URL = (agentId: string | number) =>
  `/api/ai-agents/v1/user-agents/${agentId}/embed-code/`;

const getEmbedCode = async (agentId: string | number): Promise<EmbedCodeResponse> => {
  try {
    const response = await axios.get<EmbedCodeApiResponse>(EMBED_CODE_URL(agentId));
    const data = toCamelCase(response);
    return data.data;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

interface UseEmbedCodeOptions {
  agentId: string | number;
  enabled?: boolean;
}

export const useEmbedCode = ({ agentId, enabled = true }: UseEmbedCodeOptions) => {
  return useQuery({
    queryKey: ["embed-code", agentId],
    queryFn: () => getEmbedCode(agentId),
    enabled: enabled && !!agentId,
  });
};

export type { EmbedCodeResponse };
