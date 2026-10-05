import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { axios, toCamelCase } from "@/utils";
import { handleApiError } from "@/utils/handleApiError";

import type { CommentDTO, CreateCommentDTO } from "./types";
import type { MutationConfig } from "@/utils/reactQuery";

interface CreateCommentParams {
  agentId: string;
  data: CreateCommentDTO;
}

export const createComment = async ({
  agentId,
  data,
}: CreateCommentParams): Promise<CommentDTO> => {
  try {
    const url = `/api/marketplace/v1/agents/${agentId}/comments/`;
    const response = await axios.post(url, data);
    return toCamelCase(response.data) as CommentDTO;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

interface UseCreateCommentMutationOptions {
  config?: MutationConfig<typeof createComment>;
}

export const useCreateCommentMutation = ({ config }: UseCreateCommentMutationOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["agent-comments"] });
      toast.success("Comment posted successfully");
      if (config?.onSuccess) {
        config.onSuccess(data, ...args);
      }
    },
    ...config,
  });
};
