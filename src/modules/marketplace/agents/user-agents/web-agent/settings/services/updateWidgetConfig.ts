// Update widget configuration for a user agent
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase, toSnakeCase } from "@/utils";

import type { UpdateWidgetConfigDTO, WidgetConfig } from "../types";

const WIDGET_CONFIG_URL = (agentId: string | number) =>
  `/api/ai-agents/v1/user-agents/${agentId}/widget-config/`;

const updateWidgetConfig = async (
  agentId: string | number,
  data: UpdateWidgetConfigDTO
): Promise<WidgetConfig> => {
  try {
    const payload = toSnakeCase({ ...data });
    const response = await axios.post(WIDGET_CONFIG_URL(agentId), payload);
    const result = toCamelCase(response);
    return result.data || result;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

interface UpdateWidgetConfigMutationParams {
  agentId: string | number;
  data: UpdateWidgetConfigDTO;
}

export const useUpdateWidgetConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ agentId, data }: UpdateWidgetConfigMutationParams) =>
      updateWidgetConfig(agentId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["widget-config", variables.agentId] });
    },
  });
};
