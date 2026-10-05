import { useQuery } from "@tanstack/react-query";

import { getCommunityAgentSettingsMock } from "./mockData";

import type { CommunityAgentSettings } from "../types";
import type { AxiosError } from "axios";

interface UseCommunityAgentSettingsOptions {
  agentId: string | number;
  enabled?: boolean;
}

const getCommunityAgentSettings = async (
  agentId: string | number
): Promise<CommunityAgentSettings> => {
  // TODO: Replace with real API call
  return getCommunityAgentSettingsMock(agentId);
};

export const useCommunityAgentSettings = ({
  agentId,
  enabled = true,
}: UseCommunityAgentSettingsOptions) => {
  return useQuery<CommunityAgentSettings, AxiosError>({
    queryKey: ["community-agent-settings", agentId],
    queryFn: () => getCommunityAgentSettings(agentId),
    enabled: enabled && !!agentId,
  });
};
