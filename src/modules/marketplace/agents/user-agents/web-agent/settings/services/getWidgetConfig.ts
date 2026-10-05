// Get widget configuration for a user agent
import { useQuery } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

import type { WidgetConfig, WidgetConfigResponse } from "../types";
import type { AxiosError } from "axios";

const WIDGET_CONFIG_URL = (agentId: string | number) =>
  `/api/ai-agents/v1/user-agents/${agentId}/widget-config/`;

const getWidgetConfig = async (agentId: string | number): Promise<WidgetConfig> => {
  try {
    const response = await axios.get<WidgetConfigResponse>(WIDGET_CONFIG_URL(agentId));
    const data = toCamelCase(response);
    return data.data.config;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

interface UseWidgetConfigOptions {
  agentId: string | number;
  enabled?: boolean;
}

export const useWidgetConfig = ({ agentId, enabled = true }: UseWidgetConfigOptions) => {
  return useQuery<WidgetConfig, AxiosError>({
    queryKey: ["widget-config", agentId],
    queryFn: () => getWidgetConfig(agentId),
    enabled: enabled && !!agentId,
  });
};
