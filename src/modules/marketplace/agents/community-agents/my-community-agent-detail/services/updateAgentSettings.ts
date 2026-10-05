import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCommunityAgentSettingsMock } from "./mockData";

import type { CommunityAgentSettings } from "../types";
import type { AxiosError } from "axios";

interface UpdateAgentSettingsVars {
  agentId: string | number;
  data: Partial<CommunityAgentSettings>;
}

const updateAgentSettings = async ({
  agentId,
  data,
}: UpdateAgentSettingsVars): Promise<CommunityAgentSettings> => {
  // TODO: Replace with real API call
  return updateCommunityAgentSettingsMock(agentId, data);
};

export const useUpdateAgentSettings = () => {
  const queryClient = useQueryClient();

  return useMutation<CommunityAgentSettings, AxiosError, UpdateAgentSettingsVars>({
    mutationFn: updateAgentSettings,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["community-agent-settings", variables.agentId],
      });
    },
  });
};
