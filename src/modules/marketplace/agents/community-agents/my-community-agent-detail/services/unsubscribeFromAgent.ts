import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axios } from "@/utils/axios";
import { toCamelCase } from "@/utils/toCamelCase";
import { toSnakeCase } from "@/utils/toSnakeCase";

import type { UnsubscribePayload, UnsubscribeResponse } from "../types";
import type { AxiosError } from "axios";

interface UnsubscribeFromAgentVars {
  agentId: string | number;
  data?: UnsubscribePayload;
}

const unsubscribeFromAgent = async ({
  agentId,
  data,
}: UnsubscribeFromAgentVars): Promise<UnsubscribeResponse> => {
  const response = await axios.delete(`/api/marketplace/v1/agents/${agentId}/unsubscribe/`, {
    data: toSnakeCase(data),
  });
  return toCamelCase(response);
};

export const useUnsubscribeFromAgent = () => {
  const queryClient = useQueryClient();

  return useMutation<UnsubscribeResponse, AxiosError, UnsubscribeFromAgentVars>({
    mutationFn: unsubscribeFromAgent,
    onSuccess: (_data: UnsubscribeResponse, variables: UnsubscribeFromAgentVars) => {
      queryClient.invalidateQueries({
        queryKey: ["my-community-agent-detail", variables.agentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-community-agents-list"],
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-community-agents-list"],
      });
    },
  });
};
