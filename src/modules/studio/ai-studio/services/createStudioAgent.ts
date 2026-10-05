import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateStudioAgentDTO, StudioAgent } from "../types";
import type { AxiosError } from "axios";

const MOCK_CREATE_DELAY_MS = 400;

// API function — mock for now, swap with axios call later
const createStudioAgent = async (payload: CreateStudioAgentDTO): Promise<StudioAgent> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_CREATE_DELAY_MS));

  return {
    id: `agent-${Date.now()}`,
    name: payload.name,
    description: payload.description,
    status: "draft",
    nodesCount: payload.nodes.length,
    lastModified: "Just now",
  };
};

const useCreateStudioAgent = () => {
  const queryClient = useQueryClient();

  return useMutation<StudioAgent, AxiosError, CreateStudioAgentDTO>({
    mutationFn: createStudioAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studio-agents-list"] });
    },
  });
};

export { useCreateStudioAgent };
