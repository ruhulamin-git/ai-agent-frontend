import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { AxiosError } from "axios";

const MOCK_DELETE_DELAY_MS = 300;

// API function — mock for now, swap with axios call later
const deleteStudioAgent = async (_agentId: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELETE_DELAY_MS));
};

const useDeleteStudioAgent = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: deleteStudioAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studio-agents-list"] });
    },
  });
};

export { useDeleteStudioAgent };
