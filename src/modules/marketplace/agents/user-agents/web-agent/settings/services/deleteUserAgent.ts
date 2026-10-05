// Delete user agent
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axios, handleApiError } from "@/utils";

const USER_AGENT_URL = (id: string | number) => `/api/ai-agents/v1/user-agents/${id}/`;

const deleteUserAgent = async (id: string | number): Promise<void> => {
  try {
    await axios.delete(USER_AGENT_URL(id));
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

export const useDeleteUserAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => deleteUserAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-agents-list"] });
    },
  });
};
