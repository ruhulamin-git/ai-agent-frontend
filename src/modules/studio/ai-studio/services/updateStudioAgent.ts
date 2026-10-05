import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateStudioAgentDTO } from "../types";
import type { AxiosError } from "axios";

const MOCK_MUTATION_DELAY_MS = 400;

interface UpdateStudioAgentPayload {
  agentId: string;
  payload: UpdateStudioAgentDTO;
}

// API function — mock for now, swap with axios call later
const updateStudioAgent = async (
  _agentId: string,
  _payload: UpdateStudioAgentDTO
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_MUTATION_DELAY_MS));
};

const useUpdateStudioAgent = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, UpdateStudioAgentPayload>({
    mutationFn: ({ agentId, payload }) => updateStudioAgent(agentId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["studio-agent-detail", variables.agentId] });
      queryClient.invalidateQueries({ queryKey: ["studio-agents-list"] });
    },
  });
};

export { useUpdateStudioAgent };
